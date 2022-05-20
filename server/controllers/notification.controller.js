import Notification from '../models/notification.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { userId, drugId, time } = req.body
    const noti = new Notification(
        {
            user: userId,
            drug: drugId,
            time: time
        }
    )
    try {
        await noti.save()
        return res.status(200).json({
            appStatus: 0,
            message: "Create new notification successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getNotiByUserId = async (req, res) => {
    try {
        let notifications = await Notification.find({ user: req.auth.userId })
        notifications = [...notifications]
        let result = []
        for (let val of notifications) {
            result.push({"userId": val['user'], "drugs": val['drugs'], "id": val['_id'], "time": val['time']})
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
        let notification = await Notification.findById(id)
        if (!notification) {
            return res.status(400).json({
                appStatus: -1,
                message: "Notification not found"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            value: notification
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
        let noti = await Notification.findByIdAndRemove(id)
        if (!noti) {
            return res.status(400).json({
                appStatus: -1,
                message: "Cannot delete not existed notification"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            message: "Delete notification successfully!",
            deletedItem: noti
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
    getNotiByUserId,
    getById,
    deleteById
}