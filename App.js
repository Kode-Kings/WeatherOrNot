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
      location: {
        suburb: '', 
        city: ''
      },
      weatherData: {},
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
      `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&APPID=${WEATHER_API_KEY}&units=metric`
    )
    .then(res=>res.json())
    .then(json=> {
      let weatherData = {
        current:{},hourly:[],daily:[]
      }
      // console.log(json.daily[0])

      let currentHour = new Date().getHours()
      let main = 'Clear'
      if (currentHour >= 18 || currentHour <= 6) {
        main = 'n' + json.current.weather[0].main
      }

      //Current Weather
      const celsius = json.current.temp
      
      weatherData.current.temperature = this.convertCtoF(celsius)
      
      //capitalizing letter of description
      let desc = json.current.weather[0].description.split('')
      let newDesc = desc.map((letter, i) => {
        if (i===0 || desc[i-1] === ' ') {
          return letter.toUpperCase()
        } else {
          return letter
        }
      }).join('')
      weatherData.current.desc = desc

      // Hourly - 24 hours
      // hour, main weather
      for(let i=0; i<24; i++){
        const hourlyWeather = {}
        // convert milliseconds to hour
        const newDate = new Date()
        newDate.setTime(json.hourly[i].dt*1000)
        // conver hour to string
        const weatherhour = newDate.getHours();
        const convertedHour = ''
        if(weatherhour == 0){
          convertedHour = '12 AM'
        }else if(weatherhour > 0 && weatherhour < 12){
          convertedHour = weatherhour.toString() + " AM"
        }else if(weatherhour == 12){
          convertedHour = '12 PM'
        }else if(weatherhour > 12){
          convertedHour = (weatherhour - 12).toString() + " PM"
        }

        hourlyWeather.hour = convertedHour
        hourlyWeather.main = json.hourly[i].weather[0].main
        weatherData.hourly.push(hourlyWeather)
        // console.log(hourlyWeather)
      }

      // Daily - 7days
      // Date, main weather, max temp, min temp
      // 11/11(Mon), Mon, 11/11
      const dailyWeather = {}
      
      for (let i=0; i<7; i++){
        const result = ''
        const resultDate = new Date()
        resultDate.setTime(json.daily[i].dt*1000)

        result = (resultDate.getMonth() + 1).toString() + "/"
        result += resultDate.getDate().toString()

        const weatherDay = new Date().getDay()
        // console.log(weatherDay)
        const convertedDay = '';
        switch(weatherDay){
          case 0:
            convertedDay = 'Sunday'
            break;
          case 1:
            convertedDay = 'Monday'
            break;
          case 2:
            convertedDay = 'Tuesday'
            break;
          case 3:
            convertedDay = 'Wednesday'
            break;
          case 4:
            convertedDay = 'Thursday'
            break;
          case 5:
            convertedDay = 'Friday'
            break;
          case 6:
            convertedDay = 'Saturday'
            break;
        }

        result += '(' + convertedDay + ')'
        
        dailyWeather.date = result
        dailyWeather.main = json.daily[i].weather[0].main
        dailyWeather.max = this.convertCtoF(json.daily[i].temp.max)
        dailyWeather.min = this.convertCtoF(json.daily[i].temp.min)
        weatherData.daily.push(dailyWeather)
      }
      
      
      this.setState({
        weatherData: weatherData,
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

  convertCtoF = (c) => {
    const fahrenheit = Math.round((c * 9/5) + 32)
    return fahrenheit
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
    const { isLoading, weatherData, mainWeather, location } = this.state;
    return (
      <View style={styles.container}>

            <Weather
              weather={weatherData}
              main={mainWeather}
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
