import mongoose from 'mongoose'
import Prescription from '../models/prescription.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value } = req.body
    const img_path = req.file.path
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
        let prescriptions = await Prescription.find(mongoose.Schema.Types.ObjectId(req.profile._id))
        prescriptions = [...prescriptions]
        let result = []
        for (let val of prescriptions) {
            result.push({"id": val['_id'], "created": val['created'], "value": val['value']})
        }
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const deleteById = async (req, res) => {
    const id = req.params.id
    try {
        let prescription = await Prescription.findByIdAndRemove(id)
        if (!prescription) {
            return res.status(400).json({
                message: "Cannot delete not existed prescription"
            })
        }
        return res.status(200).json({
            message: "Delete prescription successfully!",
            deletedItem: prescription
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getById = async (req, res) => {
    const id = req.params.id
    try {
        let prescription = await Prescription.findById(id)
        if (!prescription) {
            return res.status(400).json({
                message: "Prescription not found"
            })
        }
        return res.status(200).json({
            value: prescription
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    create,
    getStatsPrescription,
    deleteById,
    getById
}