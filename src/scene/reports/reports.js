import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, List, ListItem, Text,  Left, Right, Body, Icon } from 'native-base';

import LocalStorage from '../../service/LocalStorage';
import ReportService from '../../service/ReportService';

import geolib from 'geolib';

export default class ReportScene extends Component {
    static navigationOptions = {
        title: 'Reports'
    };

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            latitude: null,
            longitude: null,
            reports : []
        }
    }

    componentWillMount() {
        this.getCurrentLocation();
     }

    componentDidMount() {
        ReportService.onSnapshot(this.onReportsCollectionUpdate);
        
        LocalStorage.getUserDetails()
            .then(user => {
                this.setState({user: JSON.parse(user)});
            })
            .catch(error => {
                console.log(error);
            })
    }

    getCurrentLocation() {
        // Get current location of the device
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("position", position);

                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            }
        );
    }

    componentWillUnmount() {
        ReportService.unsubscribe();
    }

    fetchReports() {
        let reports = [];

        if(this.state.user && this.state.latitude && this.state.longitude) {
            
            this.state.reports.forEach(report => {
                if(report.location) {
                    let inCircle = geolib.isPointInCircle(
                        {latitude: report.location.latitude, longitude: report.location.longitude},
                        {latitude: this.state.latitude, longitude: this.state.longitude},
                        200
                    );
    
                    if(inCircle) {
                        reports.push(report);
                    }
                }
            });
        }
            
        console.log(reports);
        return reports;
    }

    render() {
        var items = this.fetchReports();

        return (
            <Container>
              <Content>
                <List dataArray={items}
                  renderRow={(item) =>
                    <ListItem thumbnail>
                        <Body>
                            <Text>{item.report}</Text>
                            <Text note numberOfLines={2}>{item.address}</Text>
                        </Body>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>
                  }>
                </List>
              </Content>
            </Container>
        );
    }

    onReportsCollectionUpdate = (querySnapshot) => {
        console.log('ON REPORTS UPDATE');
        let reports = [];
        querySnapshot.forEach((doc) => {
            reports.push({
                id: doc.id,
                location: doc.data().location,
                report: doc.data().report,
                address: doc.data().address
            });
        });

        this.setState({
            reports: reports
        });
    }
}