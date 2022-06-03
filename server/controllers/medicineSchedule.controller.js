import MedicineSchedule from '../models/medicineSchedule.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { symtoms, diagnose } = req.body
    // const img_path = req.file.path
    const schedule = new MedicineSchedule(
        {
            symtoms,
            diagnose,
            user: req.auth.userId
        }
    )
    try {
        await schedule.save()
        return res.status(200).json({
            appStatus: 0,
            message: "Save new medicine schedule successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getSchedulesByUserId = async (req, res) => {
    try {
        let schedules = await MedicineSchedule.find({ user: req.auth.userId })
        schedules = [...schedules]
        let result = []
        for (let val of schedules) {
            result.push({"created": val["created"], "symtoms": val["symtoms"], "diagnose": val["diagnose"], "userId": val["user"]})
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
            data: {}
        })
    }
}


const deleteById = async (req, res) => {
    const id = req.params.id
    try {
        let schedule = await MedicineSchedule.findByIdAndRemove(id)
        if (!schedule) {
            return res.status(400).json({
                appStatus: -1,
                message: "Cannot delete not existed schedule"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            message: "Delete schedule successfully!",
            deletedItem: schedule
        })
    } catch (err) {
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getScheduleById = async (req, res) => {
    const id = req.params.id
    try {
        let schedule = await MedicineSchedule.findById(id)
        if (!schedule) {
            return res.status(400).json({
                message: "Schedule not found"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            schedule: schedule
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
    getSchedulesByUserId,
    getScheduleById,
    deleteById
}