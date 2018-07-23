import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

//Scene
import MapScene from '../scene/incident/Map';

const incidentStack = createStackNavigator({
    Incident : MapScene,
}, { 
    navigationOptions: {
        header: null
    }
});

export default incidentStack;