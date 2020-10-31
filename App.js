import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Weather from "./components/Weather";
import { WEATHER_API_KEY } from "./utils/WeatherAPIKeys";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default class App extends Component{

  state = {
    isLoading: true,
    temperature: 0,
    location: {suburb: '', city: ''},
    weatherCondition: null,
    error: null,
    notificationToken: null
  }

  // useEffect = () => {
  //   console.log("starting toregistered");
  //   this.registerForPushNotificationsAsync().then(res=>{
  //     console.log("registered");
  //     token => this.setState({notificationToken: token});
  //   }
      
  //   )
  // }

  componentDidMount = () => {
    //register token from push notification
    // this.registerForPushNotificationsAsync()
    // .then(token => this.setState({notificationToken: token}))

    //get location
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

  registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  handlePress = () =>{
    const date = new Date()
    // console.log(date)
    // date.setMinutes(14)
    // date.setSeconds(0)
    // console.log(this.setTimeTrigger(date, false))
    // const trigger = this.setTimeTrigger(date,false)
    const trigger = this.setDelayTrigger(1)
    this.sendNotification(this.state.notificationToken, "Hi", "notification here", trigger)
  }

  //creates a trigger to be used to schedule notification after a certain amount of delay
  setDelayTrigger = (delay) => {
    const trigger = {seconds: delay}
    return trigger
  }

  //creates a trigger to be used to schedule notification at the specific time of the day(repeats optional; default: false)
  setTimeTrigger = (time, repeat = false) =>{
    const now = new Date();
    const trigger = new Date(now.getFullYear(),now.getMonth(),now.getDate(),time.getHours(),time.getMinutes(),time.getSeconds());
    return trigger
  }

  sendNotification = async (token, title, messages, trigger = {seconds: 1}) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: messages,
        data: { data: 'data goes here'},
      },
      trigger: trigger
    })
    // push notification to specific token
    // const message = {
    //   to: token,
    //   sound: 'default',
    //   title: title,
    //   body: messages,
    //   data: { data: 'data goes here'},
    // };

    // //use aync delay function to delay for time provided in arguments in ms
    // const delay = ms => new Promise(res=> setTimeout(res,ms))

    // // await delay(5000)

    // await fetch('https://exp.host/--/api/v2/push/send', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Accept-encoding': 'gzip, deflate',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(message),
    // }).then(res => console.log("sent"));
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
          <View>
            {/* <Weather weather={weatherCondition} temperature={temperature} location={location}/> */}
            <TouchableOpacity style={styles.button} onPress={this.handlePress}><Text>Notification</Text></TouchableOpacity>
          </View>
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
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 20
  },
});
