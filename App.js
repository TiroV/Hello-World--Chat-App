import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';


//The Screens
import Chat from './components/Chat';
import Start from './components/Start';
import CustomActions from './components/CustomActions';

// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// The navigator
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Start"
        >
          <Tab.Screen
            name="Start"
            component={Start}
          />
          <Tab.Screen
            name="Chat"
            component={Chat}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}