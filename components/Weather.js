import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Weather extends Component{



    render(){
        return(
            <View>
                <View>
                    <Text>Icon</Text>
                    <Text>Location</Text>
                    <Text>Temperature</Text>
                </View>
                <View>
                    <Text>Settings</Text>
                </View>
            </View>
            
        )
    }
    
}

export default Weather;