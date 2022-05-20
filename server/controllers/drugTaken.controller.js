import mongoose from 'mongoose'
import DrugTaken from '../models/drugTaken.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { userId, drugId, time } = req.body
    const history = new DrugTaken(
        {
            user: userId,
            drug: drugId,
            time: time
        }
    )
    try {
        await history.save()
        return res.status(200).json({
            message: "User took drug success successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getTakenHistoryByUserId = async (req, res) => {
    try {
        let list = await DrugTaken.find({ user: req.auth.userId })
        list = [...list]
        let result = []
        for (let val of list) {
            result.push({"userId": val['user'], "drug": val['drug'], "id": val['_id'], "time": val['time']})
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

const getById = async (req, res) => {
    const id = req.params.id
    try {
        let result = await DrugTaken.findById(id)
        if (!result) {
            return res.status(400).json({
                message: "Not found"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            value: result
        })
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
        let history = await DrugTaken.findByIdAndRemove(id)
        if (!history) {
            return res.status(400).json({
                appStatus: -1,
                message: "Cannot delete"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            message: "Delete successfully!",
            deletedItem: history
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
    getTakenHistoryByUserId,
    getById,
    deleteById
}