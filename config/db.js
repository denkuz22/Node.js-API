//Connect to database
const mongoose = require('mongoose')
const colors = require('colors')


const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology: true 
  })
console.log(`MongoDB Connected: ${connection.connection.host}`.bold.cyan)

}

module.exports = connectDB
