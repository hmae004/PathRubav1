import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';


export default function RequestScreen() {
    return (
        <View style = {style.container}>
          <Text>This is the requests page.</Text>
        </View>
      );
}

const style = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:"white",
      justifyContent:'center',
      alignItems:"center",
    },
    image:{
      paddingTop:60,
      width:300,
      height:300,
    }
  });