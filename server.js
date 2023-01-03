const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

/** 
 * HEROKU URL: https://oris-backend-academy.herokuapp.com 
 * GITHUB URL: https://github.com/christopheresivwekpe/oris_backend_academy
 * POSTMAN DOCUMENTATION: https://documenter.getpostman.com/view/17862810/VUqrNGgh
 ***/

/**ROUTERS */
const studentRouter = require('./routers/studentRouter.js');
const classRouter = require('./routers/classRouter.js');
const subjectRouter = require('./routers/subjectRouter.js');

dotenv.config();

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongodbUrl = process.env.MONGODB_URI || 'mongodb://localhost/backend_academy';

/**CONNECT TO MONGOBD */
mongoose.connect( mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("Connected to DB"); 
});

/**ROUTES MIDDLEWARES */
app.use('/api/student', studentRouter);
app.use('/api/subject', subjectRouter);
app.use('/api/class', classRouter);

/**ERROR HANDLING */
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

/**LISTEN TO PORT */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}...`);
});
