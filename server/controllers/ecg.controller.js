import mongoose from 'mongoose'
import Ecg from '../models/ecg.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value } = req.body
    const img_path = req.file.path
    let values = JSON.parse(value)
    values = [...values]
    const ecg = new Ecg(
        {
            value: values,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await ecg.save()
        return res.status(200).json({
            message: "Save new ECG values successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsEcg = async (req, res) => {
    try {
        let ecgs = await Ecg.find(mongoose.Schema.Types.ObjectId(req.profile._id))
        ecgs = [...ecgs]
        let result = []
        for (let val of ecgs) {
            result.push({"created": val['created'], "value": val['value']})
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
    getStatsEcg
}