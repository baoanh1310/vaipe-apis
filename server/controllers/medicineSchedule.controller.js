import MedicineSchedule from '../models/medicineSchedule.model'
import Drug from '../models/drug.model'
import DrugTakenInfo from '../models/drugTakenInfo.model'
import DrugTakenHistory from '../models/drugTakenHistory.model'
import TakenTime from '../models/takenTime.model'
// import WeekDay from '../models/weekDay.model'
import errorHandler from '../helpers/dbErrorHandler'
import drugTakenInfoController from './drugTakenInfo.controller'
import mongoose from 'mongoose'

const create = async (req, res) => {
    const { symtoms, diagnose, drugs } = req.body
    // const img_path = req.file.path
    const schedule = new MedicineSchedule(
        {
            symtoms,
            diagnose,
            user: req.auth.userId,
            drugs: drugs
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
            let drugs = await Drug.find({
                '_id': { $in: val["drugs"]}
            })
            result.push({"id": val["_id"], "created": val["created"], "symtoms": val["symtoms"], "diagnose": val["diagnose"], "userId": val["user"], "drugs": drugs})
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

const createMedicineSchedule = async (req, res) => {
    const { symptoms, diagnose, drugTakenInfos } = req.body
    const schedule = new MedicineSchedule(
        {
            symptoms,
            diagnose,
            user: req.auth.userId
        }
    )
    try {
        // save new document to MedicineSchedule collection
        let scheduleObj = await schedule.save()

        // save new documents to DrugTakenInfo collection
        for (let drugInfo of drugTakenInfos) {
            // console.log("Info: ", drugInfo)
            // let { drugId, drugName, drugImage, startDate, endDate, numberPill, weekDays, takenTimes, prefer } = drugInfo
            let { drugId, drugName, drugImage, startDate, endDate, numberPill, takenTimes, prefer } = drugInfo
            let takenTimeIds = []
            for (let time of takenTimes) {
                let takenTime = await TakenTime.findOne({ 'hour': time['hour'], 'minute': time['minute'] })
                takenTimeIds.push(takenTime._id)
            }
            // console.log(takenTimeIds)
            // if (drugId == "") {
            //     let drug
            //     let drugSearch = await Drug.findOne({ drugName: drugName })
            //     if (drugSearch) {
            //         drugId = drugSearch._id
            //     } else {
            //         drug = new Drug(
            //             {
            //                 drugName: drugName,
            //                 drugImage: drugImage
            //             }
            //         )
            //         try {
            //             let drugObj = await drug.save()
            //             drugId = drugObj._id
            //             console.log("new drugId: ", drugId)
            //         } catch (err) {
            //             return res.status(400).json({
            //                 appStatus: -1,
            //                 error: errorHandler.getErrorMessage(err)
            //             })
            //         }
            //     }
            // } else {
            //     drugId = mongoose.Types.ObjectId(drugId)
            // }

            let drugSearch = await Drug.findOne({ drugName: drugName })
            let isStandardDrug = false
            if (drugSearch) {
                isStandardDrug = true
            }

            let drugTakenInfoObj = new DrugTakenInfo(
                {
                    medicineScheduleId: scheduleObj._id,
                    // drugId: drugId,
                    drugName: drugName,
                    drugImage: drugImage,
                    startDate: startDate,
                    endDate: endDate,
                    numberPill: numberPill,
                    prefer: prefer,
                    // weekDays: weekDayIds,
                    takenTimes: takenTimeIds,
                    isStandardDrug: isStandardDrug
                }
            )

            try {
                let drugTakenInfo = await drugTakenInfoObj.save()

                // save records to DrugTakenHistory table
                let drugTakenInfoId = drugTakenInfo._id
                let startDateObj = new Date(startDate)
                let endDateObj = new Date(endDate)
                for (let date = startDateObj; date <= endDateObj; date.setDate(date.getDate() + 1)) {
                    for (let takenTimeId of takenTimeIds) {
                        let drugTakenHistoryObj = new DrugTakenHistory(
                            {
                                drugTakenInfoId: drugTakenInfoId,
                                date: date,
                                takenTimeId: takenTimeId
                            }
                        )
                        try {
                            await drugTakenHistoryObj.save()
                        } catch (err) {
                            console.log(err.message)
                            return res.status(400).json({
                                appStatus: -1,
                                error: errorHandler.getErrorMessage(err)
                            })
                        }
                    }
                    
                }

            } catch (err) {
                console.log(err.message)
                return res.status(400).json({
                    appStatus: -1,
                    error: errorHandler.getErrorMessage(err)
                })
            }
        }

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

const getMedicineScheduleByDate = async (req, res) => {
    const date = req.query.date
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
                // let _weekDay = _date.getDay() // Sunday: 0, Monday: 1, ...
                for (let info of drugTakenInfos) {
                    
                    let value = {}
                    // value['weekDay'] = _weekDay
                    value['numberPill'] = info.numberPill
                    value['drugTakenInfoId'] = info._id
                    value['medicineScheduleId'] = info.medicineScheduleId
                    // let _drug = await Drug.findById(info.drugId)
                    // let drug = JSON.parse(JSON.stringify(_drug))
                    // value['drugName'] = drug['drugName']
                    value['drugName'] = info['drugName']
                    value['drugImage'] = info['drugImage']
                    value['prefer'] = info['prefer']
                    
                    for (let takenTimeId of info.takenTimes) {
                        let takenTimeObj = await TakenTime.findById(takenTimeId)
                        let newValue = JSON.parse(JSON.stringify(value))
                        newValue['hour'] = takenTimeObj['hour']
                        newValue['minute'] = takenTimeObj['minute']
                        let finalValue = JSON.parse(JSON.stringify(newValue))
                        finalValue['wasTaken'] = false
                        let wasTaken = await DrugTakenHistory.findOne({
                            'drugTakenInfoId': mongoose.Types.ObjectId(info._id),
                            'takenTimeId': mongoose.Types.ObjectId(takenTimeId),
                        })
                        finalValue['wasTaken'] = wasTaken.wasTaken
                        
                        values.push(finalValue)
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
        console.log(err.message)
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getNotStandardDrugsList = async (req, res) => {
    // {
    //     "value": [
    //         { "drugName": "Unknown", "numberAppear": 10 }
    //     ]
    // }
}

export default {
    create,
    createMedicineSchedule,
    getSchedulesByUserId,
    getScheduleById,
    getMedicineScheduleByDate,
    deleteById,
    getNotStandardDrugsList
}