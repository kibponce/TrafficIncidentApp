import React, { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/MaterialIcons';

//Stacks
import IncidentStack from './IncidentStack';
import AddStack from './AddStack';

const tabNavigation = createBottomTabNavigator({
    Map: {
        screen: IncidentStack,
        navigationOptions: {
            tabBarLabel: "Incidents",
            tabBarIcon: ({ tintColor }) => {
                return <Ionicons name="warning" size={24} color={tintColor} />
            },
        }
    },
    Add: {
        screen: AddStack,
        navigationOptions: {
            tabBarLabel: "Add",
            tabBarIcon: ({ tintColor }) => {
                return <Ionicons name="add-alert" size={24} color={tintColor} />
            }
        }
    }
});

export default tabNavigation;