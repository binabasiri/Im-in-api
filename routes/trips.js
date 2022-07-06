const knex = require('knex')(require('../knexfile').development);
const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/trips', (req, res) => {
  // console.log(req.body);
  const { destination, start, end } = req.body;
  // const { restaurants } = req.body;
  const photo_reference = req.body.cityPhoto.photo_reference;
  const { selectedRestaurants, selectedTouristAttractions } = req.body;
  const trips_id = uuidv4();
  // console.log(req.body);
  // selectedRestaurants.forEach((restaurant) => {
  //   const name = restaurant.name;
  //   const rating = restaurant.rating.rating;
  //   const number_of_ratings = restaurant.rating.numberOfRatings;
  //   const restaurant_id = uuidv4();
  //   knex('restaurants')
  //     .insert({ id: restaurant_id, number_of_ratings, rating, name, trips_id })
  //     .then((data) => {
  //       console.log('Post request:', data);
  //       const newWarehouseURL = `/warehouses/${data[0]}`;
  //       res.status(201).location(newWarehouseURL).send(newWarehouseURL);
  //     });
  // });
  // console.log(selectedRestaurants);
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
    .insert({ id: trips_id, photo_reference, destination, start, end })
    .then((data) => {
      console.log('get here');
      if (req.body.selectedRestaurants.length) {
        return knex('restaurants').insert([...restaurantsToInsert]);
      } else {
        return Promise.resolve('success');
      }
    })
    .then((data) => {
      console.log('Post request:', data);
      return knex('tourist_attractions').insert([
        ...touristAttractionsToInsert,
      ]);
    })
    .then((data) => {
      res.status(201).send();
    })
    .catch((err) => res.status(400).send(`Error adding trips: ${err}`));
  // console.log(restaurantsToInsert);

  //     .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
  //   knex('tourist_attractions')
  //     .insert({ destination, start, end })
  //     .then((data) => {
  //       console.log('Post request:', data);
  //       const newWarehouseURL = `/warehouses/${data[0]}`;
  //       res.status(201).location(newWarehouseURL).send(newWarehouseURL);
  //     })
  //     .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
});

router.get('/trips/', (req, res) => {
  knex('trips')
    .select(
      'id',
      'destination',
      'photo_reference',
      'start',
      'end',
      'updated_at'
    )
    .then((data) => {
      res.json(data);
    });
});

module.exports = router;
