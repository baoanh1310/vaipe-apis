import mongoose from 'mongoose'
import WeekDay from '../models/weekDay.model'
import MedicineSchedule from '../models/medicineSchedule.model'
import DrugTakenInfo from '../models/drugTakenInfo.model'
import DrugTakenHistory from '../models/drugTakenHistory.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { drugTakenInfoId, weekDay, takenTimeId, date } = req.body
    let weekDayId
    try {
        let _weekDay = await WeekDay.findOne({ weekDay: weekDay })
        weekDayId = _weekDay._id
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }

    const drugTakenHistory = new DrugTakenHistory(
        {
            drugTakenInfoId: mongoose.Types.ObjectId(drugTakenInfoId),
            // weekDayId: mongoose.Types.ObjectId(weekDayId),
            weekDayId: weekDayId,
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
    const { weekDay } = req.body
    let weekDayId
    try {
        let _weekDay = await WeekDay.findOne({ weekDay: weekDay })
        weekDayId = _weekDay._id
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }

    try {
        let drugTakenHistory = await DrugTakenHistory.findById(id)
        // drugTakenHistory = extend(drugTakenHistory, req.body)
        drugTakenHistory.weekDayId = weekDayId
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

const deleteById = async (req, res) => {
    const id = req.params.id
    try {
        let history = await DrugTakenHistory.findByIdAndRemove(id)
        if (!history) {
            return res.status(400).json({
                appStatus: -1,
                message: "Cannot delete not existed history"
            })
        }
        return res.status(200).json({
            message: "Delete drug taken history successfully!",
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
    update,
    getDrugTakenHistoryByUserId,
    deleteById
}