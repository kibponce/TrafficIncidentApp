import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

//Scene
import LoginScene from '../scene/Login';
import RegisterScene from '../scene/Register';
import TabNavigation from './TabNavigation';

const loginAndRegistrationStack = createStackNavigator({
    Login : LoginScene,
    Register: RegisterScene,
    TabNavigation: TabNavigation
}, { 
    initialRouteName : 'Login'
});

export default loginAndRegistrationStack;