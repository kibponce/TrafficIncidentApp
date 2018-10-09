import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

//Scene
import LoginScene from '../scene/Login';
import RegisterScene from '../scene/Register';

const loginAndRegistrationStack = createStackNavigator({
    Login : LoginScene,
    Register: RegisterScene
}, { 
    initialRouteName : 'Login'
});

export default loginAndRegistrationStack;