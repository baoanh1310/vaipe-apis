import mongoose from 'mongoose'
import Weight from '../models/weight.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value } = req.body
    const img_path = req.file.path
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
        let weights = await Weight.find(mongoose.Schema.Types.ObjectId(req.profile.userId))
        // let weights = await Weight.find(mongoose.Schema.Types.ObjectId(req.body.profile._id))
        weights = [...weights]
        let result = []
        for (let val of weights) {
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
            appStatus: -1,
            data: {}
        })
    }
}

export default {
    create,
    getStatsWeight
}