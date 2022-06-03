import Receipt from '../models/medicineReceipt.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { name, drugs } = req.body
    // const img_path = req.file.path
    // let values = JSON.parse(drugs)
    console.log("drugs: ", drugs)
    let values = drugs
    values = [...values]
    // console.log(values)
    const receipt = new Receipt(
        {
            name: name,
            drugs: values,
            // img_path,
            user: req.auth.userId
        }
    )
    try {
        await receipt.save()
        return res.status(200).json({
            appStatus: 0,
            message: "Save new receipt successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsReceipt = async (req, res) => {
    try {
        // let receipts = await Receipt.find(mongoose.Types.ObjectId(req.profile.userId))
        let receipts = await Receipt.find({ user: req.auth.userId })
        // let receipts = await Receipt.find(mongoose.Schema.Types.ObjectId(req.body.profile._id))
        receipts = [...receipts]
        let result = []
        for (let val of receipts) {
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
        let receipt = await Receipt.findByIdAndRemove(id)
        if (!receipt) {
            return res.status(400).json({
                appStatus: -1,
                message: "Cannot delete not existed receipt"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            message: "Delete receipt successfully!",
            deletedItem: receipt
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
        let receipt = await Receipt.findById(id)
        if (!receipt) {
            return res.status(400).json({
                appStatus: -1,
                message: "Receipt not found"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            value: receipt
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
    getStatsReceipt,
    deleteById,
    getById
}