import mongoose from 'mongoose'
import Prescription from '../models/prescription.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value, img_path } = req.body
    let values = JSON.parse(value)
    values = [...values]
    console.log(values)
    const prescription = new Prescription(
        {
            value: values,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await prescription.save()
        return res.status(200).json({
            message: "Save new prescription successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsPrescription = async (req, res) => {
    try {
        let prescriptions = await Prescription.find(mongoose.Schema.Types.ObjectId(req.profile._id)).select('value')
        prescriptions = [...prescriptions]
        let result = []
        for (let val of prescriptions) {
            result.push(val['value'])
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
    getStatsPrescription
}