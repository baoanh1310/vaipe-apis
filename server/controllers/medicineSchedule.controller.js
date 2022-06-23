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
    let { symptoms, diagnose, medicineScheduleName, medicineScheduleImage, drugTakenInfos } = req.body

    // save uploaded image if medicineScheduleImage != ""
    let medicine_img_name = ""
    let medicine_img_path = ""
    let medicine_img_url = ""
    if (medicineScheduleImage && medicineScheduleImage.length > 0) {
        medicineScheduleImage = medicineScheduleImage.split(';base64,').pop()
        medicine_img_name =  uuidv4().toString() + "icebear.png"
        medicine_img_path = '/root/baoanh/vaipe-apis/assets/' + medicine_img_name
        medicine_img_url = 'http://103.226.249.176:5656/' + medicine_img_name
        try {
            fs.writeFile(medicine_img_path, medicineScheduleImage, { encoding: 'base64' }, (err) => console.log("Write medicine image success"))
            
        } catch (err) {
            console.log("Cannot write medicine image file")
            return res.status(400).json({
                appStatus: -1,
                error: errorHandler.getErrorMessage(err)
            })
        }
    } 

    let schedule = new MedicineSchedule(
        {
            symptoms: symptoms,
            diagnose: diagnose,
            medicineScheduleName: medicineScheduleName,
            medicineScheduleImage: medicine_img_url,
            user: req.auth.userId
        }
    )
    try {
        // save new document to MedicineSchedule collection
        let scheduleObj = await schedule.save()

        // save new documents to DrugTakenInfo collection
        for (let drugInfo of drugTakenInfos) {
            // console.log("Info: ", drugInfo)
            let { drugId, drugName, drugImage, startDate, endDate, takenTimes, prefer, quantity, unit } = drugInfo
            let takenTimeIds = []
            for (let time of takenTimes) {
                let takenTime = await TakenTime.findOne({ 'hour': time['hour'], 'minute': time['minute'] })
                takenTimeIds.push(takenTime._id)
            }

            let isStandardDrug = false
            if (drugId.length > 0) {
                isStandardDrug = true
            }

            // save uploaded image if drugImage != ""
            let img_name = ""
            let img_path = ""
            let img_url = ""
            if (drugImage && drugImage.length > 0) {
                drugImage = drugImage.split(';base64,').pop()
                img_name =  uuidv4().toString() + ".png"
                img_path = '/root/baoanh/vaipe-apis/assets/' + img_name
                img_url = 'http://103.226.249.176:5656/' + img_name
                fs.writeFile(img_path, drugImage, { encoding: 'base64' }, (err) => console.log("Write image success"))
            } 
            console.log("Drug image url: ", img_url)

            let drugTakenInfoObj = new DrugTakenInfo(
                {
                    medicineScheduleId: scheduleObj._id,
                    // drugId: drugId,
                    drugName: drugName,
                    drugImage: img_url,
                    startDate: startDate,
                    endDate: endDate,
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

const updateMedicineSchedule = async (req, res) => {
    let { symptoms, diagnose, medicineScheduleName, medicineScheduleImage, drugTakenInfos } = req.body

    const id = req.params.id

    try {
        let schedule = await MedicineSchedule.findById(id)
        schedule.symptoms = symptoms
        schedule.diagnose = diagnose
        schedule.medicineScheduleName = medicineScheduleName

        // update uploaded image if medicineScheduleImage != ""
        let medicine_img_name = ""
        let medicine_img_path = ""
        let medicine_img_url = ""
        if (medicineScheduleImage && medicineScheduleImage.length > 0) {
            medicineScheduleImage = medicineScheduleImage.split(';base64,').pop()
            medicine_img_name =  uuidv4().toString() + "icebear.png"
            medicine_img_path = '/root/baoanh/vaipe-apis/assets/' + medicine_img_name
            medicine_img_url = 'http://103.226.249.176:5656/' + medicine_img_name
            try {
                fs.writeFile(medicine_img_path, medicineScheduleImage, { encoding: 'base64' }, (err) => console.log("Write medicine image success"))
                schedule.medicineScheduleImage = medicine_img_url
            } catch (err) {
                console.log("Cannot write medicine image file")
                return res.status(400).json({
                    appStatus: -1,
                    error: errorHandler.getErrorMessage(err)
                })
            }
        } 

        // update schedule record in db
        schedule.updatedAt = Date.now()
        await schedule.save()

        // update new documents to DrugTakenInfo collection
        for (let drugInfo of drugTakenInfos) {
            console.log("update drugInfo: ", drugInfo)
            try {
                let { drugTakenInfoId, drugId, drugName, drugImage, startDate, endDate, takenTimes, prefer, quantity, unit } = drugInfo
                let drugTakenInfoObj = await DrugTakenInfo.findById(drugTakenInfoId)

                drugTakenInfoObj.drugId = drugId
                drugTakenInfoObj.drugName = drugName
                drugTakenInfoObj.startDate = startDate
                drugTakenInfoObj.endDate = endDate
                drugTakenInfoObj.prefer = prefer
                drugTakenInfoObj.quantity = quantity
                drugTakenInfoObj.unit = unit
                let isStandardDrug = false
                if (drugId.length > 0) {
                    isStandardDrug = true
                }
                drugTakenInfoObj.isStandardDrug = isStandardDrug
                // update uploaded drug image if drugImage != ""
                let img_name = ""
                let img_path = ""
                let img_url = ""
                if (drugImage && drugImage.length > 0) {
                    drugImage = drugImage.split(';base64,').pop()
                    img_name =  uuidv4().toString() + ".png"
                    img_path = '/root/baoanh/vaipe-apis/assets/' + img_name
                    img_url = 'http://103.226.249.176:5656/' + img_name
                    fs.writeFile(img_path, drugImage, { encoding: 'base64' }, (err) => console.log("Write image success"))
                    drugTakenInfoObj['drugImage'] = img_url
                }
                let takenTimeIds = []
                for (let time of takenTimes) {
                    let takenTime = await TakenTime.findOne({ 'hour': time['hour'], 'minute': time['minute'] })
                    takenTimeIds.push(takenTime._id)
                }
                drugTakenInfoObj.takenTimes = takenTimeIds
                try {
                    await drugTakenInfoObj.save()

                    // update records to DrugTakenHistory table

                    // remove records in DrugTakenHistory table which have drugTakenInfoId and date from today's midnight to endDate
                    let initDate = new Date()
                    initDate.setUTCHours(24, 0, 0, 0)
                    let startDateObj = new Date(startDate)
                    let endDateObj = new Date(endDate)

                    for (let date = initDate; date <= endDateObj; date.setDate(date.getDate() + 1)) {
                        await DrugTakenHistory.deleteMany(
                            {
                                drugTakenInfoId: drugTakenInfoId,
                                date: date
                            }
                        )
                    }
                    initDate = new Date()
                    initDate.setUTCHours(24, 0, 0, 0)
                    console.log("Init date: ", initDate.toISOString())
                    console.log("End date: ", endDateObj.toISOString())


                    // add new records to DrugTakenHistory table which have drugTakenInfoId and date from today's midnight to endDate
                    for (let date = initDate; date <= endDateObj; date.setDate(date.getDate() + 1)) {
                        for (let takenTimeId of takenTimeIds) {
                            let drugTakenHistoryObj = new DrugTakenHistory(
                                {
                                    drugTakenInfoId: drugTakenInfoId,
                                    date: date,
                                    takenTimeId: takenTimeId
                                }
                            )
                            console.log("drugTakenHistoryObj", drugTakenHistoryObj)
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

                    // update records in DrugTakenInfoHistory table for 'today'
                    let today = new Date()
                    today.setUTCHours(0, 0, 0, 0)
                    console.log("Today: ", today.toISOString())
                    let todayHistoryObjs = await DrugTakenHistory.find({
                        date: today,
                        drugTakenInfoId: drugTakenInfoId
                    })
                    console.log("Today: ", todayHistoryObjs.length)
                    
                    // remove (if exists) records in DrugTakenHistory table which have date is today and takenTime > now()
                    for (let todayObj of todayHistoryObjs) {
                        let todayTakenTimeId = todayObj.takenTimeId
                        let takenTimeObj = await TakenTime.findById(todayTakenTimeId)
                        let now = new Date()
                        if (takenTimeObj.hour < now.getHours()) {
                            continue
                        } else if (takenTimeObj.hour == now.getHours()) {
                            if (takenTimeObj.minute < now.getMinutes()) {
                                continue
                            } else {
                                await DrugTakenHistory.deleteOne({
                                    takenTimeId: todayTakenTimeId,
                                    date: today,
                                    drugTakenInfoId: drugTakenInfoId
                                })
                            }
                        } else {
                            await DrugTakenHistory.deleteOne({
                                takenTimeId: todayTakenTimeId,
                                date: today,
                                drugTakenInfoId: drugTakenInfoId
                            })
                        }
                    }

                    // add new records to DrugTakenHistory table which have date is today and takenTime > now()
                    for (let takenTimeId of takenTimeIds) {
                        let takenTimeObj = await TakenTime.findById(takenTimeId)
                        let now = new Date()
                        if (takenTimeObj.hour > now.getHours() || (takenTimeObj.hour == now.getHours() && takenTimeObj.minute > now.getMinutes())) {
                            let drugTakenHistoryObj = new DrugTakenHistory(
                                {
                                    drugTakenInfoId: drugTakenInfoId,
                                    date: today,
                                    takenTimeId: takenTimeId
                                }
                            )
                            console.log("drugTakenHistoryObj", drugTakenHistoryObj)
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
            message: `Update medicine schedule ${id} successfully!`
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
                console.log("Get schedule by date, Date: ", date)
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

                    // new update 23/06
                    let takenTimesHistory = []
                    let takenTimesHistoryArr = await DrugTakenHistory.find({
                        'drugTakenInfoId': mongoose.Types.ObjectId(info._id),
                        'date': _date
                    })
                    for (let th of takenTimesHistoryArr) {
                        takenTimesHistory.push(th.takenTimeId)
                    }
                    console.log("takenTimesHistory: ", takenTimesHistory)
                    
                    // for (let takenTimeId of info.takenTimes) {
                    for (let takenTimeId of takenTimesHistory) {
                        let takenTimeObj = await TakenTime.findById(takenTimeId)
                        let newValue = JSON.parse(JSON.stringify(value))
                        newValue['hour'] = takenTimeObj['hour']
                        newValue['minute'] = takenTimeObj['minute']
                        let finalValue = JSON.parse(JSON.stringify(newValue))
                        finalValue['wasTaken'] = false
                        let wasTaken = await DrugTakenHistory.findOne({
                            'drugTakenInfoId': mongoose.Types.ObjectId(info._id),
                            'takenTimeId': mongoose.Types.ObjectId(takenTimeId),
                            'date': _date
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
        console.log("Result: ", result)
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

const getPrescriptionsList = async (req, res) => {
    try {
        let schedules = await MedicineSchedule.find({ user: req.auth.userId })
        schedules = [...schedules]
        let result = {}
        let values = []
        let drugTakenInfos
        for (let i = 0; i < schedules.length; i++) {
            let medicineScheduleId = schedules[i]._id
            let diagnose = schedules[i].diagnose
            let value = {}
            value['diagnose'] = diagnose
            value['createdAt'] = schedules[i].createdAt
            value['medicineScheduleName'] = schedules[i].medicineScheduleName
            value['medicineScheduleImage'] = schedules[i].medicineScheduleImage
            value['medicineScheduleId'] = medicineScheduleId
            value['drugTakenInfos'] = []
            drugTakenInfos = await DrugTakenInfo.find({'medicineScheduleId': mongoose.Types.ObjectId(medicineScheduleId)})
            let endDateList = [] // for finding latest date of current medicine schedule
            for (let info of drugTakenInfos) {
                // let prep = JSON.parse(JSON.stringify(info))
                let prep = {}
                prep['drugTakenInfoId'] = info['_id']
                prep['drugName'] = info['drugName']
                prep['drugImage'] = info['drugImage']
                prep['startDate'] = info['startDate']
                prep['endDate'] = info['endDate']
                prep['prefer'] = info['prefer']
                prep['quantity'] = info['quantity']
                prep['unit'] = info['unit']
                endDateList.push(new Date(info['endDate']))
                prep['takenTimes'] = []
                for (let takenTimeId of info.takenTimes) {
                    let takenTimeObj = await TakenTime.findById(takenTimeId)
                    prep['takenTimes'].push({ hour: takenTimeObj['hour'], minute: takenTimeObj['minute']})
                }
                value['drugTakenInfos'].push(prep)
            }
            let latestEndDate = new Date(Math.max.apply(null, endDateList))
            latestEndDate.setDate(latestEndDate.getDate() + 1)
            let isCompleted = latestEndDate < Date.now()
            value['isCompleted'] = isCompleted
            values.push(value)
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

export default {
    create,
    createMedicineSchedule,
    getSchedulesByUserId,
    getScheduleById,
    getMedicineScheduleByDate,
    deleteById,
    getNotStandardDrugsList,
    getPrescriptionsList,
    updateMedicineSchedule
}