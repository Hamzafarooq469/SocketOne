const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, 'config', '.env') })

const express = require('express')
const cors = require('cors')

require('./services/Firebase/firebaseAdmin')

const app = express()

// Enable CORS for frontend origin before routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', require('./routes/userRoutes'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is working on port:${PORT}`)
})
