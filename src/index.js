import app from "./app.js";
import "dotenv/config";
import { sequelize } from "./database/database.js";

// import "./models/User.js";
// import "./models/University.js";
// import "./models/Season.js";

async function main() {
  try {
    await sequelize.sync({ force: false });
    app.listen(4000);
    console.log("server is listening on port: ", process.env.PORT);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
