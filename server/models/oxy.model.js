import mongoose from 'mongoose'

const OxySchema = new mongoose.Schema({
    value: {
        type: Number,
        required: 'Oxygen value is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    // img_path: {
    //     type: String
    // },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('Oxy', OxySchema)