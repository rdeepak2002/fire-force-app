import axios from 'axios';

async function createUserDevice(notifificationToken) {
  let data = JSON.stringify({
    notificationToken: `${notifificationToken}`,
  });

  let config = {
    method: 'post',
    url: 'https://fire-force-app.herokuapp.com/api/v1/create_user_device',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function getAllFireDevices() {
  let config = {
    method: 'get',
    url: 'https://fire-force-app.herokuapp.com/api/v1/get_fire_devices',
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function getAllFireDevicesWithinRegion(lat, lon, d) {
  let config = {
    method: 'get',
    url: `https://fire-force-app.herokuapp.com/api/v1/get_fire_devices?lat=${lat}&lon=${lon}&d=${d}`,
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

export {createUserDevice, getAllFireDevices, getAllFireDevicesWithinRegion};
