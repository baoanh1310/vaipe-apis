import mongoose from 'mongoose'
import Blood from '../models/blood.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value } = req.body
    const img_path = req.file.path
    const blood = new Blood(
        {
            value,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await blood.save()
        return res.status(200).json({
            message: "Save new blood successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsBlood = async (req, res) => {
    try {
        let bloods = await Blood.find(mongoose.Schema.Types.ObjectId(req.profile._id))
        bloods = [...bloods]
        let result = []
        for (let val of bloods) {
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
    getStatsBlood
}