
const authRouter = require('./auth/route')
const questionRouter = require('./questions/route');
const answerRouter = require('./answers/route');
const articalRouter = require('./artical/route');
const bannerRouter = require('./banner/route');
const lawyerRouter = require('./lawyer/route');
const langRouter = require('./language/route');
const statecityRouter = require('./state-city/route');
const adminRouter = require('./admin/route');
const userRouter = require('./user/route');
const specialityRouter = require('./specialities/route');
const sessionRouter = require('./sessions/route');

module.exports = {
    authRouter,
    questionRouter,
    answerRouter,
    articalRouter,
    bannerRouter,
    lawyerRouter,
    langRouter,
    statecityRouter,
    adminRouter,
    userRouter,
    specialityRouter,
    sessionRouter
}