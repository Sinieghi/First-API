const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  console.log(req.user, req.params.id);
  //na linha 16 do E:\DOC\Node-learn\06-jobs-api\starter\middleware\authentication.js é onde o req.user passa a ter userId e name
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with that id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  // acho q n precisa explicar isso aqui, mas é a mesma coisa q req.body = {company,position}, req.user.userId, req.params.id esse params vem da rota da url local5000/api/v1/jobs/:""id""
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Filds cannot be empty");
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with that id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const deletJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with that id: ${jobId}`);
  }

  res.status(StatusCodes.OK).send("deleted");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deletJob,
};
