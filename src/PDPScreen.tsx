import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { FocusManager } from '@youi/react-native-youi';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BORDER_WIDTH = WIDTH*0.005

interface Props {
  navigation: NavigationScreenProp<any,any>
}

interface State {}

export default class PDPScreen extends React.PureComponent <Props, State> {
  item: any;
  mainContainer = React.createRef<View>();
  constructor(props: Props) {
    super(props)
 //   this.item = this.props.navigation.getParam('item');
    this.item = { id: '0d8DbGTAu9HZK4OAWldb',
    title: 'Land of Soap and Glory',
    description: 'A longer description',
    image: 'https://firebasestorage.googleapis.com/v0/b/sample-movie-api.appspot.com/o/posters%2FpBsO9AZ.jpg?alt=media&token=2594d2c8-8844-4fff-a0c0-f74cc812573e',
    video: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' }
    
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      console.log('jose focus roo PDP');
      
      FocusManager.setFocusRoot(this.mainContainer.current, true)

    });
    
  }

  render() {
    return (
      <View style={styles.container} ref={this.mainContainer}>
        <View style={styles.leftSideContainer}>
            <Image
            source={{uri: this.item.image}}
            style={styles.image}
          />
          <TouchableWithoutFeedback>
            <View style={styles.playButton}>
              <Text style={{textAlign:'center'}}>Play</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.rightSideContainer}>
          <Text style={{fontSize: 20}}>{this.item.title}</Text>
          <Text style={{fontSize: 15}}>{this.item.description}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    paddingTop: '1%',
    flexDirection: 'row'
  },
  leftSideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  image: { 
    height: '65%', 
    width: '65%', 
    marginTop: '5%', 
    resizeMode: 'cover'
  },
  rightSideContainer: {
    flex: 1, 
    margin: '5%'
  },
  playButton: {
    height: '5%',
    width: '40%',
    backgroundColor: 'purple',
    alignContent: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderRadius: 5,
    borderWidth: BORDER_WIDTH
  }
});
