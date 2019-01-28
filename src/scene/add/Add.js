import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView, KeyboardAvoidingView, PermissionsAndroid, Image } from 'react-native';
import { Container, Icon, Form, Item, Input, Label, Textarea, Content } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoder-reborn';

import ReportSerivce from '../../service/ReportService';

import { CIVILIAN, TRAFFIC_ENFORCER } from '../../helpers/SenderEnum';
import { mapStyle } from '../style/mapStyle';
import { Button, Text } from 'native-base';
import ReportService from '../../service/ReportService';
import IncidentService from '../../service/IncidentService';
import LocalStorage from '../../service/LocalStorage';
import StorageService from '../../service/StorageService';

import ImagePicker from 'react-native-image-picker';


const IMAGE_PICKER_OPTIONS = {
    title: 'Upload picture',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
};

export default class Add extends Component {   
    static navigationOptions = {
        title: 'Report an Incident'
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
            street: "",
            streetNumber: "",
            feature: "",
            subAdminArea: "",
            locality: "",
            country: "",
            isSaveLoading: false,
            image_uri: null,
            
            user: null
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        // Get current location of the device
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("position", position);

                // Now let's geocode the given current position to get the formatted address
                this.geocodePosition(position.coords.latitude, position.coords.longitude)

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

    renderMarker() {
        if(this.state.latitude && this.state.longitude) {
            return (
                <Marker
                    coordinate={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    }}/>
            )
        }
    }

    render() {
        if(!this.state.latitude && !this.state.longitude) {
            return <View>
                        <Text>Fetching location..</Text>
                   </View>
        } 

        let imgUpload;
        if (this.state.image_uri) {
            imgUpload = <Image
                style={{width: '100%', height: 250}}
                source={{uri: 
                    this.state.image_uri}}
                resizeMode="contain" 
                resizeMethod="resize"
                />
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
                    }}
                    // onUserLocationChange={this.handleLocationChange.bind(this)}
                    showsUserLocation
                    showsTraffic
                    followsUserLocation>
                         
                    {this.renderMarker()}

                    </MapView>
                </View>
                <Container>
                    <Content>
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
                            </Item>
                            <View style={styles.imageWrapper}>
                                {imgUpload}
                            </View>
                            <View style={styles.form}>     
                                <Button block rounded danger onPress={this.handleAddIncident.bind(this)}> 
                                    <Text>Send</Text>    
                                </Button>
                            </View>
                        </Form>
                    </Content>     
                </Container>
            </KeyboardAvoidingView>
        );
    }

    handleAddIncident() {
        StorageService.uploadIncident(this.state.image_uri)
        .then(uri => {
            console.log("SEND INCIDENT");
            let data = {
                location: ReportSerivce.geopoint(this.state.latitude, this.state.longitude),
                report: this.state.report,
                address: this.formatAddress(),
                streetNumber: this.state.streetNumber,
                streetName: this.state.streetName,
                feature: this.state.feature,
                locality: this.state.locality,
                subAdminArea: this.state.subAdminArea,
                country: this.state.country,
                sender: this.state.user.role,
                imageUri: uri.downloadURL,
                isSettled: false,
                date: new Date(),
            }
    
            let query;
    
            // if user is an enforcer
            if(this.state.user && this.state.user.role === TRAFFIC_ENFORCER) {
                query = IncidentService.add(data);
            } else {
                query = ReportService.add(data);
            }

            return query
        })
        .then(() => {
            console.log('SUCCESS');
            this.props.navigation.pop();
        }).catch(error => {
            console.log(error.message)
        });

    }

    // handleLocationChange(event) {
    //     console.log("LOCATION CHANGED",event.nativeEvent.coordinate);
    //     let myLocation = event.nativeEvent.coordinate;
    //     if(myLocation.latitude && myLocation.longitude) {
    //         this.setState({
    //             latitude: myLocation.latitude,
    //             longitude: myLocation.longitude
    //         });

    //         this.geocodePosition(myLocation.latitude, myLocation.longitude)
    //     }
    // }

    geocodePosition(lat, lng) {
        let loc = {
            lat: lat,
            lng: lng
        }

        // Now let's geocode the given current position to get the formatted address
        Geocoder.geocodePosition(loc)
        .then(response => {
            console.log("REVERSE GEOCODE",response);
            if(response) {
                let data = response[0];
                let data2 = response;

                data2.filter( data => {

                    if(data.country) {
                        this.setState({
                            country: data.country,
                        });
                    }

                    if(data.locality) {
                        this.setState({
                            locality: data.locality,
                        });
                    }

                    if(data.streetNumber) {
                        this.setState({
                            streetNumber: data.streetNumber,
                        });
                    }

                    if(data.streetName) {
                        this.setState({
                            streetName: data.streetName,
                        });
                    }
                    

                    if(data.feature && data.locality && !this.state.feature) {
                        this.setState({
                            feature: data.feature,
                        });
                    }

                    if(data.subAdminArea) {
                        this.setState({
                            subAdminArea: data.subAdminArea,
                        });
                    }     
                });
                console.log(this.formatAddress())
                this.setState({
                    address: this.formatAddress(),
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    formatAddress() {
        let {streetNumber, streetName, feature, locality, subAdminArea, country} = this.state;
        return `${streetNumber} ${streetName} ${feature}, ${locality}, ${subAdminArea}, ${country}`;
    }

    uploadImage() {
        ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            }  else {
              const source = { uri: response.uri };
          
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              console.log(source);

              this.setState({
                image_uri: source.uri,
              });

            }
        });
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
    form: {
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