/**
 * Basic You.i RN app
 */
import * as React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, ListRenderItemInfo, TouchableWithoutFeedback, BackHandler, TextInput } from "react-native";
import RequestService from "./RequestService"
import ListItem from './ListItem';
import { FocusManager } from '@youi/react-native-youi';
import { DATA } from './testData'
import { NavigationScreenProp, NavigationEventSubscription } from 'react-navigation';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BORDER_WIDTH = WIDTH*0.005

interface State {
  data: any[],
  loading: boolean,
  isloginBtnFocused: boolean,
  showLoginOverlay: boolean,
  username: string,
  password: string,
  isUsernameFocused: boolean,
  isPasswordInputFocused: boolean,
  isloginBtnOverlayFocused: boolean,
  showWrongCredentials: boolean
}

interface Props {
  navigation: NavigationScreenProp<any,any>
}

export default class MainScreen extends React.Component<Props, State> {
  mainFocusRoot = React.createRef<View>();
  overlayFocusRoot = React.createRef<View>();
  usernameTextInput = React.createRef<TextInput>();
  loginButton = React.createRef<TouchableWithoutFeedback>()
  errorMessage = 'default error message'
  lastElemntFocused = React.createRef<TouchableWithoutFeedback>();
  focusListener?: NavigationEventSubscription;
  blurListener?: NavigationEventSubscription;

  constructor(props: Readonly<Props>){
    super(props)
    this.state = {
      //data: [],
      //loading: true,
      data: DATA,
      loading: false,
      isloginBtnFocused: false,
      showLoginOverlay: false,
      username: '',
      password: '',
      isUsernameFocused: false,
      isPasswordInputFocused: false,
      isloginBtnOverlayFocused: false,
      showWrongCredentials: false,
    }
  }

   async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", this.backAction);
      FocusManager.setFocusRoot(this.mainFocusRoot.current, true)
      FocusManager.focus(this.lastElemntFocused.current)
    });

    this.blurListener = this.props.navigation.addListener("didBlur", () => {
      FocusManager.setFocusRoot(this.mainFocusRoot.current, false)
      BackHandler.removeEventListener('hardwareBackPress', this.backAction)
    });
