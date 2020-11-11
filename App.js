import { StatusBar } from 'expo-status-bar';
import React, { Component} from 'react';
import { StyleSheet,View } from 'react-native';
import Weather from "./components/Weather";
import { WEATHER_API_KEY} from "./utils/APIKey";
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
  constructor() {
    super()
    this.state = {
      isLoading: true,
      temperature: 0,
      location: {suburb: '', city: ''},
      weatherCondition: '',
      mainWeather: '',
      notificationEnabled: false,
      error: null,
      notificationToken: null,
    }
  }
  toggleNotif = async () => {
    if (this.state.notificationEnabled) {
      console.log('deleting all scheduled @@@@@@')
      Notifications.cancelAllScheduledNotificationsAsync()
      this.setState({
        notificationEnabled: false
      })
    }
    else {
      this.registerForPushNotificationsAsync()
      this.setState({
      notificationEnabled: true
    })
    }
  }



  componentDidMount = async () => {
    //register token from push notification
    // Notifications.cancelAllScheduledNotificationsAsync()
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
      if (existingStatus === 'granted') {
        let token = (await Notifications.getExpoPushTokenAsync()).data;
        this.setState({notificationEnabled: true, notificationToken: token})
      }
    }
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
      })
  }

  fetchWeather = (lat = 40.76, lon = -73.82) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${WEATHER_API_KEY}&units=metric`
    )
    .then(res=>res.json())
    .then(json=> {
      const celsius = json.main.temp
      const fahrenheit = Math.round((celsius * 9/5) + 32)
      let currentHour = new Date().getHours()
      let main = 'Clear'
      if (currentHour >= 18 || currentHour <= 6) {
        main = 'n' + json.weather[0].main
      }
      //capitalizing letter of description
      let desc = json.weather[0].description.split('')
      let newDesc = desc.map((letter, i) => {
        if (i===0 || desc[i-1] === ' ') {
          return letter.toUpperCase()
        } else {
          return letter
        }
      }).join('')
      //capitalizing letter of description

      this.setState({
        weatherCondition: newDesc,
        temperature: fahrenheit,
        isLoading: false,
        mainWeather: main
      })
    })
    // .then(()=>{
    //   this.sendNotification(this.state.notificationToken,'testing',
    //   this.state.weatherCondition, {seconds: 1, repeats:false})
    // }
    // )
  }

  registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        //modify to show on screen and give user option to allow permission
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      this.setState({
        notificationToken: token
      })

    } else {
      alert('You must give this application permission to send notifications for push notifications to be enabled.');
    }

    return token;
  }

  sendDailyNotification = async (token, trigger) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Weather Check Reminder',
        body: 'Make sure to check the weather! :^)'
      },
      trigger
    })
  }

  render(){
    const { isLoading, temperature, weatherCondition, mainWeather, location } = this.state;
    return (
      <View style={styles.container}>

            <Weather
              weather={weatherCondition}
              main={mainWeather}
              temperature={temperature}
              location={location}
              notifStatus={this.state.notificationEnabled}
              toggleNotif={this.toggleNotif}
              token={this.state.notificationToken}
              scheduleNotification={this.sendDailyNotification}
              />

        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
});
