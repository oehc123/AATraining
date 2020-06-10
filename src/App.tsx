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
      const response = await RequestService.fetchCategories()
      const allPromiseMovies = response.data.map( async (item: { filter: string; title: string; }) => {
        try {
          const categoryMovieResponse = await RequestService.fetchMoviesByCategory(item.filter)
          return {categoryTitle: item.title, categoryFilter: item.filter, movies: categoryMovieResponse.data}
        } catch(e) {console.log('error fetching movies of specific category ', e)}
      })
      const allMovies = await Promise.all(allPromiseMovies)
      this.setState({
        data: allMovies,
        loading: false
      })
     } catch(e) {console.log('error fetching data ', e)}
   }

   renderItem =  ({item, index}: ListRenderItemInfo<any>, firstSwimlane: boolean) => {
    return(
      <ListItem item={item} index={index} firstSwimlane={firstSwimlane}/>
     )
   }

   renderSwimlane = ({item, index}: ListRenderItemInfo<any>) => {

     return(
       <View>
        <Text style={{marginLeft: '1%'}}>
          {item.categoryTitle}
        </Text>
        <FlatList
          data={item.movies}
          renderItem={item => this.renderItem(item, index===0)}
          horizontal
          snapToAlignment='center'
          snapToInterval={0}
        />
        <View style={{width: '100%'}}/>
      </View>
     )
   }

  render() {
    const { loading } = this.state

    return (
      <View style={styles.mainContainer}>
        <FlatList
          data={this.state.data}
          snapToAlignment='center'
          snapToInterval={0}
          renderItem={this.renderSwimlane}
        />

        <View style={[styles.loadingIndicator, { opacity: loading ? 0.3 : 0 }]}>
          <Text>LOADING...</Text>
        </View>
      </View>
     );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'grey',
    paddingTop: '1%'
  },
  loadingIndicator: {
    position: 'absolute', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%', 
    width: '100%', 
    backgroundColor: 'green'
  }
});