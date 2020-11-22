import React, { useState } from 'react';
import { View, Image, ScrollView, Switch, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'


const Weather = (props) => {
    const {weather, location, main, toggleNotif,  notifStatus, token, scheduleNotification} = props
    const firstDate = new Date()
    const [show, setShow] = useState(false)
    const [date, setDate] = useState(new Date())
    const [selectedTime, setTime] = useState([firstDate.getHours(),firstDate.getMinutes()])

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

        case 'nSnow' :
          return require('../assets/backgrounds/nsnowy.jpg')

        case 'nRain' || 'nDrizzle' || 'nThunderstorm' :
          return require('../assets/backgrounds/nrainy.jpeg')

          default :
          return require('../assets/backgrounds/sunny.jpg')
      }
    }
    return (
      <ImageBackground source={backgroundSource(main)} style={styles.bg}>
        <View style={styles.weatherContainer}>
          <View style={styles.headerContainer}>
            <Text style={{...styles.text, fontSize: 38}}>{weather.current.desc}</Text>
            <Text style={{...styles.text}}>{weather.current.temperature}˚F</Text>
            <Text style={{...styles.text, fontSize: 25}}>{location.suburb}, {location.city}</Text>
          </View>

          <View style={styles.forecastContainer}>
            <View style={{flex: 1}}>
              <ScrollView bounces={false} horizontal={true}

                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                {weather.hourly.map((e)=> {
                  return(
                    <View key={e.hour} style={styles.hourlyContainer}>
                      <Text style={{fontSize:16}}>{e.hour}</Text>
                      {e.pop > 20 ? <Text>{e.pop}%</Text> : <Text></Text>}
                      <Image
                        style={{width: 66,
                          height: 58}}
                        source={{
                        uri: e.icon
                      }}/>
                    </View>
                  )
                })}
              </ScrollView>

            </View>
            <View style={{flex:3}}>
              <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              >
              {weather.daily.map((e) => {
                return (
                  <View key={e.date} style={styles.dailyContainer}>
                    <View style={{display:'flex', flexDirection:'row', width: '70%',
                    alignItems:'center',justifyContent:'space-between'}}>
                      <Text style={{fontSize: 20,marginLeft:'5%'}}>{e.date}</Text>
                      <Image
                        style={{width: 50,
                          height: 50}}
                        source={{
                        uri: e.icon}}/>
                    </View>
                    <View style={{display:'flex', flexDirection:'row', width: '20%',justifyContent:'space-between',marginLeft: '5%'}}>
                      <Text style={{fontSize: 20}}>{e.max}˚</Text>
                      <Text style={{fontSize: 20}}>{e.min}˚</Text>
                    </View>

                  </View>
                )
              })}
              </ScrollView>

            </View>

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
        </View>

            {
              show ? <TouchableOpacity style={styles.saveButton}onPress={handleSaveTime}>
                <Text style={{fontSize: 20}}>SAVE</Text>
                    </TouchableOpacity>
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

      </ImageBackground>

      );

}

const styles = StyleSheet.create({
    bg: {
        height: '100%',
        width: '100%',
    },
    weatherContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      display:'flex',
      flexDirection: 'column',
      height: '100%',
      alignItems: 'center'

    },
    forecastContainer: {
      flex: 3,
      flexDirection: 'column'
    },
    hourlyContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(168,218,220,0.5)',
      borderColor: '#000',
      borderBottomWidth: 2,
      borderTopWidth: 2
    },
    dailyContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      paddingTop:'5%',
      paddingBottom: '5%',
      alignItems: 'center',
      backgroundColor: 'rgba(255,198,255, 0.4)'
    },
    headerContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notifContainer: {
      margin: '5%',
      flex: .3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButton: {
      alignSelf: 'center',
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#000',
      position:'relative',
      width: '20%',
      top: '73%',
      backgroundColor: "#fff"

    },
    pickerContainer: {
      position: 'relative',
      top: '74%',
      backgroundColor: '#fff',
      zIndex: 200
    },
    text: {
      fontFamily: 'Times New Roman',
      fontSize: 60,
      fontWeight: 'bold',
      color: '#fff',
      textShadowColor: '#000',
      textShadowRadius: 7,
    },
  });

export default Weather;
