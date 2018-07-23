import React from 'react';
import { StyleSheet, Text, View, YellowBox } from 'react-native';
import { createStackNavigator } from 'react-navigation';

//Navigations
import TabNavigation from './src/navigation/TabNavigation';

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
  TabNav: TabNavigation,
}, {
  headerMode : 'none',
  initialRouteName : 'TabNav'
});

const styles = StyleSheet.create({

});
