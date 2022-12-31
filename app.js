require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors({
    'origin': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type' 
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const db = require("./config/db");
const { authRouter, questionRouter, answerRouter, articalRouter, bannerRouter, lawyerRouter, langRouter, statecityRouter, adminRouter, userRouter, specialityRouter, sessionRouter } = require('./app/src')

app.get("/", (req, res) => {
    res.status(200).send("Welcome to Formulaw 1.0 !");
});

app.use('/auth', authRouter);
app.use('/questions', questionRouter);
app.use('/answer', answerRouter);
app.use('/artical', articalRouter);
app.use('/banner', bannerRouter);
app.use('/lawyer', lawyerRouter );
app.use('/lang', langRouter );
app.use('/statecity', statecityRouter );
app.use('/admin',  adminRouter);
app.use('/user',  userRouter);
app.use('/speciality',  specialityRouter);
app.use('/session',  sessionRouter);
app.use('/admin/lawyer',  lawyerRouter);



app.listen(process.env.PORT, function () {
    console.log("server running on port "+process.env.PORT+"");
});