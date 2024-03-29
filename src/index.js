const app = require("./app.js");
require("dotenv").config();
const Sequelize = require("./database/database.js");

// const User = require("./models/User.js");
// const University = require("./models/University.js");
// const Season = require("./models/Season.js");
// const Contract = require("./models/Contract.js");
// const ExamType = require("./models/ExamType.js");
// const Exam = require("./models/Exam.js");

async function main() {
  try {
    await Sequelize.sync({ force: false });
    app.listen(process.env.POSTGRES_PORT);
    console.log(`server is listening on port: ", ${process.env.POSTGRES_PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
