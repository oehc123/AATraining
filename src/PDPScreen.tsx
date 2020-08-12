import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, Dimensions, Animated, Slider, BackHandler, NativeEventEmitter, NativeModules } from 'react-native';
import { FocusManager, Video } from '@youi/react-native-youi';
import { NavigationScreenProp, NavigationEventSubscription } from 'react-navigation';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BORDER_WIDTH = WIDTH*0.005
const PLAYER_CONTROL_DURATION = 3000

interface Props {
  navigation: NavigationScreenProp<any,any>
}

interface State {
  isPlaying: boolean
  isPDPPlayButtonFocused: boolean
  isPlayerBackButtonFocused: boolean
  showPlayer: boolean
  currentTime: number
  duration: number,
  isPlayerPlayPauseBtnFocused: boolean
}

const UserInteractionEmitter = new NativeEventEmitter(NativeModules.InteractionModule);

export default class PDPScreen extends React.PureComponent <Props, State> {
  item: any;
  mainContainer = React.createRef<View>();
  playButton = React.createRef<View>();
  video = React.createRef<Video>();
  playerContainer = React.createRef<View>();
  playerBackButton = React.createRef<View>();
  fadeOpacityPlayer = new Animated.Value(0);
  fadePlayerControllers = new Animated.Value(1);
  positionPlayerAnimation = new Animated.Value(HEIGHT);
  focusListener?: NavigationEventSubscription;
  blurListener?: NavigationEventSubscription;
  eventEmitter: any;
  isPlayerControlShowing: boolean = false
  playerControlTimer!: NodeJS.Timeout;

