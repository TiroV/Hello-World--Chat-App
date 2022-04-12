import React from 'react';
import { View, Platform, KeyboardAvoidingView, Text, Button, TextInput, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'


export default class Chat extends React.Component {
    //State initialization
    constructor() {
        super();
        this.state = {
            messages: [],
        };
    }

    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello, you!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'This is a system message',
                    createdAt: new Date(),
                    system: true,
                },
            ]
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    render() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        //For the color picking function
        const { bgColor } = this.props.route.params;

        return (

            //View style to handle the styles. Currently why the thing is breaking. Includes code for if user is using android.
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: bgColor }}>

                <Button
                    title="Back to Start"
                    onPress={() =>
                        this.props.navigation.navigate("Start")
                    }
                />
                <Text>Hello, welcome to the chat!!</Text>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />

                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
            </View>
        );

    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    giftedChat: {
        flex: 1,
        width: "75%",
        paddingBottom: 10,
        justifyContent: "center",
        borderRadius: 5,
    },
});