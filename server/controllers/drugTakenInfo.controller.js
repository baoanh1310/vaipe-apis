import mongoose from 'mongoose'
import Drug from '../models/drug.model'
import DrugTakenInfo from '../models/drugTakenInfo.model'
import DrugTakenHistory from '../models/drugTakenHistory.model'
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
                drugId: mongoose.Types.ObjectId(drugId),
                medicineScheduleId: mongoose.Types.ObjectId(medicineScheduleId),
                weekDays: weekDayIds,
                // takenTime: mongoose.Types.ObjectId(takenTimeId),
                startDate: startDate,
                endDate: endDate,
                numberPill: numberPill
            }
        )
        try {
            let drugTakenInfoRecord = await drugTakenInfo.save()
            // add takenTimeId to drugTakenInfo obj
            await DrugTakenInfo.findByIdAndUpdate(drugTakenInfoRecord._id,
                { $push: { takenTime: takenTimeId }},
                { new: true, useFindAndModify: false }
            )

            // add drugTakenInfoId to takenTime obj
            takenTime = extend(takenTime, { drugTakenInfoId: drugTakenInfo._id })
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
            let drugTakenInfos = await DrugTakenInfo.find({'medicineScheduleId': mongoose.Types.ObjectId(medicineScheduleId)})
            // console.log("DrugTakenInfo: ", drugTakenInfos)
            for (let info of drugTakenInfos) {
                let info_clone = JSON.parse(JSON.stringify(info))
                info_clone['weekDayIds'] = info_clone['weekDays']
                info_clone['weekDays'] = []
                for (let weekDayId of info_clone['weekDayIds']) {
                    let _weekDay = await WeekDay.findById(weekDayId)
                    let weekDay = _weekDay['weekDay']
                    info_clone['weekDays'].push(weekDay)
                }
                // info_clone['takenTimeIds'] = info_clone['takenTime']
                // info_clone['takenTime'] = []
                // for (let takenTimeId of info_clone['takenTimeIds']) {
                //     let _takenTime = await TakenTime.findById(takenTimeId)
                //     info_clone['takenTime'].push(_takenTime)
                // }

                result.push(info_clone)
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

const getDrugTakenInfoById = async (req, res) => {
    const id = req.params.id
    try {
        let schedules = await MedicineSchedule.find({ user: req.auth.userId })
        schedules = [...schedules]
        let scheduleIds = []
        for (let schedule of schedules) {
            scheduleIds.push(schedule._id)
        }
        let result = null
        for (let medicineScheduleId of scheduleIds) {
            let drugTakenInfos = await DrugTakenInfo.find({'medicineScheduleId': mongoose.Types.ObjectId(medicineScheduleId)})
            // console.log("DrugTakenInfo: ", drugTakenInfos)
            for (let info of drugTakenInfos) {
                if (info._id == id) {
                    let info_clone = JSON.parse(JSON.stringify(info))
                    info_clone['weekDayIds'] = info_clone['weekDays']
                    info_clone['weekDays'] = []
                    for (let weekDayId of info_clone['weekDayIds']) {
                        let _weekDay = await WeekDay.findById(weekDayId)
                        let weekDay = _weekDay['weekDay']
                        info_clone['weekDays'].push(weekDay)
                    }
                    result = info_clone
                    break
                }
            }
            if (result) break
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
    const date = req.query.date
    // console.log("Date param: ", date)
    try {
        let schedules = await MedicineSchedule.find({ user: req.auth.userId })
        schedules = [...schedules]
        let scheduleIds = []
        for (let schedule of schedules) {
            scheduleIds.push(schedule._id)
        }
        let result = {}
        let values = []
        for (let medicineScheduleId of scheduleIds) {
            let drugTakenInfos
            if (date) {
                let _date = new Date(date)
                drugTakenInfos = await DrugTakenInfo.find({
                    'medicineScheduleId': mongoose.Types.ObjectId(medicineScheduleId),
                    'startDate': { $lte: _date },
                    'endDate': { $gte: _date }
                })
                let _weekDay = _date.getDay() // Sunday: 0, Monday: 1, ...
                for (let info of drugTakenInfos) {
                    let _weekDays = info.weekDays
                    for (let _weekDayId of _weekDays) {
                        let _searchWeekDayObj = await WeekDay.findById(_weekDayId)
                        let _searchWeekDay = _searchWeekDayObj.weekDay
                        if (_searchWeekDay == _weekDay) {
                            let value = {}
                            value['weekDay'] = _weekDay
                            value['numberPill'] = info.numberPill
                            value['drugTakenInfoId'] = info._id
                            value['medicineScheduleId'] = info.medicineScheduleId
                            let _drug = await Drug.findById(info.drugId)
                            let drug = JSON.parse(JSON.stringify(_drug))
                            value['drugName'] = drug['info']['name']
                            value['drugImage'] = drug['info']['img_path']
                            
                            for (let takenTimeId of info.takenTime) {
                                let takenTimeObj = await TakenTime.findById(takenTimeId)
                                let newValue = JSON.parse(JSON.stringify(value))
                                newValue['hour'] = takenTimeObj['hour']
                                newValue['minute'] = takenTimeObj['minute']
                                newValue['beforeMeal'] = takenTimeObj['beforeMeal']
                                let finalValue = JSON.parse(JSON.stringify(newValue))
                                finalValue['wasTaken'] = false
                                let wasTaken = await DrugTakenHistory.findOne({
                                    'drugTakenInfoId': mongoose.Types.ObjectId(info._id),
                                    'takenTimeId': mongoose.Types.ObjectId(takenTimeId),
                                    'weekDayId': _weekDayId
                                })
                                if (wasTaken) {
                                    finalValue['wasTaken'] = true
                                }
                                values.push(finalValue)
                            }
                        }
                    }
                }
            } else {
                drugTakenInfos = await DrugTakenInfo.find({'medicineScheduleId': mongoose.Types.ObjectId(medicineScheduleId)})
                for (let info of drugTakenInfos) {
                    values.push(info)
                }
            }
            
        }
        result["values"] = values
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

const getDrugTakenInfos = async (req, res) => {
    try {
        let schedules = await MedicineSchedule.find({ user: req.auth.userId })
        schedules = [...schedules]
        let scheduleIds = []
        for (let schedule of schedules) {
            scheduleIds.push(schedule._id)
        }
        let result = {}
        let values = []
        for (let medicineScheduleId of scheduleIds) {
            let drugTakenInfos = await DrugTakenInfo.find({
                'medicineScheduleId': mongoose.Types.ObjectId(medicineScheduleId)
            })

            for (let info of drugTakenInfos) {
                    
                let value = {}
                value['numberPill'] = info.numberPill
                value['drugTakenInfoId'] = info._id
                value['medicineScheduleId'] = info.medicineScheduleId
                value['drugName'] = info['drugName']
                value['drugImage'] = info['drugImage']
                value['prefer'] = info['prefer']
                value['quantity'] = info['quantity']
                value['unit'] = info['unit']
                value['startDate'] = info['startDate']
                value['endDate'] = info['endDate']
                value['takenTimes'] = []

                let takenTimes = info['takenTimes']
                for (let takenTimeId of takenTimes) {
                    let takenTimeObj = await TakenTime.findById(takenTimeId)
                    value['takenTimes'].push({ 'hour': takenTimeObj['hour'], 'minute': takenTimeObj['minute'] })
                }

                values.push(value)
            }
        }
        result["values"] = values
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
    getDrugTakenInfoByUserId,
    getDrugTakenInfoByDate,
    getDrugTakenInfoById,
    getDrugTakenInfos
}