const express = require('express');
const SUBJECT_DATA = require('../data/subjectData');
const Subject = require('../models/Subject');
const expressAsyncHandler = require('express-async-handler');

const subjectRouter = express.Router();

/** API ROUTE TO INSERT SEEDS INTO DATABASE */
subjectRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    const createdSubjects = await Subject.insertMany(SUBJECT_DATA);
    res.send({ message: "success" });
  })
);

/** ROUTE TO CREATE/ADD NEW SUBJECT */
subjectRouter.post(
  '/create',
  expressAsyncHandler(async (req, res) => {
    const { type, duration } = req.body

    /** CHECKING SUBJECT LIMIT **/
    const total = await Subject.countDocuments({});

    if (total >= 12) {
      return res.status(401).send({ 
        message: "Exceed Subjects Limit: At most 12 subjects is allowed" 
      });
    }
    /** CHECKING ENDS HERE **/

    const newSubject = new Subject({
      type,
      duration 
    });
    await newSubject.save();

    /** GET TOTAL NUMBER OF SUBJECTS */
    const totalSubjects = await Subject.countDocuments({});

    res.status(201).send({
      message: "created successfully",
      totalSubject: totalSubjects,
      data: newSubject
    });
  })
);

/** ROUTE TO READ A SUBJECT'S DATA */
subjectRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findById(id);

    /**VALIDATE ID PARAMS */
    if (!subject) {
      return res.status(400).send({ 
        message: "Subject does not exist" 
    });
    }

    res.status(200).send({
      message: "success",
      data: subject
    });
  })
);

/** ROUTE TO READ ALL SUBJECTS DATA. */
subjectRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const total = await Subject.countDocuments({});
    const subjects = await Subject
    .find({})
    .sort({ _id: -1 });

    res.status(200).send({
      message: "success",
      totalSubjects: total,
      data: subjects
    });
  })
);

/**ROUTE TO UPDATE A SUBJECT'S DATA */
subjectRouter.put(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type, duration } = req.body;

    const subject = await Subject.findById(id);

    /**VALIDATE ID PARAMS */
    if (!subject) {
        return res.status(400).send({ 
          message: "Subject does not exist" 
        });
    }

    /**UPDATING DATA */
    subject.type = type;
    subject.duration = duration;

    await subject.save();

    res.status(200).send({ 
      message: "updated successfully",
      data: subject
    })
  })
);

/**ROUTE TO DELETE A SUBJECT */
subjectRouter.delete(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    await Subject.findOneAndRemove({
      _id: id
    });

    res.status(201).send({ message: 'deleted successfully' });
  })
);

module.exports = subjectRouter;