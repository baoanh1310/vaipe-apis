import Drug from '../models/drug.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { info } = req.body
    const drug = new Drug(
        {
            info: info
        }
    )
    try {
        await drug.save()
        return res.status(200).json({
            message: "Create new drug successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getById = async (req, res) => {
    const id = req.params.id
    try {
        let drug = await Drug.findById(id)
        if (!drug) {
            return res.status(400).json({
                appStatus: -1,
                message: "Drug not found"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            value: drug
        })
    } catch (err) {
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getDrugList = async (req, res) => {
    try {
        let list = await Drug.find()
        if (!list) {
            return res.status(400).json({
                message: "There's no drug"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            value: list
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
    getById,
    getDrugList
}