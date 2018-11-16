import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView, KeyboardAvoidingView, PermissionsAndroid } from 'react-native';
import { Container, Icon, Form, Item, Input, Label, Textarea } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoder-reborn';

import ReportSerivce from '../../service/ReportService';

import { CIVILIAN, TRAFFIC_ENFORCER } from '../../helpers/SenderEnum';
import { mapStyle } from '../style/mapStyle';
import { Button, Text } from 'native-base';
import ReportService from '../../service/ReportService';
import IncidentService from '../../service/IncidentService';
import LocalStorage from '../../service/LocalStorage';


export default class Add extends Component {   
    static navigationOptions = {
        title: 'Add'
    };

    constructor() {
        super();
        this.state = {
            latitude: null, // default
            longitude: null, // default
            latitudeDelta: 0.0020,
            longitudeDelta: 0.0020, 
            report: "",
            address: "",
            isSaveLoading: false,
            
            user: null
        };
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
        this.requestLocationPermission();
    }

    componentDidMount() {
        // Get current location of the device
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("position", position);

                let loc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }

                // Now let's geocode the given current position to get the formatted address
                Geocoder.geocodePosition(loc)
                    .then(response => {
                        console.log(response)
                        if(response) {
                            let data = response[0];

                            this.setState({
                                address: data.formattedAddress
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });

                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => { 
                console.log("error getting location", error) 
                Alert.alert(
                    error.message,
                    'Please enable the device location'
                )
            }
        );

        // Access user details from local storage
        LocalStorage.getUserDetails()
            .then(user => {
                this.setState({user: JSON.parse(user)});
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        if(!this.state.latitude && !this.state.longitude) {
            return <View>
                        <Text>Fetching location..</Text>
                   </View>
        }

        return (
            <KeyboardAvoidingView style={styles.wrapper}>
                <View style={styles.container}>
                    <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    customMapStyle={mapStyle}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.0020,
                        longitudeDelta: 0.0020,
                    }}>
                        <MapView.Marker
                            coordinate={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude
                            }}>
                        </MapView.Marker>
                    </MapView>
                </View>
                <Container>
                    <Form>
                        <Item stackedLabel>
                            <Label>Report</Label>
                            <Textarea 
                                style={styles.multiline}
                                multiline= {true}
                                numberOfLines = {5}
                                onChangeText={(report) => this.setState({report})}
                                value={this.state.report}
                            />
                        </Item>
                        <Item>
                            <Label>Upload Image</Label>
                            <Input disabled />
                            <Icon active name='camera' onPress={this.uploadImage.bind(this)} />
                            <View style={styles.imageWrapper}>

                            </View> 
                        </Item>
  
                        <Button rounded danger block onPress={this.handleAddIncident.bind(this)}> 
                            <Text>Send</Text>    
                        </Button>
                    </Form>     
                </Container>
            </KeyboardAvoidingView>
        );
    }

    handleAddIncident() {
        let query = ReportService.add({
            location: ReportSerivce.geopoint(this.state.latitude, this.state.longitude),
            report: this.state.report,
            address: this.state.address,
            sender: CIVILIAN,
        });

        if(this.state.user && this.state.user.isEnforcer) {
            query = IncidentService.add({
                location: ReportSerivce.geopoint(this.state.latitude, this.state.longitude),
                report: this.state.report,
                sender: TRAFFIC_ENFORCER,
            });
        }

        query.then(() => {
            console.log('success');
            this.props.navigation.pop();
        }).catch(error => {
            console.log(error.message)
        });
    }

    uploadImage() {

    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: { 
        height: 180
    },
    formContainer: {
        margin: 10
    },
    multiline: {
        textAlignVertical: "top",
        width: '100%'
    },
    map: { ...StyleSheet.absoluteFillObject },
    imageWrapper: {
        margin: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    }
});