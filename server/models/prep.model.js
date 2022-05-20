import mongoose from 'mongoose'

const PrepSchema = new mongoose.Schema({
    drugs: {
        type: [mongoose.Schema.Types.ObjectId], // list drugId
        required: 'Prescription info is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    symtoms: {
        type: String,
    },
    diagnose: {
        type: String,
    },
    img_path: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('Prep', PrepSchema)