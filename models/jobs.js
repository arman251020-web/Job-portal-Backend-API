const mongoose = require("mongoose")

const jobschema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    employee_id: {
        type: String,
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("job", jobschema)