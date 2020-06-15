import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { FocusManager } from '@youi/react-native-youi';

interface Props {
  navigation: NavigationScreenProp<any,any>
}

interface State {}

export default class PDPScreen extends React.PureComponent <Props, State> {
  item: any;
  mainContainer = React.createRef<View>();
  constructor(props: Props) {
    super(props)
    this.item = this.props.navigation.getParam('item');
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
    alignItems: 'center'
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
  }
});
