
const express = require("express")
const dotenv = require("dotenv")

dotenv.config({
    path: "./config/.env"
})

const app = express()

PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server is working on port:${PORT}`)
})