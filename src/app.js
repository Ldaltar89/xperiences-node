import express from "express";
import "dotenv/config";
import userRoutes from "./routes/user.routes.js";
import universityRoutes from "./routes/university.routes.js";
import seasonRoutes from "./routes/season.routes.js";
import session from "express-session";
import cookieParser from "cookie-parser";



const app = express();

//middlewares
app.use(express.json());

//habilitar cookie-parser
app.use(cookieParser());

//crear session
app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(userRoutes);
app.use(universityRoutes);
app.use(seasonRoutes);

export default app;
