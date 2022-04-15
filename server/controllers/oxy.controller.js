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
            user: req.profile._id
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
        let oxys = await Oxy.find(mongoose.Schema.Types.ObjectId(req.profile._id)).select('value')
        oxys = [...oxys]
        let result = []
        for (let val of oxys) {
            result.push(val["value"])
        }
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    create,
    getStatsOxy
}