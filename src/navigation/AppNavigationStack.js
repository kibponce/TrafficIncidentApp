import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

//Scene
import LoginScene from '../scene/Login';
import RegisterScene from '../scene/Register';
import IncidentScene from '../scene/incident/Map';
import AddIncidentScene from '../scene/add/Add';

const AppNagivationStack = createStackNavigator({
    Login : LoginScene,
    Register: RegisterScene,
    IncidentScene: IncidentScene,
    AddIncidentScene: AddIncidentScene
}, { 
    initialRouteName : 'Login'
});

export default AppNagivationStack;