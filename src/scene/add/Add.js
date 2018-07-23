import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { mapStyle } from '../style/mapStyle';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            latitude: 8.48222,
            longitude: 124.64722,
            latitudeDelta: 0.0020,
            longitudeDelta: 0.0020,
            title: "",
            description: ""
        };
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
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    multiline: {
        textAlignVertical: "top"
    },
    map: { ...StyleSheet.absoluteFillObject }
});