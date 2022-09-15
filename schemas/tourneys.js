import mongoose from "mongoose"

const tourneySchema = mongoose.Schema({
    status: {type: String},
    players: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user',
        default: []
    },
    name: {type: String},
    entryForm: {type: String},
    location: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    contactName: {type: String},
    contactEmail: {type: String},
    contactPhone: {type: String},
    level: {type: Number},
    events: {
        type: Array,
        default: []
    }
})

const tourney = mongoose.model("tourney", tourneySchema)

export default tourney