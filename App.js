import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Weather from "./components/Weather";
import { API_KEY } from "./utils/WeatherAPIKeys";

export default class App extends Component{

  state = {
    isLoading: false,
    temperature: 0,
    location: null,
    weatherCondition: null,
    error: null
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(API_KEY)
        this.fetchWeather(position.coords.latitude,position.coords.longitude)
      },
      error => {
        this.setState({
          error: 'Error Getting weather'
        })
      }
    )
  }

  fetchWeather(lat = 25, lon = 25){
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
    .then(res=>res.json())
    .then(json=> {
      console.log(json)
    })
  }

  render(){
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        { isLoading ? (
          <View>
            <Text>Fetching...</Text>
          </View>
        ) : (
          <Weather />
        )}
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
