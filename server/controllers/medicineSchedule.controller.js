import MedicineSchedule from '../models/medicineSchedule.model'
import Drug from '../models/drug.model'
import DrugTakenInfo from '../models/drugTakenInfo.model'
import DrugTakenHistory from '../models/drugTakenHistory.model'
import TakenTime from '../models/takenTime.model'
// import WeekDay from '../models/weekDay.model'
import errorHandler from '../helpers/dbErrorHandler'
import mongoose from 'mongoose'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

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
            let { drugId, drugName, drugImage, startDate, endDate, numberPill, takenTimes, prefer, quantity, unit } = drugInfo
            let takenTimeIds = []
            for (let time of takenTimes) {
                let takenTime = await TakenTime.findOne({ 'hour': time['hour'], 'minute': time['minute'] })
                takenTimeIds.push(takenTime._id)
            }

            let isStandardDrug = false
            // let drugSearch = await Drug.findOne({ drugName: drugName })
            // if (drugSearch) {
            //     isStandardDrug = true
            // }
            if (drugId.length > 0) {
                isStandardDrug = true
            }

            // save uploaded image if drugImage != ""
            drugImage = drugImage.split(';base64,').pop()
            let img_name =  uuidv4().toString() + ".png"
            let img_path = '/root/baoanh/vaipe-apis/assets/' + img_name
            let img_url = 'http://103.226.249.176:5656/' + img_name
            fs.writeFile(img_path, drugImage, { encoding: 'base64' }, (err) => console.log("Write image success"))

            let drugTakenInfoObj = new DrugTakenInfo(
                {
                    medicineScheduleId: scheduleObj._id,
                    // drugId: drugId,
                    drugName: drugName,
                    drugImage: img_url,
                    startDate: startDate,
                    endDate: endDate,
                    numberPill: numberPill,
                    prefer: prefer,
                    // weekDays: weekDayIds,
                    takenTimes: takenTimeIds,
                    quantity: quantity,
                    unit: unit,
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
                    value['quantity'] = info['quantity']
                    value['unit'] = info['unit']
                    
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