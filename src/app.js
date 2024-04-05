const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//middlewares
app.use(express.json());

//CORS
app.use(cors());

app.use("/api/user", require("./routes/user.js"));
app.use("/api/university", require("./routes/university.js"));
app.use("/api/season", require("./routes/season.js"));
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/contract", require("./routes/contract.js"));
app.use("/api/payment", require("./routes/payment.js"));
app.use("/api/examType", require("./routes/examType.js"));
app.use("/api/exam", require("./routes/exam.js"));
app.use("/api/userContract", require("./routes/userContract.js"));
app.use("/api/userExam", require("./routes/userExam.js"));


// app.use("/api/question", require("./routes/question.js"));



// export default app;
module.exports = app ;
