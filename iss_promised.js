const request = require('request-promise-native');

const fetchMyIP = function () {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = function (body) {
  const ip = JSON.parse(body).ip;
  return request("https://freegeoip.app/json/" + ip);
};

const fetchISSFlyOverTimes = function (body) {
  const longitude = JSON.parse(body).longitude;
  const latitude = JSON.parse(body).latitude;

  return request("http://api.open-notify.org/iss-pass.json?lat=" + latitude + "&lon=" + longitude);
};

const nextISSTimesForMyLocation = function () {
  fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(body => {
      passTimes = JSON.parse(body).response;
      for (const pass of passTimes) {
        const risetime = pass.risetime;
        const duration = pass.duration;
        const datetime = new Date(0);
        datetime.setUTCSeconds(pass.risetime);
        console.log(`Next pass at ${datetime} for ${duration} seconds!`);
      }
    })
    .catch((error) => {
      console.log("It didn't work: ", error.message);
    })
}


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };