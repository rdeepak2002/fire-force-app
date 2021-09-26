/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import {RefreshControl, ScrollView, Text, View} from 'react-native';
import {getAllFireDevices} from '../api/api';
import messaging from '@react-native-firebase/messaging';

const ListView = () => {
  const [allFireDevices, setAllFireDevices] = useState(undefined);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchDevices = () => {
    getAllFireDevices()
      .then(response => {
        // console.log('list view data', response);
        setAllFireDevices(response);
        setRefreshing(false);
      })
      .catch(error => {
        console.error('error getting all devices', error);
        setRefreshing(false);
      });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDevices();
  }, []);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(JSON.stringify(new Date()), ': fcm message arrived');
      fetchDevices();
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          tintColor="grey"
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
      {allFireDevices?.map((fireDevice, _) => {
        const backgroundColors = {
          GOOD: '#deffe0',
          WARN: '#f7ffa1',
          BAD: '#ffa1a1',
        };

        return (
          <View
            key={fireDevice.id}
            style={{
              marginTop: 10,
              marginLeft: 5,
              marginRight: 5,
              padding: 10,
              borderRadius: 4,
              backgroundColor: backgroundColors[fireDevice.status],
            }}>
            <Text style={{fontWeight: 'bold', marginBottom: 10, fontSize: 15}}>
              {fireDevice.id}
            </Text>
            <Text>{fireDevice.status}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ListView;
