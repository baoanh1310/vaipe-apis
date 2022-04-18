import mongoose from 'mongoose'
import Temperature from '../models/temperature.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value } = req.body
    const img_path = req.file.path
    const temperature = new Temperature(
        {
            value,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await temperature.save()
        return res.status(200).json({
            message: "Save new temperature successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsTemperature = async (req, res) => {
    try {
        let temperatures = await Temperature.find(mongoose.Schema.Types.ObjectId(req.profile._id))
        temperatures = [...temperatures]
        let result = []
        for (let val of temperatures) {
            result.push({"created": val["created"], "value": val["value"]})
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
    getStatsTemperature
}