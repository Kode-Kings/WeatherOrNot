import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Weather from "./components/Weather";
import { API_KEY } from "./utils/WeatherAPIKeys";

export default class App extends Component{

  state = {
    isLoading: true,
    temperature: 0,
    location: null,
    weatherCondition: null,
    error: null
  }

  componentDidMount = () => {
    const geo = navigator.geolocation
    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude,position.coords.longitude)
      },
      error => {
        this.setState({
          error: 'Error Getting weather'
        })
      }
    )
  }

  fetchLocation = () => {

  }

  fetchWeather = (lat = 25, lon = 25) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
    .then(res=>res.json())
    .then(json=> {
      this.setState({
        location: json.name,
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
