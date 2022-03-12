import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    username: {type: String},
    email: {type: String},
    phone: {type: String},
    dateJoined: {type: Date},
    password: {type: String},
    salt: {type: String},
    membership: {type: String},
    tourneys: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'tourney',
        default: []
    }
})

const user = mongoose.model('user', userSchema)

export default user