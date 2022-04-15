import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'
import mailer from '../libs/mailer'
import { v4 as uuidv4 } from 'uuid'

const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
	let user_mail = req.body.email
	let user = await User.findOne({email: user_mail})
	let new_password = uuidv4().toString() // generate random new password
	user = extend(user, {password: new_password})
	user.updated = Date.now()
	await user.save()

	let content = `Your new password is ${new_password}\nPlease use it to login and change your password for secure purpose`
	let mail_subject = "VAIPE App - Reset Password"
	await mailer.sendMail(user_mail, mail_subject, content)
    } catch (err) {
	return res.status(400).json({
	    error: errorHandler.getErrorMessage(err)
	})
    }
}

const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const imgUpload = async (req, res) => {
    try {
        let user = req.profile
        user.avatar_path = req.file.path
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    create,
    userByID,
    read,
    list,
    remove,
    update,
    imgUpload,
    forgotPassword
}
