import express from 'express';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
// import auth from "./auth.js";
const auth = require("./auth.js");

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/api/auth", auth);
app.use(express.static("public"));
const verifyToken = (req, res, next) => {

}

app.post('/api/auth/signup', (res, req, next) => {
    debugger

});

app.use(verifyToken);
app.use(express.static("private"));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));