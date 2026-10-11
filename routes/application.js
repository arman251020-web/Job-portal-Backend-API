const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")
const employe = require("../middleware/employerMiddleware")

const Job=require("../models/jobs")
const Application=require("../models/application");

router.post("/apply/:job_id", auth, async (req, res) => {
    try {
        const user_id = req.user.id;
        const job_id = req.params.job_id;
        const job = await Job.findById(job_id);
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        const existingApplication = await Application.findOne({
            candidate_id: user_id,
            job_id: job_id
        });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }
        const application = await Application.create({
            candidate_id: user_id,
            job_id: job_id,
            status: "pending"
        });
        return res.status(201).json({
            message: "Job application submitted successfully",
            application
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.get("/my-application", auth, async (req, res) => {
    try {
        const user_id = req.user.id;

        const usercheck = await Application.find({
            candidate_id: user_id
        });

        if (usercheck.length === 0) {
            return res.status(404).json({
                message: "You have not applied for any job"
            });
        }

        return res.status(200).json({
            message: "Your applications",
            application: usercheck
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
router.get("/job-appliaction", auth, employe, async (req, res) => {
    try {
        const employer_id = req.user.id;

        const jobs = await Job.find({
            employer_id: employer_id
        });

        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({
            job_id: { $in: jobIds }
        })
        .populate("candidate_id", "name email")
        .populate("job_id", "title company location");

        return res.status(200).json({
            message: "Candidates who applied for your jobs",
            applications
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports=router