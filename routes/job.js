const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const employe = require("../middleware/employerMiddleware");
const Job = require("../models/jobs");
const Application = require("../models/application");
const User = require("../models/user");

router.post("/jobs", auth, employe, async (req, res) => {
    try {
        const employee = req.user.id;
        const { title, company, salary, location, description, requirements, job_type } = req.body;

        if (!title || !company || !location || !description) {
            return res.status(400).json({
                message: "Title, company, location and description are required"
            });
        }

        const checkjob = await Job.findOne({
            employee_id: employee,
            title,
            company
        });

        if (checkjob) {
            return res.status(409).json({
                message: "Job already exists"
            });
        }

        const jobc = await Job.create({
            id: Date.now().toString(),
            title,
            company,
            salary,
            location,
            description,
            requirements,
            job_type,
            employee_id: employee
        });

        return res.status(201).json({
            message: "Job created successfully",
            job: jobc
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.get("/jobs", auth, async (req, res) => {
    try {
        const jobs = await Job.find();

        return res.status(200).json({
            message: "All jobs",
            jobs
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.get("/jobs/:id", auth, async (req, res) => {
    try {
        const jobs = await Job.findById(req.params.id);

        if (!jobs) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        return res.status(200).json({
            message: "Job details",
            job: jobs
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.put("/jobs/:id", auth, employe, async (req, res) => {
    try {
        const employee = req.user.id;
        const { title, company, salary, location, description, requirements, job_type } = req.body;

        const job = await Job.findOne({
            _id: req.params.id,
            employee_id: employee
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you are not authorized to edit it"
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            {
                title,
                company,
                salary,
                location,
                description,
                requirements,
                job_type
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.delete("/jobs/:id", auth, employe, async (req, res) => {
    try {
        const employee = req.user.id;

        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            employee_id: employee
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you are not authorized to delete it"
            });
        }

        await Application.deleteMany({
            job_id: job._id
        });

        return res.status(200).json({
            message: "Job deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;