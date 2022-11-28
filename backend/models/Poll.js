const mongoose = require("mongoose");

const PollSchema = mongoose.Schema({
    institution : {
        type: String,
        required: true
    },
    post : {
        type: String,
        required: true
    },
    startTime: Date,
    endTime: Date,
    voterList: [String],
    votedList: [String],
    candidates: [{
        name: String,
        manifesto: String,
        votes: Number
    }],
    creator: String
})

module.exports = mongoose.model("Poll", PollSchema);