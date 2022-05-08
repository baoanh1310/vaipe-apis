import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const tokenList = {}

const signin = async (req, res) => {
    try {
        let user = await User.findOne({
            "email": req.body.email
        })
        if (!user)
            return res.status('401').json({
                appStatus: -1,
                error: "User not found"
        })

        if (!user.authenticate(req.body.password)) {
            return res.status('401').send({
                appStatus: -1,
                error: "Email and password don't match."
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, config.jwtSecret, { expiresIn: config.tokenLife, algorithm: 'RS256' })

        const refreshToken = jwt.sign({
            _id: user._id
        }, config.jwtRefreshSecret, { expiresIn: config.refreshTokenLife, algorithm: 'RS256' })

        // save refreshToken
        tokenList[refreshToken] = user._id

        // res.cookie("t", token, {
        //     expire: new Date() + 9999
        // })

        return res.json({
            token,
            refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (err) {

        return res.status('401').json({
            appStatus: -1,
            error: "Could not sign in"
        })

    }
}

const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

const requireSignin = expressJwt({
    secret: config.accessPublicKey,
    userProperty: 'auth',
    algorithms: ['RS256']
})

const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status('403').json({
            appStatus: -1,
            error: "User is not authorized"
        })
    }
    next()
}

const getNewToken = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status('403').json({
            appStatus: -1,
            error: "No refresh token provided"
        })
    }

    try {
        let user = await User.findOne({
            "_id": tokenList[refreshToken]
        })
        if (!user)
            return res.status('403').json({
                appStatus: -1,
                error: "Invalid refresh token"
        })

        // Create new access token
        const token = jwt.sign({
                        _id: user._id
                    }, config.jwtSecret, { expiresIn: config.tokenLife })
        
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {

        return res.status('401').json({
            appStatus: -1,
            error: "Cannot get new access token"
        })

    }
}

export default {
    signin,
    signout,
    requireSignin,
    hasAuthorization,
    getNewToken
}