const Team = require('../models/Team')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')


//@description    Get all teams
//@route          Get /api/teams
//@access         Public
exports.getTeams = asyncHandler( async (req,res,next) => {
  
    res.status(200).json(res.queryResults)
  
})

//@description    Get single team
//@route          Get /api/teams/:id
//@access         Public
exports.getTeam = asyncHandler(async (req,res,next) => {
    
    const team = await Team.findById(req.params.id)

    if(!team){
      return next(new ErrorResponse(`Team not found with id of ${req.params.id}`,404))
    }

    res.status(200).json({success:true, data:team})

})

//@description    Create a teams
//@route          POST /api/teams
//@access         Public
exports.createTeam =asyncHandler( async (req,res,next) => {
  //Add user  
    req.body.user = req.user.id;


    // Check for published team
  const publishedTeam = await Team.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one team
  if (publishedTeam && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already created a team`,
        400
      )
    );
  }

    const team = await Team.create(req.body)
    res.status(201).json({success:true,data:team})


})

//@description    Update a team
//@route          PUT /api/teams/:id
//@access         Private
exports.updateTeam =asyncHandler( async (req,res,next) => {

  let team = await Team.findById(req.params.id);

  if(!team){
      return next(new ErrorResponse(`Team not found with id of ${req.params.id}`,404))
    }

 // Make sure user is team owner
  if (team.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this team`,
        401
      )
    );
  }
  team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
   res.status(200).json({success:true,data:team})


})

//@description    Delete a team
//@route          DELETE /api/teams/:id
//@access         Private
exports.deleteTeam =asyncHandler( async (req,res,next) => {

    const team = await Team.findById(req.params.id)

    if(!team){
      return next(new ErrorResponse(`Team not found with id of ${req.params.id}`,404))
    }
    // Make sure user is team owner
  if (team.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this team`,
        401
      )
    );
  }

    await team.remove()

    res.status(200).json({success:true,data:{}})

})
// @desc      Get teams within a radius
// @route     GET /api/v1/teams/radius/:zipcode/:distance
// @access    Private
exports.getTeamsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const location = await geocoder.geocode(zipcode);
  const lat = location[0].latitude;
  const lng = location[0].longitude;

  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const teams = await Team.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams
  });
});

