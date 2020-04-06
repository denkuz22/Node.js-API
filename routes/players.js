  
const express = require('express');
const {
  getPlayers,
  getPlayer,
  addPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/players');

const Player = require('../models/Player');

const router = express.Router({ mergeParams: true });

const queryResults = require('../middleware/queryResults');
const { protect,authorize } = require('../middleware/auth');


router
  .route('/')
  .get(
    queryResults(Player, {
      path: 'team',
      select: 'name description'
    }),
    getPlayers
  )
  .post(protect,authorize('owner','admin'),addPlayer);

router
  .route('/:id')
  .get(getPlayer)
  .put(protect,authorize('owner','admin'),updatePlayer)
  .delete(protect,authorize('owner','admin'),deletePlayer);

module.exports = router;