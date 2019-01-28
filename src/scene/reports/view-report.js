import React, { Component } from 'react';
import { Image, StyleSheet, Alert } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { POLICE } from '../../helpers/SenderEnum';
import IncidentService from '../../service/IncidentService';
import LocalStorage from '../../service/LocalStorage';

export default class ViewReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user : null
        }
    }
    
    componentDidMount() {
        console.log(this.props.navigation.state.params);

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
        let item = this.props.navigation.state.params.item;
        let settleButton;
        let settleInfo = "";

        if(this.state.user && this.state.user.role === POLICE) {
            settleButton = <Button block success rounded onPress={this.handleSettleIncident.bind(this)}>
                                <Text>Settle</Text>
                            </Button>;
        }

        if(!item.isSettled) {
            settleInfo = "This Incident is not yet settled"
        }
        return (
            <Container>
                <Content style={styles.content}>
                    <Card>
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text>{item.address}</Text>
                                    <Text style={styles.notSettled}>{settleInfo}</Text>
                                    <Text note>{item.report}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <Image source={{uri: item.imageUri}} 
                                    defaultSource={{uri: item.imageUri}} 
                                    style={{height: 250, width: null, flex: 1}}
                                    resizeMode="contain" 
                                    resizeMethod="resize"/>
                        </CardItem>
                    </Card>
                    {settleButton}
                </Content>
            </Container>
        );
    }

    handleSettleIncident() {
        Alert.alert(
            'Settlement',
            'Settle this incident?',
            [
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => {
                    let { item  }= this.props.navigation.state.params;
       
                    if(this.state.user && this.state.user.role === POLICE) {
                        IncidentService.settleIncidents(item.id, {
                            ...item,
                            isSettled: true
                        });

                        this.props.navigation.pop();
                    }
                }},
            ]
        )
    }
}

const styles = StyleSheet.create({
    content: {
        padding: 10
    },
    notSettled: {
        color: 'red'
    }
})