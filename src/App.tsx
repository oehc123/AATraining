/**
 * Basic You.i RN app
 */
import React from 'react'
import { StyleSheet, Text, View, FlatList, ListRenderItemInfo } from "react-native";
import RequestService from "./RequestService"
import ListItem from './ListItem';

interface State {
  data: any[]
  loading: boolean
}

interface Props {
}

export default class YiReactApp extends React.Component<Props, State> {
  constructor(props: Readonly<Props>){
    super(props)
    this.state = {
      data: [],
      loading: true
    }
  }

   async componentDidMount() {
     try{
      const response = await RequestService.fetchMovies()
      this.setState({
        data: response.data,
        loading: false
      })
     } catch(e) {console.log('error fetching data ', e)}
   }

   onFocusItem = () => {

   }

   renderItem =  ({item, index}: ListRenderItemInfo<any>) => {
    return(
      <ListItem item={item} index={index}/>
     )
   }

  render() {
    const { loading } = this.state

    return (
      <View style={styles.mainContainer}>
        <Text style={{marginLeft: '1%'}}>
          ALL MOVIES
        </Text>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          horizontal
        />

        <View style={[styles.loadingIndicator, { opacity: loading ? 0.5 : 0 }]}>
          <Text>LOADING...</Text>
        </View>
      </View>
     );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'grey',
    paddingTop: '1%'
  },
  loadingIndicator: {
    position: 'absolute', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%', 
    width: '100%', 
    backgroundColor: 'blue'
  }
});
