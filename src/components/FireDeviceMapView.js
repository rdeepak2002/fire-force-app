/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import {View, Text} from 'react-native';
import MapView from 'react-native-maps';
import {Marker, Callout} from 'react-native-maps';
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

    const newMarkers = allFireDevices.map((fireDevice, index) => {
      return (
        <Marker
          coordinate={{
            latitude: parseFloat(fireDevice.location.coordinates[1]),
            longitude: parseFloat(fireDevice.location.coordinates[0]),
          }}
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 10,
          }}>
          <View>
            <Text style={{fontSize: 15}}>{fireDevice.id}</Text>
            <Text style={{fontSize: 15}}>{fireDevice.status}</Text>
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
        setAllFireDevices(response);
        updateMarkers();
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
      console.log('fcm message arrived', JSON.stringify(remoteMessage));
      fetchDevices();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    updateMarkers();
  }, [allFireDevices]);

  useEffect(() => {
    updateMarkers();
  }, []);

  return (
    <View style={{display: 'flex'}}>
      <MapView style={{width: '100%', height: '100%'}}>{markers}</MapView>
    </View>
  );
};

export default FireDeviceMapView;
