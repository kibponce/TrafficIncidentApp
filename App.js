import React from 'react';
import { StyleSheet, Text, View, YellowBox } from 'react-native';
import { createStackNavigator } from 'react-navigation';

//Navigations
import LoginAndRegistrationStack from './src/navigation/LoginAndRegistrationStack';

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
  LoginAndRegistrationStack: LoginAndRegistrationStack,
}, {
  headerMode : 'none',
  initialRouteName : 'LoginAndRegistrationStack'
});

const styles = StyleSheet.create({

});
