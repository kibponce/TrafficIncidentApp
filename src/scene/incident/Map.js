import React from 'react';
import { StyleSheet, View, PermissionsAndroid, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from 'react-native-maps';
import firebase from 'react-native-firebase';

// Styles
import { mapStyle } from '../style/mapStyle';
import { Button, Text } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Service
import LocalStorage from '../../service/LocalStorage';
import ReportService from '../../service/ReportService';
import IncidentService from '../../service/IncidentService';

import geolib from 'geolib';

const I_ENFORCER_MARKER = "#00FF00";
const ENFORCERS_MARKER = "#0000FF";
const INCEDENTS_MARKER = "#FF0080";

export default class Map extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            enforcer: {
                name: 'Enforcer Teest',
                latitude: 8.48222, 
                longitude: 124.64722,
                radius: 200
            },
            user: null,

            reports: [],
            incidents: [],
        }

        this.mapRef = null;
    }

    async requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'App Location Permission',
              'message': 'App needs to access your location'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location")
          } else {
            console.log("Location permission denied")
          }
        } catch (err) {
          console.warn(err)
        }
    }

    componentWillMount() {
       
    }

    componentDidMount() {
        this.requestLocationPermission();

        ReportService.onSnapshot(this.onReportsCollectionUpdate);
        IncidentService.onSnapshot(this.onIncidentsCollectionUpdate);
        
        LocalStorage.getUserDetails()
            .then(user => {
                this.setState({user: JSON.parse(user)});
            })
            .catch(error => {
                console.log(error);
            })
    }

    componentWillUnmount() {
        ReportService.unsubscribe();
        IncidentService.unsubscribe();
    }

    renderIncidentsMarker() {
        let incidentsMarkers = [];

            this.state.incidents.forEach(report => {
                // let inCircle = geolib.isPointInCircle(
                //     {latitude: report.location.latitude, longitude: report.location.longitude},
                //     {latitude: enforcer.latitude, longitude: enforcer.longitude},
                //     enforcer.radius
                // );

                incidentsMarkers.push(
                    <Marker
                    key={report.id}
                    pinColor={INCEDENTS_MARKER}
                    coordinate={{
                        latitude: report.location.latitude,
                        longitude: report.location.longitude
                    }}/> 
                )
            });
            
        return incidentsMarkers;
    }

    renderEnforcerMarker() {
        console.log(this.state.user);
        if(this.state.user && this.state.user.isEnforcer) {
            return (
                <Marker
                    pinColor={I_ENFORCER_MARKER}
                    coordinate={{
                        latitude: this.state.user.location._latitude,
                        longitude: this.state.user.location._longitude
                    }}/> 
            )
        } 
    }
    
    render() {
        let user = this.state.user;
        let reportButton;
        if(user && user.isEnforcer) {
            reportButton = <Button style={styles.button} rounded danger onPress={this.handleReports.bind(this)}>
                                <MaterialIcons name="report" size={35} color="white" />
                            </Button>
        }

        return (
            <View style={styles.container}>
                <View style={styles.logoutButtonArea}>
                    <Button style={styles.logoutButton} transparent onPress={this.handleLogout.bind(this)}>
                        <Ionicons name="md-log-out" size={35} color="black" />
                    </Button>
                </View>
                <View style={styles.addButtonArea}>
                    {reportButton}
                    <Button style={styles.button} rounded danger onPress={this.handleAddIncident.bind(this)}>
                        <MaterialIcons name="add-alert" size={35} color="white" />
                    </Button>
                </View>
                <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={mapStyle}
                initialRegion={{
                    latitude: 8.48222,
                    longitude: 124.64722,
                    latitudeDelta: 0.0955,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation
                >
                    {/* <Circle
                        center={{
                            latitude: enforcer.latitude,
                            longitude: enforcer.longitude
                        }}
                        radius={enforcer.radius}
                        fillColor="red"
                        zIndex={2}
                        strokeWidth={2}
                    /> */}
                    {this.renderEnforcerMarker()}
                    {this.renderIncidentsMarker()}
                </MapView>
            </View>
        );
    }

    fetchReports() {
        ReportService.get()
            .then(docs => {
                console.log(docs.docs);
            })
    }

    handleAddIncident() {
        this.props.navigation.navigate('AddIncidentScene');
    }

    handleReports() {

    }

    handleLogout() {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    try {
                        firebase.auth().signOut()
                            .then(() => {
                                this.props.navigation.navigate('Login');
                                LocalStorage.clearUserDetails();
                            })
                            .catch(error => {
                                console.log(error)
                            }) 
                    } catch (e) {
                        console.log(e);
                    }
                }},
            ]
        )
    }

    onReportsCollectionUpdate = (querySnapshot) => {
        let reports = [];
        querySnapshot.forEach((doc) => {
            reports.push({
                id: doc.id,
                location: doc.data().location,
                report: doc.data().report
            });
        });

        this.setState({
            reports: reports
        });
    }

    onIncidentsCollectionUpdate = (querySnapshot) => {
        let incidents = [];
        querySnapshot.forEach((doc) => {
            incidents.push({
                id: doc.id,
                location: doc.data().location,
                report: doc.data().report
            });
        });

        this.setState({
            incidents: incidents
        });
    }
}

const styles = StyleSheet.create({
  container: { ... StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  addButtonArea: {
      position: 'absolute',
      zIndex: 10,
      bottom: 45,
      left: 10,
  },
  button: {
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      flex: 1,
      marginTop: 10,
  },
  logoutButtonArea: {
    position: 'absolute',
    zIndex: 10,
    top: 15,
    left: 10,
  },

  logoutButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1
  }
  
});