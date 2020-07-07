import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, Dimensions, Animated } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { FocusManager, Video } from '@youi/react-native-youi';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BORDER_WIDTH = WIDTH*0.005

interface Props {
  navigation: NavigationScreenProp<any,any>
}

interface State {
  isPlaying: boolean
  isPDPPlayButtonFocused: boolean
  isPlayerBackButtonFocused: boolean
  showPlayer: boolean
}

export default class PDPScreen extends React.PureComponent <Props, State> {
  item: any;
  mainContainer = React.createRef<View>();
  playButton = React.createRef<View>();
  video = React.createRef<Video>();
  playerContainer = React.createRef<View>();
  playerBackButton = React.createRef<View>();
  fadeOpacityPlayer = new Animated.Value(0);
  positionPlayerAnimation = new Animated.Value(HEIGHT)

  constructor(props: Props) {
    super(props)
 //   this.item = this.props.navigation.getParam('item');
    this.item = { id: '0d8DbGTAu9HZK4OAWldb',
    title: 'Land of Soap and Glory',
    description: 'A longer description',
    image: 'https://firebasestorage.googleapis.com/v0/b/sample-movie-api.appspot.com/o/posters%2FpBsO9AZ.jpg?alt=media&token=2594d2c8-8844-4fff-a0c0-f74cc812573e',
    video: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' }
    this.state={
      isPlaying: false,
      isPlayerBackButtonFocused: false,
      isPDPPlayButtonFocused: true,
      showPlayer: false

    }
    
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      FocusManager.setFocusRoot(this.mainContainer.current, true)
      FocusManager.focus(this.playButton.current)

    });
    
  }

  hidePDP = () => {
    Animated.parallel([
      Animated.timing(
        this.fadeOpacityPlayer,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.positionPlayerAnimation,
        {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }
      ),
    ])
    .start( () => {
      this.setState({showPlayer: true, isPlaying: true})
      this.video.current.play() 
      FocusManager.setFocusRoot(this.mainContainer.current, false)
      FocusManager.setFocusRoot(this.playerContainer.current, true)
      FocusManager.focus(this.playerBackButton.current)
    })
  };

  showPDP = () => {
    Animated.parallel([
      Animated.timing(
        this.fadeOpacityPlayer,
        {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.positionPlayerAnimation,
        {
          toValue: HEIGHT,
          duration: 300,
          useNativeDriver: true
        }
      ),
    ])
    .start( () => {
      this.setState({showPlayer: false, isPlaying: false})
      this.video.current.pause() 
      FocusManager.setFocusRoot(this.mainContainer.current, true)
      FocusManager.setFocusRoot(this.playerContainer.current, false)
      FocusManager.focus(this.playButton.current)
    })
  }

  render() {
    const { isPlayerBackButtonFocused, isPDPPlayButtonFocused } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.leftSideContainer} ref={this.mainContainer}>
            <Image
            source={{uri: this.item.image}}
            style={styles.image}
          />
          <TouchableWithoutFeedback 
            onPress={this.hidePDP}
            onFocus={() => this.setState({ isPDPPlayButtonFocused: true})}
            onBlur={() => this.setState({ isPDPPlayButtonFocused: false})}  
          >
            <View style={[styles.playButton, {borderWidth: isPDPPlayButtonFocused ? BORDER_WIDTH : 0}]} ref={this.playButton}>
              <Text style={{textAlign:'center'}}>Play</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.rightSideContainer}>
          <Text style={{fontSize: 20}}>{this.item.title}</Text>
          <Text style={{fontSize: 15}}>{this.item.description}</Text>
        </View>
        <Animated.View
          ref={this.playerContainer}
          style={{width: '100%', height: '100%', position:'absolute', opacity: this.fadeOpacityPlayer, transform: [{translateY: this.positionPlayerAnimation}] }}// this.state.showPlayer ? 1: 0}}
        >
          <Video
            source={{
              uri: "http://link.theplatform.com/s/BpkrRC/ckSTzzdGO_K3",
              type: "HLS"
            }}
            muted={true}
            onReady={() => {
              console.log('onReady this.state.isPlaying ', this.state.isPlaying);
              
              this.state.isPlaying && this.video.current.play() 
            }}
            ref={this.video}
            style={{ width: '100%', height:'100%', backgroundColor: 'yellow'}}
          />
          <TouchableWithoutFeedback 
            onPress={this.showPDP}
            onFocus={() => this.setState({ isPlayerBackButtonFocused: true})}
            onBlur={() => this.setState({ isPlayerBackButtonFocused: false})}    
          >
            <View style={[styles.playerBackButton, {borderWidth: isPlayerBackButtonFocused ? BORDER_WIDTH : 0}]} ref={this.playerBackButton}>
              <Text style={{textAlign:'center'}}>Back</Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
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
  },
  playerBackButton: {
    height: '5%',
    width: '20%',
    backgroundColor: 'purple',
    alignContent: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderRadius: 5,
    borderWidth: BORDER_WIDTH,
    position: "absolute",
    top: '5%',
    left: '5%'
    
  }
});
