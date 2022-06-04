import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, DetailScreen} from './screens';
import io from 'socket.io-client';

const Stack = createNativeStackNavigator();
export const socket = io('http://127.0.0.1:3000');

socket.on('connect', () => {
  console.log('Socket is connected');
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
