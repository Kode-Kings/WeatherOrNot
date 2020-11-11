import React, { useState } from 'react';
import { View, ScrollView, Switch, Text, StyleSheet, ImageBackground, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'


const Weather = (props) => {
    const {weather, temperature, location, main, toggleNotif,  notifStatus, token, scheduleNotification} = props
    const [show, setShow] = useState(false)
    const [date, setDate] = useState(new Date())
    const [selectedTime, setTime] = useState([])

    const pickerChange = (e, date) => {
      setDate(date)
      let hour = date.getHours()
      let minute = date.getMinutes()
      setTime([hour, minute])
    }
    const handleSaveTime = () => {
      scheduleNotification(token, {hour: selectedTime[0], minute: selectedTime[1], repeats: true})
      setShow(!show)
    }

    const handleClick = () => {
      if (notifStatus === false) {
        toggleNotif()
        setShow(!show)
      }
      else if(show===true && notifStatus === true) {
        toggleNotif()
        setShow(!show)
      }
      else if(notifStatus === true && show === false) {
        toggleNotif()
      }
    }

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

          <View style={styles.forecastContainer}>
            <ScrollView bounces={false} style={styles.hourlyContainer}>
            <Text style={styles.text}>Placeholder for in depth weather data</Text>
            </ScrollView>

          </View>
          <View style={styles.notifContainer}>

            <Switch
              style={{marginRight: '5%'}}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              onValueChange={handleClick}
              value={notifStatus}
            />
            <Text style={{...styles.text, fontSize: 20}}>
              Daily Reminder {notifStatus?'Enabled':'Disabled'}
            </Text>
          </View>
          {
            show ? <Button onPress={handleSaveTime} title=" Save"/>
            :
            undefined
          }
          {show && (<DateTimePicker
              style={styles.pickerContainer}
              value={date}
              mode={'time'}
              is24Hour={true}
              display="default"
              onChange={pickerChange}
            />)}
        </View>
      </ImageBackground>
      );

}

const styles = StyleSheet.create({
    bg: {
        height: '100%',
        width: '100%',
    },
    weatherContainer: {
      display:'flex',
      flexDirection: 'column',
      height: '100%'
    },
    forecastContainer: {
      flex: 4,
      flexDirection: 'column'
    },
    hourlyContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: '10%'
    },
    headerContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center'
    },
    notifContainer: {
      marginBottom: '10%',
      display: 'flex',
      flexDirection:'row',
      justifyContent: 'center',
    },
    pickerContainer: {
      backgroundColor: '#fff',
      position: 'absolute'
    },
    text: {
      fontFamily: 'Noteworthy',
      fontSize: 60,
      fontWeight: 'bold',
      color: '#fff',
      textShadowColor: '#000',
      textShadowRadius: 7,
    },
  });

export default Weather;
