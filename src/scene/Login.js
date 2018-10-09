import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View, 
         KeyboardAvoidingView} from 'react-native';
import { Container, Content, Form, Item, Input, Button, Label} from 'native-base';

import Styles from '../helpers/styles';


export default class LoginScene extends Component {
    static navigationOptions = {
        header: null
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
                            <Label>Username</Label>
                            <Input/>
                        </Item >
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input/>
                        </Item>
                    </Form>
                    <View style={styles.form}>
                        <Button rounded block success onPress={this.onChangeText()}>
                            <Text style={Styles.appText}>Login</Text>
                        </Button>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.textCenter}>OR</Text>
                    </View>
                    <View style={styles.form}>
                        <Button transparent block info onPress={this.registerScene.bind(this)}>
                            <Text style={styles.registerLink}>Register</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }


    onChangeText() {

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