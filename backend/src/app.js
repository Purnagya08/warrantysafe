const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const errorMiddleware = require('./middlewares/error.middleware')

dotenv.config()

const app = express()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/auth', require('./modules/auth/auth.routes'))
app.use('/api/products', require('./modules/products/products.routes'))
app.use('/api/warranties', require('./modules/warranties/warranties.routes'))
app.use('/api/documents', require('./modules/documents/documents.routes'))
app.use('/api/repairs', require('./modules/repairs/repairs.routes'))
app.use('/api/notifications', require('./modules/notifications/notifications.routes'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.use(errorMiddleware)

module.exports = app
