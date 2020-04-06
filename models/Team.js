const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')


const TeamSchema = new mongoose.Schema({
  name: {
    type:String,
    required: [true,'Please add a team name'],
    unique: true,
    trim:true,
    maxlength:[50,'Name cannot be more than 50 characters']
  },
  slug: String,
  rank:{
    type: Number,
    required:[true,'Please add your school rank']
  },
  description:{
    type:String,
    required: [true,'Please add a team descriptioin'],
    unique: true,
    trim:true,
    maxlength:[200,'Description cannot be more than 200 characters']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  address:{
    type: String,
    required: [true, 'Please add an address']
  },
  location:{
    //GeoJSON
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
)

//Create a slug for a team from the team name
TeamSchema.pre('save',function(next){
  this.slug = slugify(this.name,{lower:true})
  next()
})

//GeoCOde and create location field
TeamSchema.pre("save", async function(next){
  const location = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
    street: location[0].streetName,
    city: location[0].city,
    state: location[0].stateCode,
    zipcode: location[0].zipcode,
    country: location[0].countryCode
  };

  // Do not save address in DB
  this.address = undefined;
  next()
})


TeamSchema.pre('remove', async function(next) {
  console.log(`Players being removed from team ${this._id}`);
  await this.model('Player').deleteMany({ team: this._id });
  next();
});

// Reverse populate with virtuals
TeamSchema.virtual('players', {
  ref: 'Player',
  localField: '_id',
  foreignField: 'team',
  justOne: false
});


module.exports = mongoose.model('Team',TeamSchema)