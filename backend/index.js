
const express = require("express")
const dotenv = require("dotenv")
const db = require('./config/db')


dotenv.config({
    path: "./config/.env"
})

const app = express()

app.use("/api/user/", require("./routes/userRoutes"))

PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is working on port:${PORT}`)
})