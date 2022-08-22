const express = require('express');
const STUDENT_DATA = require('../data/studentData');
const Student = require('../models/Student');
const expressAsyncHandler = require('express-async-handler');

const studentRouter = express.Router();

/** API ROUTE TO INSERT SEEDS INTO DATABASE */
studentRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    const createdStudents = await Student.insertMany(STUDENT_DATA);
    res.send({ message: "success" });
  })
);

/** ROUTE TO CREATE/ADD NEW STUDENT */
studentRouter.post(
  '/create',
  expressAsyncHandler(async (req, res) => {
    const { firstName, otherName, lastName, gender, classroom, subjects } = req.body

    /** VALIDATING DATA **/
    if (!subjects || subjects.length < 5 || subjects.length > 9) {
      return res.status(401).send({ 
        message: "student must take a minimum of 5 subjects and maximum of 9 subjects" 
      });
    }

    if (!classroom) {
      return res.status(401).send({ 
        message: "student must be in a class" 
      });
    }
    /** VALIDATION ENDS HERE **/

    const newStudent = new Student({
      firstName, 
      lastName, 
      otherName,
      gender: gender.toLowerCase(),
      classroom, 
      subjects 
    });
    await newStudent.save();

    /** GET TOTAL NUMBER OF STUDENTS */
    const totalStudents = await Student.countDocuments({});

    res.status(201).send({
      message: "created successfully",
      totalStudents: totalStudents,
      data: newStudent
    });
  })
);

/** ROUTE TO READ A STUDENT'S DATA (via student's unique _id) */
studentRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);

    /**VALIDATE ID PARAMS */
    if (!student) {
      return res.status(400).send({ message: "Student does not exist" });
    }

    res.status(200).send({
      message: "success",
      data: student
    });
  })
);

/** ROUTE TO READ ALL STUDENTS DATA. 
 * Available queries:
 * # page - enable pagination. default value is "0".
 * # name - enable filtering by student's name.
 * # gender - enable filtering by gender.
 * # subject - enable filtering by subject.
 * # classroom - enable filtering by classes {JSS 1 - SSS 3, via Class objectId}.
*/
studentRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    /**20 DATA PER PAGE */
    const PAGE_SIZE = 20;

    /**QUERIES */
    const page = parseInt(req.query.page || "0");
    const classroom = req.query.classroom || '';
    const name = req.query.name || '';
    const gender = req.query.gender || '';
    const subject = req.query.subject || '';

    /** FILTERS (BY LEVEL, GENDER or NAME) **/
    const classroomFilter = classroom ? { classroom } : {};
    const genderFilter = gender ? { gender } : {};
    const subjectFilter = subject ? { subject } : {};
    const nameFilter = name ? { $or: [
      { firstName: { $regex: name, $options: 'i' } },
      { otherName: { $regex: name, $options: 'i' } },
      { lastName: { $regex: name, $options: 'i' } }
    ]} : {};

    /** GET TOTAL NUMBER OF STUDENTS BASE ON FILTERS*/
    const total = await Student.countDocuments({
      $and: [
        {...genderFilter},
        {...subjectFilter},
        {...classroomFilter},
        {...nameFilter}
      ]
    });

    /** GET STUDENTS DATA BASE ON FILTERS*/
    const students = await Student
    .find({
      $and: [
        {...genderFilter},
        {...subjectFilter},
        {...classroomFilter},
        {...nameFilter}
      ]
    })
    .populate('classroom')
    .sort({ _id: -1 })
    .skip(PAGE_SIZE * page)
    .limit(PAGE_SIZE)
    .clone();

    res.status(200).send({
      message: "success",
      totalPages: Math.ceil(total / PAGE_SIZE),
      totalStudents: total,
      data: students
    });
  })
);

/**ROUTE TO UPDATE A STUDENT'S DATA */
studentRouter.put(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstName, otherName, lastName, gender, classroom, subjects } = req.body;

    /** VALIDATING SUBJECTS **/
    if (!subjects || subjects.length < 5 || subjects.length > 9) {
      return res.status(401).send({ 
        message: "student must take a minimum of 5 subjects and maximum of 9 subjects" 
      });
    }
    /** VALIDATION ENDS HERE **/

    const student = await Student.findById(id);

    /**VALIDATE ID PARAMS */
    if (!student) {
      return res.status(400).send({ message: "Student does not exist" });
    }

    /**UPDATING DATA */
    student.firstName = firstName;
    student.otherName = otherName;
    student.lastName = lastName;
    student.gender = gender.toLowerCase();
    student.classroom = classroom;
    student.subjects = subjects;

    await student.save();
    res.status(200).send({ 
      message: "updated successfully",
      data: student
    })
  })
);

/**ROUTE TO DELETE A STUDENT'S DATA (via student's unique _id) */
studentRouter.delete(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    await Student.findOneAndRemove({
      _id: id
    });

    res.status(201).send({ message: 'deleted successfully' });
  })
);

module.exports = studentRouter;