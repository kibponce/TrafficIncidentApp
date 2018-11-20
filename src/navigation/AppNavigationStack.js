import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

//Scene
import LoginScene from '../scene/Login';
import RegisterScene from '../scene/Register';
import IncidentScene from '../scene/incident/Map';
import AddIncidentScene from '../scene/add/Add';
import ReportScene from '../scene/reports/reports';
import ViewReportScene from '../scene/reports/view-report';

const AppNagivationStack = createStackNavigator({
    Login : LoginScene,
    Register: RegisterScene,
    IncidentScene: IncidentScene,
    AddIncidentScene: AddIncidentScene,
    ReportScene: ReportScene,
    ViewReportScene: ViewReportScene
}, { 
    initialRouteName : 'Login'
});

export default AppNagivationStack;