import mongoose from 'mongoose'
import DrugTakenInfo from '../models/drugTakenInfo.model'
import TakenTime from '../models/takenTime.model'
import WeekDay from '../models/weekDay.model'
import MedicineSchedule from '../models/medicineSchedule.model'
import errorHandler from '../helpers/dbErrorHandler'
import { before } from 'lodash'
import extend from 'lodash/extend'


const create = async (req, res) => {
    const { drugId, medicineScheduleId, startDate, endDate, 
        numberPill, hour, minute, beforeMeal, weekDays } = req.body
    let takenTime = new TakenTime(
        {
            hour: hour,
            minute: minute,
            beforeMeal: beforeMeal
        }
    )
    try {
        let takenTimeRecord = await takenTime.save()
        const takenTimeId = takenTimeRecord._id
        let weekDayIds = []
        for (let day of weekDays) {
            let weekDay = await WeekDay.findOne({ 'weekDay': day })
            weekDayIds.push(weekDay._id)
        }
        
        const drugTakenInfo = new DrugTakenInfo(
            {
                drug: mongoose.Types.ObjectId(drugId),
                medicineSchedule: mongoose.Types.ObjectId(medicineScheduleId),
                weekDays: weekDayIds,
                takenTime: mongoose.Types.ObjectId(takenTimeId),
                startDate: startDate,
                endDate: endDate,
                numberPill: numberPill
            }
        )
        try {
            drugTakenInfo.save()
            // add drugTakenInfoId to takenTime obj
            takenTime = extend(takenTime, { drugTakenInfo: drugTakenInfo._id })
            takenTime.save()
            return res.status(200).json({
                appStatus: 0,
                message: "Save new drug taken info successfully!"
            })
        } catch (err) {
            console.log(err.message)
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getDrugTakenInfoByUserId = async (req, res) => {
    try {
        let schedules = await MedicineSchedule.find({ user: req.auth.userId })
        schedules = [...schedules]
        let scheduleIds = []
        for (let schedule of schedules) {
            scheduleIds.push(schedule._id)
        }
        let result = []
        for (let medicineScheduleId of scheduleIds) {
            let drugTakenInfos = await DrugTakenInfo.find({'medicineSchedule': mongoose.Types.ObjectId(medicineScheduleId)})
            console.log("DrugTakenInfo: ", drugTakenInfos)
            for (let info of drugTakenInfos) {
                result.push(info)
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
            data: {}
        })
    }
}

const getDrugTakenInfoByDate = async (req, res) => {
    
}

export default {
    create,
    getDrugTakenInfoByUserId,
    getDrugTakenInfoByDate
}