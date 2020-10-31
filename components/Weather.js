import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';


const Weather = (props) => {
    const {weather, temperature, location, main} = props
    const backgroundSource = (main) => {
      switch(main) {
        case 'Rain' || 'Drizzle' || 'Thunderstorm' :
          return require('../assets/backgrounds/rainy.jpg')
        case 'Snow' :
          return require('../assets/backgrounds/snowy.jpg')

        case 'Clouds' :
          return require('../assets/backgrounds/cloudy.jpg')

        case 'Clear' :
          return require('../assets/backgrounds/sunny.jpg')
        default :
          return require('../assets/backgrounds/sunny.jpg')
      }
    }
    return (
      <ImageBackground source={backgroundSource(main)} style={styles.bg}>
        <View style={styles.weatherContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.tempText}>{temperature}˚F</Text>
            <Text style={styles.tempText}>{location.suburb}, {location.city}</Text>
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
