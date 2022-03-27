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
        let bloods = await Blood.find(mongoose.Schema.Types.ObjectId(req.profile._id)).select('value')
        bloods = [...bloods]
        let result = []
        for (let val of bloods) {
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
    getStatsBlood
}