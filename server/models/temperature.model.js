import mongoose from 'mongoose'

const TemperatureSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: 'Temperature is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    img_path: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('Temperature', TemperatureSchema)