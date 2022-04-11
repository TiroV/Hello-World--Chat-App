import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';



export default class Chat extends React.Component {
    render() {

        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        //For the color picking function
        const { bgColor } = this.props.route.params;

        return (
            //View style to handle the styles
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor }}>
                <Button
                    title="Back to Start"
                    onPress={() =>
                        this.props.navigation.navigate("Start")
                    }
                />
                <Text>Hello, welcome to the chat!!</Text>
            </View>
        );
    };
}