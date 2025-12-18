import express from "express";
import { sign } from "jsonwebtoken";
import connect2db from "./dbConnector"

const router = express.Router();
router.post("signin", async (req, res) => {
    const { username, password } = req.body;
    const mongo = await connect2db();
    const u = { username, password };
    const user = await mongo.collection("users").findOne(u);
    console.log(user);
    if (user) {
        const payload = { username };
        // maybe modify in the future
        let token = sign(payload, "secret");
        res.cookie('token', token, { httpOnly: true });
        res.redirect("/index.html");

    } else {
        res.status(403).send("Error");
    }
});

export default router;