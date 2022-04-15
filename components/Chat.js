//React imports
import React from 'react';
import { View, Platform, KeyboardAvoidingView, Text, Button, TextInput, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'



//Firebase imports

import firebase from 'firebase';
import firestore from 'firebase';


//const firebase = require('firebase');
//require('firebase/firestore');

export default class Chat extends React.Component {
    //State initialization
    constructor() {
        super();
        this.state = {
            messages: [],
        };


        const firebaseConfig = {
            apiKey: "AIzaSyDX9UHQT8MAjx9cJirjsH6UTXqJPPKXxdU",
            authDomain: "chatapp-768f9.firebaseapp.com",
            projectId: "chatapp-768f9",
            storageBucket: "chatapp-768f9.appspot.com",
            messagingSenderId: "1059909629900",
            appId: "1:1059909629900:web:1baec5b9905caa24190f69"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        //Refrences chat messages from firebase
        this.referenceMessages = firebase.firestore().collection("messages");

    }




    //Deals with the handling of messages showing up
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

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // Goes through each document
        querySnapshot.forEach((doc) => {
            // Gets the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
            });
        });
        this.setState({
            messages,
        });
    };


    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }
    //Rendering the message in a bubble
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