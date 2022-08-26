const knex = require('knex')(require('../knexfile').development);
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authorize } = require('../middleWare/AuthMiddleWare');

router.post('/trips', authorize, (req, res) => {
  const { destination, start, end } = req.body;
  const photo_reference = req.body.cityPhoto.photo_reference;
  const { selectedRestaurants, selectedTouristAttractions } = req.body;
  const trips_id = uuidv4();

  const restaurantsToInsert = selectedRestaurants.map((restaurant) => {
    return {
      restaurant_name: restaurant.name,
      rating: restaurant.rating.rating,
      number_of_ratings: restaurant.rating.numberOfRatings,
      id: uuidv4(),
      trips_id,
    };
  });

  const touristAttractionsToInsert = selectedTouristAttractions.map((place) => {
    return {
      place_name: place.name,
      rating: place.rating.rating,
      number_of_ratings: place.rating.numberOfRatings,
      id: uuidv4(),
      trips_id,
    };
  });
  knex('trips')
    .insert({
      id: trips_id,
      photo_reference,
      destination,
      start,
      end,
      user_id: req.decoded.id,
    })
    .then((data) => {
      if (req.body.selectedRestaurants.length) {
        return knex('restaurants').insert([...restaurantsToInsert]);
      } else {
        return Promise.resolve('success');
      }
    })
    .then((data) => {
      if (req.body.selectedTouristAttractions.length) {
        return knex('tourist_attractions').insert([
          ...touristAttractionsToInsert,
        ]);
      } else {
        return Promise.resolve('success');
      }
    })
    .then((data) => {
      res.status(201).send();
    })
    .catch((err) => res.status(400).send(`Error adding trips: ${err}`));
});

router.get('/trips/', authorize, (req, res) => {
  const restaurantMap = {};
  const touristAttractionMap = {};
  let tripIds = [];
  let trips = [];
  let payload;
  [];
  knex('trips')
    .select(
      'id',
      'destination',
      'photo_reference',
      'start',
      'end',
      'updated_at'
    )
    .where({ user_id: req.decoded.id })
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

router.delete('/trips/:id', authorize, (req, res) => {
  knex('restaurants')
    .delete()
    .where({ trips_id: req.params.id })
    .then(() => {
      return knex('tourist_attractions')
        .delete()
        .where({ trips_id: req.params.id });
    })
    .then(() => {
      return knex('trips').delete().where({ id: req.params.id });
    })
    .then(() => {
      res.status(204).send(`trip with id: ${req.params.id} has been deleted`);
    })

    .catch((err) =>
      res.status(400).send(`Error deleting trip ${req.params.id} ${err}`)
    );
});

module.exports = router;
