const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const utils = require('../utils/utils');

require('dotenv').config();
const { GOOGLE_API_KEY, WEATHER_API_KEY } = process.env;

//API returns a lot of infromation about the specifi place(city) server uses some infromation to pull other data endpoint returns name and photo references 5 maximum
router.get('/city/:id', async (req, res) => {
  let cityLocation = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&key=${GOOGLE_API_KEY}`
  );
  let radius = '15000';
  let restaurant = 'restaurant';
  let touristAttraction = 'tourist_attraction';
  let { result } = cityLocation.data;
  let { lat, lng } = result.geometry.location;
  let cityImages = [];
  let restaurants = [];
  let touristAttractions = [];
  let cityName = '';
  cityName = cityLocation.data.result.address_components[0].long_name;
  if (result.photos) {
    photoArraySize = result.photos.length < 10 ? result.photos.length : 10;

    for (let i = 0; i < photoArraySize; i++) {
      let photoObject = {};
      photoObject.height = result.photos[i].height;
      photoObject.width = result.photos[i].width;
      photoObject.photo_reference = result.photos[i].photo_reference;
      cityImages.push(photoObject);
    }
  }
  // res.json(cityImages);
  // API returns an array of 40 (5days every 3hours weather forecast) endpoint return weekday max and min tempreture, max humidity and max weather condition(clear weather is the lowest snow is the highest)
  let weather = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`
  );
  // weather forcast array is an array containing forcast of next 5days
  let weatherForcastArray = [];

  for (let i = 0; i < 7; i++) {
    weatherForcastOfOneDay = weather.data.list.filter((forecast) => {
      return new Date(forecast.dt * 1000).getDay() == i;
    });
    if (weatherForcastOfOneDay.length > 1) {
      weatherForcastArray.push(utils.weatherProcess(weatherForcastOfOneDay));
    }
  }
  // res.json(weatherForcastArray);

  // API returns 20 restaurants in the city endpoint returns top 5

  let restaurantsInTheCity = await axios.get(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_API_KEY}&location=${lat},${lng}&type=${restaurant}&radius=${radius}`
  );
  availableRestaurantsInTheCity = restaurantsInTheCity.data.results
    .filter((eachRestaurant) => eachRestaurant.user_ratings_total > 50)

    .filter((place) => {
      return place.permanently_closed !== true;
    });
  sortedAvailableRestaurantsInTheCityByRating =
    availableRestaurantsInTheCity.sort((a, b) => b.rating - a.rating);

  for (let i = 0; i < 6; i++) {
    let topRestaurantInfo = {};

    topRestaurantInfo.image = {
      height: sortedAvailableRestaurantsInTheCityByRating[i]?.photos[0]?.height,
      width: sortedAvailableRestaurantsInTheCityByRating[i].photos[0]?.width,
      photoReference:
        sortedAvailableRestaurantsInTheCityByRating[i].photos[0]
          ?.photo_reference,
    };
    topRestaurantInfo.name =
      sortedAvailableRestaurantsInTheCityByRating[i].name;
    topRestaurantInfo.rating = {
      numberOfRatings:
        sortedAvailableRestaurantsInTheCityByRating[i].user_ratings_total,
      rating: sortedAvailableRestaurantsInTheCityByRating[i].rating,
    };
    topRestaurantInfo.priceRange =
      sortedAvailableRestaurantsInTheCityByRating[i]?.price_level;
    topRestaurantInfo.id = i;
    restaurants.push(topRestaurantInfo);
  }

  // res.json(restaurants);
  // API returns 20 places endpoint returns top 5
  let touristAttractionInTheCity = await axios.get(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_API_KEY}&location=${lat},${lng}&type=${touristAttraction}&radius=${radius}`
  );

  sortedAvailableTouristAttractionInTheCityByRating =
    touristAttractionInTheCity.data.results
      .filter(
        (eachTouristAttraction) => eachTouristAttraction.user_ratings_total > 50
      )

      .filter((place) => {
        return place.permanently_closed !== true;
      })
      .sort((a, b) => b.rating - a.rating);
  for (let i = 0; i < 6; i++) {
    let topTouristAttractionInfo = {};

    topTouristAttractionInfo.image = {
      height:
        sortedAvailableTouristAttractionInTheCityByRating[i]?.photos[0]?.height,
      width:
        sortedAvailableTouristAttractionInTheCityByRating[i].photos[0]?.width,
      photoReference:
        sortedAvailableTouristAttractionInTheCityByRating[i].photos[0]
          ?.photo_reference,
    };
    topTouristAttractionInfo.name =
      sortedAvailableTouristAttractionInTheCityByRating[i].name;
    topTouristAttractionInfo.rating = {
      numberOfRatings:
        sortedAvailableTouristAttractionInTheCityByRating[i].user_ratings_total,
      rating: sortedAvailableTouristAttractionInTheCityByRating[i].rating,
    };
    topTouristAttractionInfo.priceRange =
      sortedAvailableTouristAttractionInTheCityByRating[i].price_level;
    topTouristAttractionInfo.id = i;
    touristAttractions.push(topTouristAttractionInfo);
  }
  // res.json(touristAttractions);
  res.json({
    cityName,
    cityImages,
    touristAttractions,
    restaurants,
    weatherForcast: weatherForcastArray,
  });
});

module.exports = router;
