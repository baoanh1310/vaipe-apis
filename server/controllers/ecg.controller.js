import Ecg from '../models/ecg.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { name, value } = req.body
    // const img_path = req.file.path
    // let values = JSON.parse(value)
    let values = value
    // values = [...values]
    const ecg = new Ecg(
        {
            name: name,
            value: values,
            // img_path,
            user: req.auth.userId
        }
    )
    try {
        await ecg.save()
        return res.status(200).json({
            appStatus: 0,
            message: "Save new ECG values successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsEcg = async (req, res) => {
    try {
        let ecgs = await Ecg.find({ user: req.auth.userId })
        ecgs = [...ecgs]
        let result = []
        for (let val of ecgs) {
            result.push({"name": val['name'], "id": val['_id'], "created": val['created'], "value": val['value']})
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
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const deleteById = async (req, res) => {
    const id = req.params.id
    try {
        let ecg = await Ecg.findByIdAndRemove(id)
        if (!ecg) {
            return res.status(400).json({
                appStatus: -1,
                message: "Cannot delete not existed ecg"
            })
        }
        return res.status(200).json({
            message: "Delete ECG successfully!",
            deletedItem: ecg
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
        let ecg = await Ecg.findById(id)
        if (!ecg) {
            return res.status(400).json({
                appStatus: -1,
                message: "ECG not found"
            })
        }
        return res.status(200).json({
            value: ecg
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
    getStatsEcg,
    deleteById,
    getById
}