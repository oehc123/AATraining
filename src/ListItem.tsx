import * as React from 'react';
import { View, Image, StyleSheet, Dimensions, Text, TouchableWithoutFeedback } from 'react-native';
import { FocusManager } from '@youi/react-native-youi';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BORDER_WIDTH = WIDTH*0.005

interface Props {
  item: any,
  index: number,
  firstSwimlane: boolean,
  isMyWatchList: boolean,
}

interface State {
  isFocused: {}
}

export default class ListItem extends React.PureComponent<Props, State> {
  itemRef = React.createRef<TouchableWithoutFeedback>()
  constructor(props: Readonly<Props>){
    super(props)
    this.state = {
      isFocused: false
    }
  }

  componentDidMount = () => {
    const { index, firstSwimlane } = this.props
    setTimeout( () => { this.props.index === 0 && this.props.firstSwimlane && FocusManager.focus(this.itemRef.current) }, 0)
  };

  itemGainFocus = () => {
    this.setState({isFocused: true})
  };

  itemLostFocus = () => {
    this.setState({ isFocused: false})
  };

  render(){
    const { image, title} = this.props.isMyWatchList ? this.props.item.movie : this.props.item
    return (
      <TouchableWithoutFeedback
          ref={this.itemRef}
          onFocus={this.itemGainFocus}
          onBlur={this.itemLostFocus}
      >
        <View style={styles.itemContainer}>
          <View style={[styles.imageContainer, {borderWidth: this.state.isFocused ? BORDER_WIDTH : 0}]}>
            <Image
              source={{uri: image}}
              style={styles.image}
            />
          </View>
          <View style={{flex:1, marginTop: BORDER_WIDTH}}>
            <Text style={styles.title} ellipsizeMode='tail' numberOfLines={2} >{title}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

const styles = StyleSheet.create({
  itemContainer: {
    width: WIDTH*0.2,
    height: HEIGHT*0.35,
    margin: WIDTH*0.015,
  },
  imageContainer: {
    flex: 4, 
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  title: {
    fontSize: 10,
    justifyContent: 'center',
  }
});