/*
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
     */
   }

   componentWillUnmount() {
    this.focusListener && this.focusListener.remove();
    this.blurListener && this.blurListener.remove()
  }

   backAction = () => {
     this.setState({showLoginOverlay: false})
     this.overlayFocusRoot.current && FocusManager.setFocusRoot(this.overlayFocusRoot.current, false)
     this.mainFocusRoot.current && FocusManager.setFocusRoot(this.mainFocusRoot.current, true)
     FocusManager.focus(this.loginButton.current)
     return true
   }

   onItemPress = (listItem: React.RefObject<TouchableWithoutFeedback>, item: any) => {
    this.lastElemntFocused = listItem
    this.props.navigation.navigate("PDPScreen", {item})
   };

   renderItem =  ({item, index}: ListRenderItemInfo<any>, firstSwimlane: boolean, isMyWatchList: boolean) => {
    return(
      <ListItem item={item} index={index} firstSwimlane={firstSwimlane} isMyWatchList={isMyWatchList} onPress={this.onItemPress}/>
     )
   }

   renderSwimlane = ({item, index}: ListRenderItemInfo<any>) => {
    const isMyWatchList = item.categoryFilter === 'My Watch List'
    const isFirstItem = index === 0
     return(
       <View>
        <Text style={{marginLeft: '1%'}}>
          {item.categoryTitle}
        </Text>
        <FlatList
          data={item.movies}
          renderItem={item => this.renderItem(item, isFirstItem, isMyWatchList)}
          horizontal
          snapToAlignment='center'
          snapToInterval={0}
        />
        <View style={{width: '100%'}}/>
      </View>
     )
   }

   onLoginPressed = () => {
    this.setState({ showLoginOverlay: true, isUsernameFocused: true, isPasswordInputFocused: false, isloginBtnOverlayFocused: false, showWrongCredentials: false})
    FocusManager.setFocusRoot(this.mainFocusRoot.current, false)
    FocusManager.setFocusRoot(this.overlayFocusRoot.current, true)
    FocusManager.focus(this.usernameTextInput.current)
    
   }

   onLoginFocused = () => this.setState({ isloginBtnFocused: true})

   onLoginBlur = () => this.setState({ isloginBtnFocused: false})

   onLoginOverlayPressed = async () => {
    this.setState({ showWrongCredentials: false}) 
    try{
      const response = await RequestService.loginWithUsernameAndPassword(this.state.username, this.state.password)
      response.data ? this.onLoginRequestSuccess(response.data) : this.showWrongLoginCredentials(response.message)
     } catch(e) {console.log('error trying to login User ', e)}
     
   }

   onLoginRequestSuccess = (myWatchListMovies: []) => {    
    let data = this.state.data 
    const myWatchList = {
      categoryTitle: "My Watch List",
      categoryFilter: "My Watch List",
      movies: myWatchListMovies
    }
    data.unshift(myWatchList)
    this.setState({ data, showLoginOverlay: false })
   }

   showWrongLoginCredentials = (message: string) => {
    this.errorMessage = message 
    this.setState({showWrongCredentials: true})
  }

   onLoginOverlayFocused = () => this.setState({ isloginBtnOverlayFocused: true})

   onLoginOverlayBlur = () => this.setState({ isloginBtnOverlayFocused: false})

   showLoginOverlay = () => {
    const loginFocusedStyle = this.state.isloginBtnOverlayFocused && {borderWidth: BORDER_WIDTH , borderColor: 'black'}
    if (this.state.showLoginOverlay) {
      return(
        <View style ={styles.loginOverlayContainer} ref={this.overlayFocusRoot}>
          <View style={{alignItems: 'flex-start'}}>
            <Text>username</Text>
            <View style={[styles.textInputContainer, this.state.isUsernameFocused && { borderWidth:  2, borderColor: 'black'  }]}>
              <TextInput 
                style={styles.textInputStyle}
                ref={this.usernameTextInput}
                value={this.state.username}
                onChangeText={ text => this.setState({username: text})}
                onFocus={ () => this.setState({isUsernameFocused: true})}
                onBlur={ () => this.setState({isUsernameFocused: false})}
              />
            </View>
            <Text>password</Text>
            <View style={[styles.textInputContainer, this.state.isPasswordInputFocused && { borderWidth:  2, borderColor: 'black'  }]}>
              <TextInput 
                style={styles.textInputStyle}
                value={this.state.password}
                onChangeText={ text => this.setState({password: text})}
                secureTextEntry
                onFocus={ () => this.setState({isPasswordInputFocused: true})}
                onBlur={ () => this.setState({isPasswordInputFocused: false})}
              />
            </View>
            <TouchableWithoutFeedback
              onPress={this.onLoginOverlayPressed}
              onFocus={this.onLoginOverlayFocused}
              onBlur={this.onLoginOverlayBlur}
            >
              <View style={[styles.loginOverlayButton, loginFocusedStyle]}>
                <Text>LOG IN</Text>
              </View>
            </TouchableWithoutFeedback>
            {
              this.state.showWrongCredentials && <Text style={{fontSize: 12}}>{this.errorMessage}</Text>
            }
          </View>
        </View>
      )
    }
   }

  render() {
    const { loading } = this.state
    const loginFocusedStyle = this.state.isloginBtnFocused && {borderWidth: BORDER_WIDTH , borderColor: 'white'}
    return (
      <View style={styles.mainContainer} ref={this.mainFocusRoot}>
        <TouchableWithoutFeedback
          onPress={this.onLoginPressed}
          onFocus={this.onLoginFocused}
          onBlur={this.onLoginBlur}
          ref={this.loginButton}
        >
          <View style={[styles.loginContainerButton, loginFocusedStyle]}>
            <Text>LOG IN</Text>
          </View>
          
        </TouchableWithoutFeedback>
        <FlatList
          data={this.state.data}
          snapToAlignment='center'
          snapToInterval={0}
          renderItem={this.renderSwimlane}
        />
        {this.showLoginOverlay()}
        <View style={[styles.loadingIndicator, { opacity: loading ? 0.5 : 0 }]}>
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
  },
  loginContainerButton: {
    alignSelf: 'flex-end', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '15%', 
    marginRight: '3%', 
    height: '7%', 
    backgroundColor: 'purple', 
    borderWidth: WIDTH* 0.002, 
    borderColor: 'black',
    marginBottom: WIDTH* 0.01
  },
  loginOverlayButton: {
    alignSelf: 'flex-end', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: WIDTH * 0.15, 
    height: '15%', 
    backgroundColor: 'purple', 
    borderRadius: 5,
    marginBottom: WIDTH* 0.01
  },
  textInputContainer: {
    overflow: 'hidden',
    height: HEIGHT* 0.06,
    marginBottom: HEIGHT*0.02, 
    width: WIDTH*0.3,
    backgroundColor: 'white', 
    borderRadius: 5
  },
  textInputStyle: {
    marginTop: -8,
    marginLeft: -15
  },
  loginOverlayContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    width: '100%', 
    height: '100%'
  }
});