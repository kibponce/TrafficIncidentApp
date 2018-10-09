import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View, 
         KeyboardAvoidingView,
         ScrollView } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Label, DatePicker} from 'native-base';
import Styles from '../helpers/styles';


export default class RegisterScene extends Component {
    static navigationOptions = {
        title: 'Registration'
    };
    
    constructor(props) {
        super(props);
        this.state = {
            chosenDate: new Date()
        }

        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({
            chosenDate: newDate
        })
    }

    render() {
        return(
            <Container style={Styles.appContainer}>
                <Content>
                    <Form>
                        <Item>
                            <Label style={styles.label}>First name</Label>
                            <Input />
                        </Item>
                        <Item>
                            <Label style={styles.label}>Last name</Label>
                            <Input />
                        </Item>
                        <Item>
                            <Label style={styles.label}>Address</Label>
                            <Input />
                        </Item>
                        <Item>
                            <Label style={styles.label}>Birthdate</Label>
                            <DatePicker
                                defaultDate={new Date(2018, 4, 4)}
                                minimumDate={new Date(2018, 1, 1)}
                                maximumDate={new Date(2018, 12, 31)}
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
                            <Input />
                        </Item>
                        <Item>
                            <Label style={styles.label}>Email Address</Label>
                            <Input />
                        </Item>
                        <Item>
                            <Label style={styles.label}>Occupation</Label>
                            <Input />
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

    onChangeText() {
        return '';
    }

    onSubmit() {

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