import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView, PermissionsAndroid } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { mapStyle } from '../style/mapStyle';
import { Button } from 'react-native-elements';

export default class Add extends Component {
    constructor() {
        super();
        this.state = {
            latitude: 8.48222,
            longitude: 124.64722,
            latitudeDelta: 0.0020,
            longitudeDelta: 0.0020, 
            title: "",
            description: "",
            isSaveLoading: false
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
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("position", position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => { console.log("error getting location", error) },
        );
    }

    render() {
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
                <ScrollView style={styles.formContainer}>
                        <TextInput 
                            placeholder="Title" 
                            onChangeText={(title) => this.setState({title})}
                            value={this.state.title}
                        />
                        
                        <TextInput 
                            style={styles.multiline}
                            placeholder="Description" 
                            multiline= {true}
                            numberOfLines = {5}
                            onChangeText={(description) => this.setState({description})}
                            value={this.state.description}
                        />

                        <Button 
                            buttonStyle={{
                                backgroundColor: "#ddd1af",
                                width: 300,
                                height: 45,
                                borderColor: "transparent",
                                borderWidth: 0,
                                borderRadius: 5
                            }}
                            loading
                            loadingProps={{ size: "large", color: "#fff" }}
                            title="SAVE"/>     
                </ScrollView>
            </KeyboardAvoidingView>
        );
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
        textAlignVertical: "top"
    },
    map: { ...StyleSheet.absoluteFillObject }
});