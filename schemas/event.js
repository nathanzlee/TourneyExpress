import mongoose from "mongoose"

const eventSchema = mongoose.Schema({
    status: {type: String},
    players: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user',
        default: []
    },
    name: {type: String},
    startDate: {type: Date},
    minRating: {type: Number},
    maxRating: {type: Number},
    minAge: {type: Number},
    maxAge: {type: Number},
    format: {type: String},
    fee: {type: Number},
    capacity: {type: Number}
})

const event = mongoose.model("event", eventSchema)

export default event