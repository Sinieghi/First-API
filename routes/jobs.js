const express = require("express");
const {
  deletJob,
  updateJob,
  createJob,
  getJob,
  getAllJobs,
} = require("../controllers/jobs");
const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJob).delete(deletJob).patch(updateJob);

module.exports = router;
