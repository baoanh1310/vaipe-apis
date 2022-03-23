import mongoose from 'mongoose'
import Weight from '../models/weight.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value, img_path } = req.body
    const weight = new Weight(
        {
            value,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await weight.save()
        return res.status(200).json({
            message: "Save new weight successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsWeight = async (req, res) => {
    try {
        let weights = await Weight.find(mongoose.Schema.Types.ObjectId(req.profile._id)).select('value')
        weights = [...weights]
        let result = []
        for (let val of weights) {
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
    getStatsWeight
}