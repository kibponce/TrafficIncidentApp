import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Label} from 'native-base';
import firebase from 'react-native-firebase';

import UserService from '../service/UserService';
import LocalStorage from '../service/LocalStorage';
import Styles from '../helpers/styles'

export default class LoginScene extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            email: null,
            password: null,

            errorMessage: null
        }

        this.unsubscribe = null;
    }

    componentDidMount() {
        this.unsubscribe = firebase
            .auth()
            .onAuthStateChanged(user => {
                console.log('AUTH STATE CHANGE', user)
                if(user == null) {
                    return this.props.navigation.navigate('LoginScene');
                } else {
                    return this.props.navigation.navigate('IncidentScene');
                }
            })
    }
        
    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    render() {
        let errorMessage;
        if(this.state.errorMessage) {
            errorMessage = <View style={styles.errorView}>
                                <Text style={styles.errorText}> {this.state.errorMessage} </Text>
                            </View>;
        }
        return(
            <Container style={Styles.appContainer}>
                <View style={styles.header}>
                    <Text> Traffic Incident </Text>
                </View>
                <Content>
                    <Form style={styles.form}>
                        {errorMessage}
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input value={this.state.email} onChangeText={this.onChangeText.bind(this, "email")}/>
                        </Item >
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input secureTextEntry={true} value={this.state.password} onChangeText={this.onChangeText.bind(this, "password")}/>
                        </Item>
                    </Form>
                    <View style={styles.form}>
                        <Button rounded block success onPress={this.handleLogin.bind(this)}>
                            <Text style={Styles.appText}>Login</Text>
                        </Button>
                    </View>

                    <View style={styles.form}>
                        <Button transparent block info onPress={this.registerScene.bind(this)}>
                            <Text style={styles.registerLink}>No account yet? Sign up</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }

    handleLogin() {
        let { email, password } = this.state;
        console.log(email);
        try {
            UserService.getByEmail(email)
                .then((snapshot) => {
                    if(snapshot.docs.length > 0) {
                        let data = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
                        if(data.isConfirm) {
                           LocalStorage.setUserDetails(data);
                            return this.doAuth(email, password);
                        } else {
                            throw new Error("Your account it not yet confirmed");     
                        }
                    } else {
                        throw new Error("Can't find user");
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.setState({
                        errorMessage: error.message
                    });
                })
        } catch (error) {
            console.log(e);
            this.setState({
                errorMessage: error.message
            });
        }    
    }

    doAuth(email, password) {
        return firebase
                .auth()
                .signInAndRetrieveDataWithEmailAndPassword(email, password)
                .then(() => {
                    return this.props.navigation.navigate('IncidentScene');
                })
                .catch(error => {
                    return Promise.reject(error);
                })
    }

    onChangeText(element, text) {
        this.setState({
            [element] : text
        });
    }

    registerScene() {
        return this.props.navigation.push('Register');
    }
}

const styles = StyleSheet.create({
    header: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600'
    },
    form: {
        margin: 10
    },
    textCenter: {
        textAlign: 'center'
    },
    registerLink: {
        textDecorationLine: 'underline',
        color: '#3759b4'
    },
    errorView: {
        marginLeft: 15,
        marginRight: 15
    },
    errorText: {
        textAlign: 'center',
        color: 'red'
    }
});