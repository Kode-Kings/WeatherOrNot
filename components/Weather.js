import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';


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

        case 'nClear' :
          return require('../assets/backgrounds/nclear.jpeg')

        case 'nClouds' :
          return require('../assets/backgrounds/ncloudy.jpg')

        case 'nSnowy' :
          return require('../assets/backgrounds/nsnowy.jpg')

        case 'nRainy' :
          return require('../assets/backgrounds/nrainy.jpeg')

          default :
          return require('../assets/backgrounds/sunny.jpg')
      }
    }
    return (
      <ImageBackground source={backgroundSource(main)} style={styles.bg}>
        <View style={styles.weatherContainer}>
          <View style={styles.headerContainer}>
            <Text style={{...styles.text, fontSize: 38}}>{weather}</Text>
            <Text style={{...styles.text}}>{temperature}˚F</Text>
            <Text style={{...styles.text, fontSize: 25}}>{location.suburb}, {location.city}</Text>
          </View>
          <View style={styles.notifContainer}>
            <Text style={{...styles.text, fontSize: 20}}>Set up your notifications settings here!</Text>
            <TouchableOpacity>
              <Text>
                Testing
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      );

}

const styles = StyleSheet.create({
    bg: {
      flex: 1
    },
    weatherContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    headerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontFamily: 'Noteworthy',
      fontSize: 60,
      fontWeight: 'bold',
      color: '#fff',
      textShadowColor: '#000',
      textShadowRadius: 7,
    },
    notifContainer: {
      flex: 2,
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      paddingLeft: 25,
      marginBottom: 40
    },
  });

export default Weather;
