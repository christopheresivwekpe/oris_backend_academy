const express = require('express');
const CLASS_DATA = require('../data/classData');
const Class = require('../models/Class');
const expressAsyncHandler = require('express-async-handler');

const classRouter = express.Router();

/** NB: YOU CAN'T DELETE A CLASS AND CAN'T CREATE A NEW CLASS **/

/** API ROUTE TO INSERT SEEDS INTO DATABASE */
classRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    const createdClasses = await Class.insertMany(CLASS_DATA);
    res.send({ message: "success" });
  })
);

/** ROUTE TO READ A CLASS DATA */
classRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const level = await Class.findById(id);

    /**VALIDATE ID PARAMS */
    if (!level) {
      return res.status(400).send({ 
        message: "Class does not exist" 
      });
    }

    res.status(200).send({
      message: "success",
      data: level
    });
  })
);

/** ROUTE TO READ ALL CLASSES DATA. */
classRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const total = await Class.countDocuments({});
    const classes = await Class
    .find({})
    .sort({ level: -1 });

    res.status(200).send({
      message: "success",
      totalClasses: total,
      data: classes
    });
  })
);

/**ROUTE TO UPDATE A CLASS DATA */
classRouter.put(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { duration } = req.body;

    const level = await Class.findById(id);

    /**VALIDATE ID PARAMS */
    if (!level) {
        return res.status(400).send({ 
          message: "Class does not exist" 
        });
    }

    /**UPDATING DATA */
    level.classAdvisor = classAdvisor;
    await level.save();

    res.status(200).send({ 
      message: "updated successfully",
      data: level
    })
  })
);

module.exports = classRouter;