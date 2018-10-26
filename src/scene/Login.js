import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View, 
         KeyboardAvoidingView} from 'react-native';
import { Container, Content, Form, Item, Input, Button, Label} from 'native-base';
import firebase from 'react-native-firebase';

import UserService from '../service/UserService';
import Styles from '../helpers/styles';


export default class LoginScene extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null
        }
    }

    componentDidMount() {
        // firebase
        //     .auth()
        //     .onAuthStateChanged(user => {
        //         return this.props.navigation.navigate('TabNavigation');
        //     })
    }

    render() {
        return(
            <Container style={Styles.appContainer}>
                <View style={styles.header}>
                    <Text> Traffic Incident </Text>
                </View>
                <Content>
                    <Form style={styles.form}>
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
        UserService.getByEmail(email)
                    .then((doc) => {
                        console.log(doc);
                    })
        // firebase
        //     .auth()
        //     .signInAndRetrieveDataWithEmailAndPassword(email, password)
        //     .then(() => {
        //         return this.props.navigation.navigate('TabNavigation');
        //     })
        //     .catch(error => {
        //         console.log(error.message);
        //     })
            
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
        marginTop: 10,
        marginBottom: 10
    },
    textCenter: {
        textAlign: 'center'
    },
    registerLink: {
        textDecorationLine: 'underline',
        color: '#3759b4'
    }
});