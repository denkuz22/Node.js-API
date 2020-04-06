const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')

//Load config file
dotenv.config({ path:'./config/config.env' })

//Route files
const teams = require('./routes/teams')
const players = require('./routes/players')
const auth = require('./routes/auth')
const users = require('./routes/users')



//Connect to DB
connectDB()

const app = express()

//Body parser
app.use(express.json())

//Cookie parser
app.use(cookieParser())

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

//Mount routers
app.use('/api/teams',teams)
app.use('/api/players',players)
app.use('/api/auth',auth)
app.use('/api/users',users)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on PORT=${PORT}`.bold.yellow))

//Handle unhandled promise rejections

process.on('unhandledRejection',(err,promise)=>{
  console.log(`Error: ${err.message}`)
  //Close server
  server.close(()=>process.exit(1))
})