import * as React from 'react';
import { TouchableOpacity, ImageBackground, StyleSheet, Dimensions, Text } from 'react-native';
import { FocusManager } from '@youi/react-native-youi';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

interface Props {
  item: any,
  index: number
}

interface State {
  isFocused: {}
}

export default class ListItem extends React.PureComponent<Props, State> {
  itemRef = React.createRef<TouchableOpacity>()
  constructor(props: Readonly<Props>){
    super(props)
    this.state = {
      isFocused: false
    }
  }

  componentDidMount = () => {
    setTimeout( () => { this.props.index === 0 && FocusManager.focus(this.itemRef.current) }, 0)
  };

  itemGainFocus = () => {
    this.setState({isFocused: true})
  };

  itemLostFocus = () => {
    this.setState({ isFocused: false})
  };

  render(){
    const { item } = this.props
  return (
    <TouchableOpacity
        style={[styles.itemContainer, {borderWidth: this.state.isFocused ? WIDTH*0.005 : 0}]}
        ref={this.itemRef}
        onFocus={this.itemGainFocus}
        onBlur={this.itemLostFocus}
      >
        <ImageBackground
          source={{uri: this.props.item.image}}
          style={styles.image}
          resizeMode='cover'
        >
        </ImageBackground>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
  );
}
};

const styles = StyleSheet.create({
  itemContainer: {
    width: WIDTH*0.2,
    height: HEIGHT*0.3,
    margin: WIDTH*0.015,
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%'
  },
  title: {
    fontSize: 10,
    marginTop: '3%'
  }
});
