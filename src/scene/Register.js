import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View, 
         KeyboardAvoidingView,
         ScrollView } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Label, DatePicker, Spinner} from 'native-base';
import firebase from 'react-native-firebase';
import moment from 'moment';

import Styles from '../helpers/styles';

import UserService from '../service/UserService';


export default class RegisterScene extends Component {
    static navigationOptions = {
        title: 'Registration'
    };
    
    constructor(props) {
        super(props);
        this.state = {
            // Form variables
            firstName: null,
            lastName: null,
            address: null,
            birthdate: new Date(),
            phoneNumber: null,
            email: null,
            occupation: null,

            // State
            registrationProgress: false
        }

        this.setDate = this.setDate.bind(this);

        this.ref = firebase.firestore().collection('incidents');
    }

    render() {
        if (this.state.registrationProgress) {
            return (
                <Spinner color='green' />
            )
        }

        return(
            <Container style={Styles.appContainer}>
                <Content>
                    <Form>
                        <Item>
                            <Label style={styles.label}>First name</Label>
                            <Input value={this.state.firstName} onChangeText={this.onChangeText.bind(this, "firstName")}/>
                        </Item>
                        <Item>
                            <Label style={styles.label}>Last name</Label>
                            <Input value={this.state.lastName} onChangeText={this.onChangeText.bind(this, "lastName")}/>
                        </Item>
                        <Item>
                            <Label style={styles.label}>Address</Label>
                            <Input value={this.state.address} onChangeText={this.onChangeText.bind(this, "address")}/>
                        </Item>
                        <Item>
                            <Label style={styles.label}>Birthdate</Label>
                            <DatePicker
                                defaultDate={new Date()}
                                minimumDate={new Date(1900, 1, 1)}
                                maximumDate={new Date()}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="DD/MM/YYYY"
                                textStyle={ styles.birthdate }
                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                onDateChange={this.setDate}
                            />
                        </Item>
                        <Item>
                            <Label style={styles.label}>Phone Number</Label>
                            <Input value={this.state.phoneNumber} onChangeText={this.onChangeText.bind(this, "phoneNumber")}/>
                        </Item>
                        <Item>
                            <Label style={styles.label}>Email Address</Label>
                            <Input value={this.state.email} onChangeText={this.onChangeText.bind(this, "email")}/>
                        </Item>
                        <Item>
                            <Label style={styles.label}>Occupation</Label>
                            <Input value={this.state.occupation} onChangeText={this.onChangeText.bind(this, "occupation")}/>
                        </Item>
                        <View>
                            <Button block rounded success onPress={this.onSubmit.bind(this)}>
                                <Text style={Styles.appText}>Submit</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
            </Container>
        )
    }

    setDate(newDate) {
        this.setState({
            birthdate: newDate
        })
    }
    
    getDate() {
        return moment(this.state.birthdate).format('YYYY-MM-DD');
    }

    onChangeText(element, text) {
        this.setState({
            [element] : text
        });
    }

    onSubmit() {
        this.setState({
            registrationProgress: true
        });

        UserService.add({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            birthdate: this.getDate(),
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            occupation: this.state.occupation
        }).then(() => {
            this.setState({
                firstName: null,
                lastName: null,
                address: null,
                birthdate: new Date(),
                phoneNumber: null,
                email: null,
                occupation: null,

                // Submit process is done
                registrationProgress: false
            });
        }).catch((error) => {
            //error
            console.log(error);
        });
    }
}

const styles = StyleSheet.create({
    itemDate: {
        marginTop: 15,
        marginLeft: 5,
    },
    birthdate : {
       color: 'black'
    },
    label: {
        fontWeight: '600',
        color: '#aba6a6'
    }
});