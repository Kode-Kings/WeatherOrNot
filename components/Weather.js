import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet, ImageBackground, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'


const Weather = (props) => {
    const {weather, temperature, location, main, toggleNotif,  notifStatus, schedule} = props
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
      console.log(selectedTime)
      schedule()
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
          <View style={styles.notifContainer}>

            <Text style={{...styles.text, fontSize: 20}}>
              Daily Notifications {notifStatus?'Enabled':'Disabled'}
            </Text>

            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              onValueChange={handleClick}
              value={notifStatus}
              />
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
    pickerContainer: {
      backgroundColor: '#fff'
    }
  });

export default Weather;
