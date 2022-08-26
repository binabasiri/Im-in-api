const express = require('express');
const router = express.Router();
const utils = require('../utils/utils');
const fetch = require('node-fetch');
// const protect = require('../middleWare/AuthMiddleWare');

router.get('/photo/:reference', (req, res) => {
  fetch(
    `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${req.params.reference}&key=AIzaSyCAGpSvDklf0bwA63tsJfBQke6cxWP8CrU&maxwidth=400`
  ).then(async ({ body }) => {
    const buffer = await utils.getBufferFromReadableStream(body);
    res.header('content-type', 'image/jpeg').end(buffer);
  });
});

module.exports = router;
