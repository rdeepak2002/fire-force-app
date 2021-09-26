/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ListView from './src/components/ListView';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {View, Text} from 'react-native';
import MapView from './src/components/MapView';
import {createUserDevice} from './src/api/api';
import MaterialCommunityIcons from 'react-native-vector-icons/Foundation';

const Tab = createBottomTabNavigator();

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }

  return authStatus;
}

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Devices"
        component={ListView}
        options={{
          tabBarLabel: 'Devices',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapView}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="magnifying-glass"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  const [notificationPermission, setNotificationPermission] =
    useState(undefined);

  const getFcmToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
    return fcmToken;
  };

  useEffect(() => {
    requestUserPermission().then(response => {
      setNotificationPermission(response);
      getFcmToken().then(token => {
        createUserDevice(token);
      });
    });
  }, []);

  return (
    <NavigationContainer>
      {notificationPermission &&
        notificationPermission !== messaging.AuthorizationStatus.DENIED &&
        notificationPermission !==
          messaging.AuthorizationStatus.NOT_DETERMINED && <MyTabs />}
      {notificationPermission === messaging.AuthorizationStatus.DENIED ||
        (notificationPermission ===
          messaging.AuthorizationStatus.NOT_DETERMINED && (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>
              Notification Permission Required
            </Text>
          </View>
        ))}
    </NavigationContainer>
  );
};

export default App;
