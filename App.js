import React from 'react';
import { StyleSheet, Text, View, YellowBox } from 'react-native';
import { createStackNavigator } from 'react-navigation';

//Navigations
import AppNavigationStack from './src/navigation/AppNavigationStack';

//Remove Warning on development
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])

export default class App extends React.Component {
  render() {
    return (
      <AppMainStackNavigator />
    );
  }
}

const AppMainStackNavigator = createStackNavigator({
  AppNavigationStack: AppNavigationStack,
}, {
  headerMode : 'none',
  initialRouteName : 'AppNavigationStack'
});

const styles = StyleSheet.create({

});
