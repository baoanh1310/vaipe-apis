import mongoose from 'mongoose'

const DrugTakenInfoSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    drugId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drug"
    },
    medicineScheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicineSchedule"
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    numberPill: {
        type: Number,
        default: 1
    },
    weekDays: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WeekDay"
        }
    ],
    takenTime: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TakenTime"
        }
    ]
})

export default mongoose.model('DrugTakenInfo', DrugTakenInfoSchema)