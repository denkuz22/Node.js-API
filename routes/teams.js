const express = require('express')
const { getTeam,getTeams,createTeam,updateTeam,deleteTeam,getTeamsInRadius } = require('../controllers/teams')

const Team = require('../models/Team')

const playerRouter = require('./players');

const router = express.Router()

router.use('/:teamId/players', playerRouter);

const queryResults = require('../middleware/queryResults');
const { protect,authorize } = require('../middleware/auth');

router.route('/').get(queryResults(Team,'players'),getTeams).post(protect,authorize('owner','admin'),createTeam)
router.route('/:id').get(getTeam).put(protect,authorize('owner','admin'),updateTeam).delete(protect,authorize('owner','admin'),deleteTeam)
router.route('/radius/:zipcode/:distance').get(getTeamsInRadius)


module.exports = router