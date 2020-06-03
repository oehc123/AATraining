/**
 * Basic You.i RN app
 */
import React from 'react'
import { Image, StyleSheet, Text, View } from "react-native";
import RequestService from "./RequestService"
import { FormFactor } from "@youi/react-native-youi";

export default class YiReactApp extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: []
    }
  }

   async componentDidMount() {
     try{
       console.log('jose componentdidmount async');
       
      const data = await RequestService.fetchMovies()
      console.log('jose componentdidmount data ', data);
     // this.setState({data})
     } catch(e) {
       console.log(' data Failed to fetch ', e);
       
     }
     
   }

  render() {
    return (
      <View>
        <Text>
          Main Screen
        </Text>
      </View>
     );
  }
}

const styles = StyleSheet.create({
 
});