  constructor(props: Props) {
    super(props)
    this.item = this.props.navigation.getParam('item');
    this.state={
      isPlaying: false,
      isPlayerBackButtonFocused: false,
      isPDPPlayButtonFocused: true,
      showPlayer: false,
      currentTime: 0,
      duration: 0,
      isPlayerPlayPauseBtnFocused: false,
    }
    
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", this.backAction);
      FocusManager.setFocusRoot(this.mainContainer.current, true)
      FocusManager.focus(this.playButton.current)
    });

    this.blurListener = this.props.navigation.addListener("didBlur", () => {
      BackHandler.removeEventListener('hardwareBackPress', this.backAction)
      if (this.eventEmitter) {
        this.eventEmitter.remove();
      }
    });
    //Listen to key events to show player controls:
    // start listening for events emitted from native layer
    this.eventEmitter = UserInteractionEmitter.addListener('USER_INTERACTION', this.onKeyPressed);
  }

  onKeyPressed = () => {
    if(this.state.showPlayer) {
      if(this.isPlayerControlShowing) {
        clearTimeout(this.playerControlTimer)
        this.playerControlTimer = setTimeout(this.hidePlayerControl, PLAYER_CONTROL_DURATION)
      }
      else {
        this.showPlayerControl()
      }
    }
  }

  showPlayerControl = () => {
    this.playerControlTimer && clearTimeout(this.playerControlTimer)
    NativeModules.InteractionModule.stopListening();
    Animated.timing(
      this.fadePlayerControllers, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }
    ).start( () => {
      this.playerControlTimer = setTimeout(this.hidePlayerControl, PLAYER_CONTROL_DURATION)
    })
    this.isPlayerControlShowing = true
  }

  hidePlayerControl = () => {
      Animated.timing(
        this.fadePlayerControllers, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        }
      ).start(() => {
        console.log('jose startListening');
      })
      NativeModules.InteractionModule.startListening()
      this.isPlayerControlShowing = false
  }

  backAction = () => {
    if(this.state.showPlayer) {
      this.showPDP()
    }
    else {
      this.props.navigation.goBack()
    }
    return true
  }

  hidePDP = () => {
    // start listening for events
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
      this.showPlayerControl()
    })
  };

  showPDP = () => {
    NativeModules.InteractionModule.stopListening();
    // shutdown our event emitter listener

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

  getTimeDuration = () => {
      const milliseconds = this.state.duration - this.state.currentTime
      //Get hours from milliseconds
      const hours = milliseconds / (1000*60*60);
      const absoluteHours = Math.floor(hours);
      const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
    
      //Get remainder from hours and convert to minutes
      const minutes = (hours - absoluteHours) * 60;
      const absoluteMinutes = Math.floor(minutes);
      const m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
    
      //Get remainder from minutes and convert to seconds
      const seconds = (minutes - absoluteMinutes) * 60;
      const absoluteSeconds = Math.floor(seconds);
      const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
    
    
      return h > 0 ? h + ':' + m + ':' + s : m + ':' + s
    }

  onPlayPausePressed = () => {
    const { isPlaying } = this.state
    if(isPlaying) {
      this.video.current.pause()
    }
    else {
      this.video.current.play()
    }
    this.setState({isPlaying: !this.state.isPlaying})
  }


  onSlidingComplete = (value: number) => {
    if(this.isPlayerControlShowing) {
      const position = Math.floor(value);
      this.video.current.pause()
      this.video?.current.seek(position)
      this.video.current.play()
    }
  }

  render() {
    const { isPlayerBackButtonFocused, isPDPPlayButtonFocused, isPlayerPlayPauseBtnFocused } = this.state
    const playPauseButtonStyle = isPlayerPlayPauseBtnFocused ? {width: WIDTH* 0.056, height: WIDTH* 0.056, borderRadius: WIDTH*0.056/2} : {width: WIDTH* 0.04, height: WIDTH* 0.04, borderRadius: WIDTH*0.04/2}
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
          style={{backgroundColor: 'black', justifyContent: 'space-between', width: WIDTH, height: '100%', position:'absolute', opacity: this.fadeOpacityPlayer, transform: [{translateY: this.positionPlayerAnimation}] }}// this.state.showPlayer ? 1: 0}}
        >
          <Video
            source={{
              uri: this.item.video,
              type: "HLS"
            }}
            muted={true}
            onCurrentTimeUpdated={(currentTime: number) => {
              this.setState({
                currentTime: currentTime
              })}
            }
            onDurationChanged={(duration: number) => {
              this.setState({
                duration: duration
              })}
            }
            onReady={() => {
              this.state.isPlaying && this.video.current.play() 
            }}
            ref={this.video}
            style={{ width: '100%', height:'100%', position: "absolute",}}
          />
          <TouchableWithoutFeedback 
            onPress={this.showPDP}
            onFocus={() => this.setState({ isPlayerBackButtonFocused: true})}
            onBlur={() => this.setState({ isPlayerBackButtonFocused: false})}    
          >
            <Animated.View style={[styles.playerBackButton, {opacity: this.fadePlayerControllers, borderWidth: isPlayerBackButtonFocused ? BORDER_WIDTH : 0}]} ref={this.playerBackButton}>
              <Text style={{textAlign:'center'}}>Back</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
          <Animated.View style={{opacity: this.fadePlayerControllers, justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row', width: '100%', height: 20, marginBottom: '15%'}}>
              <TouchableWithoutFeedback
                onFocus={() => this.setState({ isPlayerPlayPauseBtnFocused: true})}
                onBlur={() => this.setState({ isPlayerPlayPauseBtnFocused: false})}  
                onPress={this.onPlayPausePressed}
              >
              <View style={[playPauseButtonStyle, { alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: 'white'}]}>
                <Image 
                  style={{ width: WIDTH* 0.05, height: WIDTH* 0.05, resizeMode: 'contain'}}
                  source={{uri: this.state.isPlaying ? "res://drawable/default/pauseBtn.png" : "res://drawable/default/playBtn.png"}}
                />
                </View>
              </TouchableWithoutFeedback>
              <Slider
                style={{ width: '80%'}}
                maximumValue={this.state.duration}
                minimumValue={0}
                value={this.state.currentTime}
                onSlidingComplete={this.onSlidingComplete}
              />  
              <View style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}}><Text>{this.getTimeDuration()}</Text></View>
            </Animated.View>
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
    top: '5%',
    left: '5%'
  }
});
