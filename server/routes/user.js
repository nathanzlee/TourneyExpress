import express from "express";
import { newuser, login } from "../controllers/user.js";

const router = express.Router();

router.post('/signup', newuser);
router.post('/login', login);
router.get('/', (req, res) => {
    res.send("ur sane")
})
export default router;