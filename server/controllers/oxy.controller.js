import mongoose from 'mongoose'
import Oxy from '../models/oxy.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value } = req.body
    const img_path = req.file.path
    const oxy = new Oxy(
        {
            value,
            img_path,
            user: req.auth.userId
        }
    )
    try {
        await oxy.save()
        return res.status(200).json({
            message: "Save new oxygen value successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsOxy = async (req, res) => {
    try {
        let oxys = await Oxy.find({ user: req.auth.userId })
        oxys = [...oxys]
        let result = []
        for (let val of oxys) {
            result.push({"created": val["created"], "value": val["value"]})
        }
        let obj = {
            "appStatus": 0,
            "data": {
                "result": result
            }
        }
        res.json(obj)
    } catch (err) {
        return res.status(400).json({
            // error: errorHandler.getErrorMessage(err)
            appStatus: -1,
            data: {}
        })
    }
}

export default {
    create,
    getStatsOxy
}