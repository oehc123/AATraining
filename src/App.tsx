import  React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './MainScreen';
import PDPScreen from './PDPScreen';

const RootStack = createStackNavigator(
  {
    MainScreen,
    PDPScreen
  },
  {
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class YiReactApp extends React.PureComponent {
  render() {
    return (
    <AppContainer />
    )
  }
}
