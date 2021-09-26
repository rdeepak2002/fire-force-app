/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import {View, Text} from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import {getAllFireDevices} from '../api/api';
import messaging from '@react-native-firebase/messaging';

const FireDeviceMapView = () => {
  const [allFireDevices, setAllFireDevices] = useState(undefined);
  const [markers, setMarkers] = useState(undefined);

  const updateMarkers = () => {
    setMarkers(<></>);

    if (!allFireDevices) {
      return;
    }

    const backgroundColors = {
      GOOD: '#deffe0',
      WARN: '#f7ffa1',
      BAD: '#ffb8b8',
    };

    const newMarkers = allFireDevices.map((fireDevice, index) => {
      return (
        <Marker
          coordinate={{
            latitude: parseFloat(fireDevice.location.coordinates[1]),
            longitude: parseFloat(fireDevice.location.coordinates[0]),
          }}
          style={{
            backgroundColor: backgroundColors[fireDevice.status],
            padding: 10,
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 10,
          }}
          key={JSON.stringify(fireDevice) + JSON.stringify(new Date())}>
          <View>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
              {fireDevice.id}
            </Text>
            <Text style={{fontSize: 13, marginTop: 10}}>
              {fireDevice.message}
            </Text>
          </View>
        </Marker>
      );
    });

    setMarkers(newMarkers);
  };

  const fetchDevices = () => {
    getAllFireDevices()
      .then(response => {
        // console.log('list view data', response);
        setAllFireDevices(response, () => {
          updateMarkers();
        });
      })
      .catch(error => {
        console.error('error getting all devices', error);
      });
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        JSON.stringify(new Date()),
        ': fcm message arrived in map view',
      );
      fetchDevices();
      updateMarkers();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('updating markers');
    setMarkers(<></>);
    updateMarkers();
  }, [allFireDevices]);

  useEffect(() => {
    setMarkers(<></>);
    updateMarkers();
  }, []);

  return (
    <View style={{display: 'flex'}}>
      <MapView style={{width: '100%', height: '100%'}}>{markers}</MapView>
    </View>
  );
};

export default FireDeviceMapView;
