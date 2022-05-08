import mongoose from 'mongoose'
import Prescription from '../models/prescription.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { name, drugs } = req.body
    const img_path = req.file.path
    let values = JSON.parse(drugs)
    values = [...values]
    console.log(values)
    const prescription = new Prescription(
        {
            name, name,
            drugs: values,
            img_path,
            user: req.auth.userId
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
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsPrescription = async (req, res) => {
    try {
        // let prescriptions = await Prescription.find(mongoose.Types.ObjectId(req.profile.userId))
        let prescriptions = await Prescription.find({ user: req.auth.userId })
        // let prescriptions = await Prescription.find(mongoose.Schema.Types.ObjectId(req.body.profile._id))
        prescriptions = [...prescriptions]
        let result = []
        for (let val of prescriptions) {
            result.push({"name": val['name'], "id": val['_id'], "created": val['created'], "drugs": val['drugs']})
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

const deleteById = async (req, res) => {
    const id = req.params.id
    try {
        let prescription = await Prescription.findByIdAndRemove(id)
        if (!prescription) {
            return res.status(400).json({
                appStatus: -1,
                message: "Cannot delete not existed prescription"
            })
        }
        return res.status(200).json({
            message: "Delete prescription successfully!",
            deletedItem: prescription
        })
    } catch (err) {
        return res.status(400).json({
            appStatus: -1,
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
            appStatus: 0,
            value: prescription
        })
    } catch (err) {
        return res.status(400).json({
            appStatus: -1,
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