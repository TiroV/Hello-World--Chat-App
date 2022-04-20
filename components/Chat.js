//React imports
import React from 'react';
import { View, Platform, KeyboardAvoidingView, Text, Button, TextInput, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


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
            uid: 0,
            loggedInText: "Please wait, you are being logged in...",
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
            isConnected: false,
            image: null,
            location: null,
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
        //References chat messages from firebase
        this.referencemessages = firebase.firestore().collection("messages");

    }

    componentDidMount() {
        //Shows username at the top of the screen
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });


        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log('online');
                //Checks for collection updates
                this.unsubscribe = this.referencemessages
                    .orderBy('createdAt', 'desc')
                    .onSnapshot(this.onCollectionUpdate);


                //Authenticates user
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        return await firebase.auth().signInAnonymously();
                    }


                    //Updates the set user state with the collection data
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            //Change the url to update the test avatar
                            avatar: "https://i.imgur.com/Ilg6qlx.jpg",
                        },
                    });

                    //Reference to the active user's information
                    this.refMsgsUser = firebase
                        .firestore()
                        .collection('messages')
                        .where('uid', '==', this.state.uid);
                });


                //Saves messages locally
                this.saveMessages();
            } else {
                // If the user is offline
                this.setState({ isConnected: false });
                console.log('offline');
                this.getMessages();
            }
        });
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    componentWillUnmount() {
        if (this.state.isConnected) {
            //Stop listening for authentication
            this.authUnsubscribe();
            //Stop listening for changes
            this.unsubscribe();
        }
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
    }
    //Gets and updates messages
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };


    //Saves messages
    async saveMessages() {
        try {
            await AsyncStorage.setItem(
                "messages",
                JSON.stringify(this.state.messages)
            );
        } catch (error) {
            console.log(error.message);
        }
    }

    //Delete Messages
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }


    //Updates the messages, then adds the text and saves them
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
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
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