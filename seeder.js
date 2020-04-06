const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//Load env vars
dotenv.config({path:'./config/config.env'})

//Load models
const Team = require('./models/Team')
const Player = require('./models/Player')

//Connect to db
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser : true,
  useCreateIndex : true,
  useFindAndModify : false,
  useUnifiedTopology: true 
})

//Read JSON files
const teams = JSON.parse(fs.readFileSync(`${__dirname}/data/teams.json`,'utf-8'))
const players = JSON.parse(fs.readFileSync(`${__dirname}/data/players.json`,'utf-8'))

// Import into db
const importData = async ()=>{
  try {
    await Team.create(teams)
    await Player.create(players)
    console.log('Data imported'.green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await Team.deleteMany();
    await Player.deleteMany();
    console.log('Data Deleted'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}

