const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const { GOOGLE_API_KEY } = process.env;
router.get('/search/:cityName', (req, res) => {
  let { cityName } = req.params;
  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_API_KEY}&types=locality&input=${cityName}`
    )
    .then((response) => {
      let predictedCities = [];
      let { predictions } = response.data;
      predictions.forEach((city) => {
        let cityInfo = {
          name: city.structured_formatting.main_text,
          description: city.description,
          placeId: city.place_id,
        };
        // predictedCities.push(cityInfo);
        predictedCities.push(cityInfo);
      });
      return res.status(200).json(predictedCities);
    })
    .catch((error) => {
      return res.status(401).json({ message: 'invalid city' });
    });
});

module.exports = router;
