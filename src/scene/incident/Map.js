import React from 'react';
import { StyleSheet, View, PermissionsAndroid, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Marker} from 'react-native-maps';
import firebase from 'react-native-firebase';

// Styles
import { mapStyle } from '../style/mapStyle';
import { Button, Text, Spinner } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Service
import LocalStorage from '../../service/LocalStorage';
import ReportService from '../../service/ReportService';
import IncidentService from '../../service/IncidentService';
import UserService from '../../service/UserService';

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
            user: null,
            latitude: null, 
            longitude: null,
            enforcers: [],
            incidents: [],
            isDebug: false,
            error: null,
        }
    }

    componentWillMount() {
        IncidentService.onIncedentsSnapshot(this.onIncidentsCollectionUpdate);
        UserService.onEnforcersSnapshot(this.onEnforcersCollectionUpdate)
    }

    componentDidMount() {
        console.log("MAP DID UNMOUNT");
        this.watchPosition();
        LocalStorage.getUserDetails()
            .then(user => {
                console.log("LOCAL STORAGE DATA", user);
                this.setState({user: JSON.parse(user)});
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentWillUnmount() {
        console.log("MAP WILL UNMOUNT");
        UserService.unsubscribeEnforcers();
        IncidentService.unsubscribeIncidents();

        navigator.geolocation.clearWatch(this.watchId);
    }

    watchPosition() {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                this.updateLocation();
            },
            (error) => {
                Alert.alert(
                    error.message,
                    'Please enable the device location'
                )
            },
            { timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
        ); 
    }

    updateLocation() {
        // UPDATE MY LOCATION
        UserService.updateLocation(this.state.user.id, {
            ...this.state.user,
            location : UserService.geopoint(this.state.latitude, this.state.longitude)
        });
    }

    logoutLocation() {
        // UPDATE MY LOCATION
        UserService.updateLocation(this.state.user.id, {
            ...this.state.user,
            location : null
        });
    }

    // display all incidents marker
    renderIncidentsMarker() {
        if(this.state.incidents.length <= 0) {
            return
        }

        const incidentsMarkers = this.state.incidents.map(report => {
            return (
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
    
    // display all enforcers marker
    renderEnforcersMarker() {
        const enforcersMarker = this.state.enforcers.map(enforcer => {
            if(enforcer.location) {
                return (
                    <Marker
                    key={enforcer.id}
                    pinColor={ENFORCERS_MARKER}
                    coordinate={{
                        latitude: enforcer.location.latitude,
                        longitude: enforcer.location.longitude
                    }}/> 
                )
            }
        });

        return enforcersMarker;
    }

    // display my marker for enforcer if user is an enforcer
    renderImEnforcerMarker() {
        if(this.state.user && this.state.user.isEnforcer && this.state.latitude && this.state.longitude) {
            console.log("IM ENFORCERS",this.state.user);

            return (
                <Marker
                    pinColor={I_ENFORCER_MARKER}
                    coordinate={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    }}/> 
            )
        } 
    }

    renderMap() {
        if(this.state.latitude && this.state.longitude) {
            return (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    customMapStyle={mapStyle}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.0955,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation
                    showsTraffic
                    followsUserLocation
                    >
                    {/* RENDER ENFORCERS */}
                    {this.renderEnforcersMarker()}
    
                    {/* IF USER IS ENFORCER RENDER MY MARKER */}
                    {this.renderImEnforcerMarker()}

                    {/* RENDER INCIDENTS */}
                    {this.renderIncidentsMarker()}
    
                    {/* <Circle
                        center={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude
                        }}
                        radius={300}
                        fillColor="red"
                        fillOpacity="0.5"
                        zIndex={2}
                    /> */}
                </MapView>
            );
        }
    }

    render() {
        let user = this.state.user;
        let reportButton, debugCircle;
        if(user && user.isEnforcer) {
            reportButton = <Button style={styles.button} rounded danger onPress={this.handleReports.bind(this)}>
                                <MaterialIcons name="report" size={35} color="white" />
                            </Button>
        }

        if(this.state.latitude && this.state.longitude && this.state.user) {
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
                    { this.renderMap() }
                </View>
            );
        } else {
            return (
                <Spinner color='green' />
            );
        } 
    }

    handleAddIncident() {
        this.props.navigation.navigate('AddIncidentScene');
    }

    handleReports() {
        this.props.navigation.navigate('ReportScene');
    }

    handleLogout() {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    try {
                        this.logoutLocation();
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

    onEnforcersCollectionUpdate = (querySnapshot) => {
        
        let enforcers = [];
        querySnapshot.forEach((doc) => {
            enforcers.push({
                id: doc.id,
                location: doc.data().location,
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                email: doc.data().email,
                isConfirmed: doc.data().isConfirmed,
                isEnforcer: doc.data().isEnforcer,
                phoneNumber: doc.data().phoneNumber,
            });
        });
        console.log('ON ENFORCERS UPDATE', enforcers);
        this.setState({
            enforcers: enforcers
        });
    }

    onIncidentsCollectionUpdate = (querySnapshot) => {
        console.log('ON INCIDENTS UPDATE');
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