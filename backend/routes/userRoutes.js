
const express = require("express")

const router = express.Router()

const { signUp, signIn, signOut, searchUsers } = require("../controllers/userController")

router.post("/signUp", signUp)
router.post("/signIn", signIn)
router.post("/signOut", signOut)
router.get("/search", searchUsers)

module.exports = router