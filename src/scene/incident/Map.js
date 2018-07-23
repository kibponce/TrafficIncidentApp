import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { mapStyle } from '../style/mapStyle';

export default class Map extends React.Component {

    render() {
        return (
        <View style={styles.container}>
            <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={mapStyle}
            initialRegion={{
                latitude: 8.48222,
                longitude: 124.64722,
                latitudeDelta: 0.0955,
                longitudeDelta: 0.0421,
            }}>
                <MapView.Marker
                    coordinate={{
                        latitude: 8.48222,
                        longitude: 124.64722
                    }}>
                </MapView.Marker>
                
                <MapView.Marker
                    coordinate={{
                        latitude: 8.48232,
                        longitude: 124.64772
                    }}>
                </MapView.Marker>
            </MapView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: { ... StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject }
});