import mongoose from 'mongoose'
import MedicineSchedule from '../models/medicineSchedule.model'
import DrugTakenInfo from '../models/drugTakenInfo.model'
import DrugTakenHistory from '../models/drugTakenHistory.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { drugTakenInfoId, weekDayId, takenTimeId, date } = req.body

    const drugTakenHistory = new DrugTakenHistory(
        {
            drugTakenInfoId: mongoose.Types.ObjectId(drugTakenInfoId),
            weekDayId: mongoose.Types.ObjectId(weekDayId),
            takenTimeId: mongoose.Types.ObjectId(takenTimeId),
            date: date
        }
    )
    try {
        await drugTakenHistory.save()
        return res.status(200).json({
            appStatus: 0,
            message: "Save new drug taken history successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const update = async (req, res) => {
    const id = req.params.id
    try {
        let drugTakenHistory = await DrugTakenHistory.findById(id)
        drugTakenHistory = extend(drugTakenHistory, req.body)
        drugTakenHistory.updated = Date.now()
        await drugTakenHistory.save()
        
        return res.status(200).json({
            appStatus: 0,
            message: "Update drug taken history successfully!"
        })
    } catch (err) {
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getDrugTakenHistoryByUserId = async (req, res) => {
    try {
        let schedules = await MedicineSchedule.find({ user: req.auth.userId })
        schedules = [...schedules]
        let scheduleIds = []
        for (let schedule of schedules) {
            scheduleIds.push(schedule._id)
        }
        let result = []
        for (let medicineScheduleId of scheduleIds) {
            let drugTakenInfos = await DrugTakenInfo.find({'medicineScheduleId': mongoose.Types.ObjectId(medicineScheduleId)})
            for (let info of drugTakenInfos) {
                let drugTakenHistories = await DrugTakenHistory.find({'drugTakenInfoId': info._id})
                for (let history of drugTakenHistories) {
                    result.push(history)
                }
            }
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

export default {
    create,
    update,
    getDrugTakenHistoryByUserId
}