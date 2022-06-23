const express = require('express')
const app= express()
const routes = require("./routes/index")
const cors = require('cors')
app.use(cors())
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static('public'))
routes(app)
app.listen(process.env.SERVER_PORT_NUMBER, () => console.log("server connect to port : ", process.env.SERVER_PORT_NUMBER))