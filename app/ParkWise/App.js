// In App.js in a new project

import React from 'react';
import {View, Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from "./src/screen/HomeScreen";
import BookingScreen from "./src/screen/BookingScreen";


const AppNavigator = createStackNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      }
    },
    Booking: {
      screen: BookingScreen,
    }
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(AppNavigator);
