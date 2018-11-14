import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Label, DatePicker, Spinner, Separator, Toast} from 'native-base';
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
            email: null,
            password: null,
            confirmPassword: null,
            // Form variables
            firstName: null,
            lastName: null,
            address: null,
            birthdate: new Date(),
            phoneNumber: null,
            occupation: null,

            // State
            registrationProgress: false,

            errorMessage: null,
            successMessage: null
        }

        this.setDate = this.setDate.bind(this);
    }

    render() {
        if (this.state.registrationProgress) {
            return (
                <Spinner color='green' />
            )
        }

        let error, success = null;
        if(this.state.errorMessage) {
            error = <View style={styles.error}>
                        <Text style={styles.notifMessage}>{this.state.errorMessage}</Text>
                    </View>;
        }

        if(this.state.successMessage) {
            success = <View style={styles.success}>
                        <Text style={styles.notifMessage}>{this.state.successMessage}</Text>
                    </View>;
        }

        return(
            <Container style={Styles.appContainer}>
                {error}
                {success}
                <Content>
                    <Form>
                        <Separator bordered>
                            <Text>Access</Text>
                        </Separator>
                        <Item>
                            <Label style={styles.label}>Email Address</Label>
                            <Input value={this.state.email} onChangeText={this.onChangeText.bind(this, "email")}/>
                        </Item>
                        <Item>
                            <Label style={styles.label}>Password</Label>
                            <Input value={this.state.password} secureTextEntry={true} onChangeText={this.onChangeText.bind(this, "password")}/>
                        </Item>
                        <Item>
                            <Label style={styles.label}>Confirm Password</Label>
                            <Input value={this.state.confirmPassword} secureTextEntry={true} onChangeText={this.onChangeText.bind(this, "confirmPassword")}/>
                        </Item>
                        <Separator bordered>
                            <Text>Details</Text>
                        </Separator>
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
        );
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
        this.validatePassword();

        this.setState({
            registrationProgress: true
        });

        this.validatePassword()
            .then(() => {
                return firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password)
            })
            .then(() => {
                return UserService.add({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    birthdate: this.getDate(),
                    phoneNumber: this.state.phoneNumber,
                    email: this.state.email,
                    occupation: this.state.occupation,
                    isConfirmed: false,
                    isEnforcer: false,
                    location: null,
                })
            })
            .then(() => {
                return this.setState({
                    email: null,
                    password: null,
                    confirmPassword: null,

                    firstName: null,
                    lastName: null,
                    address: null,
                    birthdate: new Date(),
                    phoneNumber: null,
                    occupation: null,

                    // Submit process is done
                    registrationProgress: false,
                    errorMessage: null,
                    successMessage: 'Registration Successful'

                });
            })
            .catch(error => {
                console.log(error.message);
                //error
                this.setState({
                    errorMessage: error.message,
                    registrationProgress: false
                });
            });
    }

    validatePassword() {
        if(this.state.password == this.state.confirmPassword) {
            return Promise.resolve();
        } else {
            const reason = new Error("Password did not match");
            return Promise.reject(reason);
        }
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
    },
    success: {
        backgroundColor: 'green',
    },
    error: {
        backgroundColor: 'red',
    },
    notifMessage: {
        color: 'white'
    }
});