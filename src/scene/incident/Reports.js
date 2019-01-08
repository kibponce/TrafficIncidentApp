import React, { Component } from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import { Container, Content, List, ListItem, Text, Left, Right } from 'native-base';

export default class IncidentReports extends Component {
    static navigationOptions = {
        title: 'Total Incidents for today'
    };

    constructor(props) {
        super(props);

        this.state = {
            incidents: []
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params);
    }

    componentWillMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <Container>
                <Content style={styles.content}>
                    {this.showData()}
                </Content>
            </Container>
        );
    }

    showData() {
        console.log("Incidents",this.state.incidents);
        let { incidents } = this.props.navigation.state.params;
        let processedData = {};
        let data = [];

        incidents.forEach( incident => {
            processedData[incident.feature] = {
                name: incident.feature,
                count : (incidents.filter( filter => { return filter.feature == incident.feature }).length ),
                color : this.randomHexGenerator(),
                legendFontColor: '#7F7F7F'
            }
        });

        for(var value in processedData) {
            data.push(processedData[value])
        }

        const incidentsList = data
                                .sort((a, b) => {
                                    return b.count - a.count
                                })
                                .map(report => {
                                    return (
                                        <ListItem key={report.name}>
                                            <Left>
                                                <Text>{report.name}</Text>
                                            </Left>
                                            <Right>
                                                <Text>{report.count}</Text>
                                            </Right>
                                        </ListItem>
                                    );
                                });

        return (
            <List>
                {incidentsList}
            </List>
        )
    }

    randomHexGenerator() {
        return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    }
}

const styles = StyleSheet.create({
    content: {
        padding: 10
    }
})