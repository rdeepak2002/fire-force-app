/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import {StyleSheet, Text, View} from 'react-native';
import {getAllFireDevices} from '../api/api';

const ListView = () => {
  const [allFireDevices, setAllFireDevices] = useState(undefined);

  useEffect(() => {
    getAllFireDevices()
      .then(response => {
        console.log('list view data', response);
        setAllFireDevices(response);
      })
      .catch(error => {
        console.error('error getting all devices', error);
      });
  }, []);

  return (
    <View>
      {allFireDevices?.map((fireDevice, _) => {
        const backgroundColors = {
          GOOD: 'white',
          WARN: 'yellow',
          BAD: 'red',
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
            <Text>{fireDevice.status}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default ListView;
