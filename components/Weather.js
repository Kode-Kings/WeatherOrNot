import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Weather = (props) => {
    const {weather, temperature, location} = props
    return (
      <ImageBackground source={require('../assets/backgrounds/sunny.jpg')} style={styles.bg}>
        <View style={styles.weatherContainer}>
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons size={48} name="weather-sunny" color={'#fff'} />
            <Text style={styles.tempText}>{temperature}˚</Text>
            <Text style={styles.tempText}>{location}</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>{weather}</Text>
          </View>
        </View>
      </ImageBackground>
      );

}

const styles = StyleSheet.create({
    bg: {
      width:"100%",
      height: "100%"
    },
    weatherContainer: {
      flex: 1,
      width: "100%"
    },
    headerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    tempText: {
      fontSize: 48,
      color: '#fff'
    },
    bodyContainer: {
      flex: 2,
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      paddingLeft: 25,
      marginBottom: 40
    },
    title: {
      fontSize: 48,
      color: '#fff'
    },
    subtitle: {
      fontSize: 24,
      color: '#fff'
    }
  });

export default Weather;
