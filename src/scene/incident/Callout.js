import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Image } from "react-native-svg";

const image_marker = require('../../assets/park-512.png');

export default class Callout extends React.Component {
    render() {
        console.log('IMAGE URI', this.props.imageUri);
        return (
            <View style={styles.markerView}>
                <Text style={styles.info}>{this.props.report}</Text>
                <Text style={styles.guide}>Press to view incident</Text>
            </View>  
        )
    }
}

const styles = StyleSheet.create({
    markerView: {

    },
    info: {
        color: 'black'
    },
    guide: {
        marginTop: 10,
        fontSize: 10,
        color: 'gray'
    }
})