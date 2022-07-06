//this function gets data for each day as an array and gives an object with day of the weeks and weather information
const weatherProcess = function (listOfWeatherForecasts) {
  if (listOfWeatherForecasts.length > 0) {
    let day = new Date(listOfWeatherForecasts[0].dt * 1000).getDay();

    //we can use this function to alter the day with the string
    // console.log(
    //   new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
    //     new Date(listOfWeatherForecasts[0].dt * 1000)
    //   )
    // );

    let maxTemperature = listOfWeatherForecasts[0].main.temp_max;
    let minTemperature = listOfWeatherForecasts[0].main.temp_min;
    let maxWeatherCondition = 'Clear';
    let maxHumidity = listOfWeatherForecasts[0].main.humidity;
    let weatherConditionMap = {
      Clear: 1,
      Clouds: 2,
      Rain: 3,
      Snow: 4,
    };

    listOfWeatherForecasts.forEach((weatherForecast) => {
      if (weatherForecast.main.temp_min < minTemperature) {
        minTemperature = weatherForecast.main.temp_min;
      }
      if (weatherForecast.main.temp_max < maxTemperature) {
        maxTemperature = weatherForecast.main.temp_max;
      }
      if (weatherForecast.main.humidity < maxHumidity) {
        maxHumidity = weatherForecast.main.humidity;
      }
      if (
        weatherConditionMap[weatherForecast.weather[0].main] >
        weatherConditionMap[maxWeatherCondition]
      ) {
        maxWeatherCondition = weatherForecast.weather[0].main;
      }
    });
    return {
      day,
      maxTemperature,
      minTemperature,
      maxWeatherCondition,
      maxHumidity,
    };
  }
};
// Utility function to convert a `ReadableStream` to a `Buffer`.
const getBufferFromReadableStream = async (stream) => {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

module.exports = {
  weatherProcess,
  getBufferFromReadableStream,
};
