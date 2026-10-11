const mongoose = require("mongoose");

const applicationschema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
        required: true
    },
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approve", "reject"],
        default: "pending"
    },
    applied_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("application", applicationschema);