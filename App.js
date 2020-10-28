import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Weather from "./components/Weather";
import { WEATHER_API_KEY } from "./utils/WeatherAPIKeys";

export default class App extends Component{

  state = {
    isLoading: true,
    temperature: 0,
    location: {suburb: '', city: ''},
    weatherCondition: null,
    error: null
  }

  componentDidMount = () => {
    const geo = navigator.geolocation
    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchLocation(position.coords.latitude,position.coords.longitude)
        this.fetchWeather(position.coords.latitude,position.coords.longitude)
      },
      error => {
        this.setState({
          error: 'Error Getting weather'
        })
      }
    )
  }

  fetchLocation = (lat = 40.76, lon = -73.82) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    )
    .then(res=>res.json())
    .then(json=> {
      this.setState({
        location: {
          suburb: json.address.suburb,
          city: json.address.city
        }
      })
      // console.log(this.state.location)
      })
  }

  fetchWeather = (lat = 40.76, lon = -73.82) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${WEATHER_API_KEY}&units=metric`
    )
    .then(res=>res.json())
    .then(json=> {
      this.setState({
        weatherCondition: json.weather[0].description,
        temperature: json.main.temp,
        isLoading: false
      })
      // console.log(json.weather[0].description)
    })
  }

  render(){
    const { isLoading, temperature, weatherCondition, location } = this.state;
    return (
      <View style={styles.container}>
        { isLoading ? (
          <View>
            <Text>Fetching...</Text>
          </View>
        ) : (
          <Weather weather={weatherCondition} temperature={temperature} location={location}/>
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
