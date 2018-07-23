import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

//Scene
import AddIncidentScene from '../scene/add/Add';

const addIncidentStack = createStackNavigator({
    Incident : AddIncidentScene,
}, { 
    navigationOptions: {
        header: null
    }
});

export default addIncidentStack;