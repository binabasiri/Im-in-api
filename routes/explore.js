const knex = require('knex')(require('../knexfile').development);
const express = require('express');
const router = express.Router();
const { userMiddleWare } = require('../middleWare/UserMiddleWare');
router.get('/explore/', userMiddleWare, (req, res) => {
  const restaurantMap = {};
  const touristAttractionMap = {};
  let tripIds = [];
  let trips = [];
  let payload;
  [];
  console.log(req.decoded.id);
  knex('trips')
    .select(
      'id',
      'destination',
      'photo_reference',
      'start',
      'end',
      'updated_at'
    )
    .whereNot({ user_id: req.decoded.id })
    .then((data) => {
      data.forEach((trip) => {
        tripIds.push(trip.id);
        trips.push(trip);
      });
      // res.json(trips);
      return knex('restaurants').select().whereIn('trips_id', tripIds);
    })
    .then((data) => {
      data.forEach((restaurant) => {
        restaurantMap[restaurant.trips_id] = [
          ...(restaurantMap[restaurant.trips_id] || []),
          restaurant,
        ];
      });
      return knex('tourist_attractions').select().whereIn('trips_id', tripIds);
    })
    .then((data) => {
      data.forEach((touristAttraction) => {
        touristAttractionMap[touristAttraction.trips_id] = [
          ...(touristAttractionMap[touristAttraction.trips_id] || []),
          touristAttraction,
        ];
        trips.forEach((trip) => {
          trip.selectedRestaurants = restaurantMap[trip.id];
          trip.selectedTouristAttractions = touristAttractionMap[trip.id];
        });
      });
      res.json(trips);
    });
});

module.exports = router;
