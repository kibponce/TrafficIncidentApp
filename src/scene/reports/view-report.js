import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base'

export default class ViewReport extends Component {
    componentDidMount() {
        console.log(this.props.navigation.state.params);
    }

    render() {
        let item = this.props.navigation.state.params.item;
        return (
            <Container>
                <Content style={styles.content}>
                    <Card>
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text>{item.address}</Text>
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
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        padding: 10
    }
})