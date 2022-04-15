import React from 'react';
import { View, Platform, KeyboardAvoidingView, Text, Button, TextInput, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'


<<<<<<< Updated upstream
=======

//Firebase imports

const firebase = require('firebase');
require('firebase/firestore');

>>>>>>> Stashed changes
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
        };
<<<<<<< Updated upstream
=======


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
        this.referencemessages = firebase.firestore().collection("messages");

>>>>>>> Stashed changes
    }

    componentDidMount() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
        //Pulls the information from firestore
        this.referencemessages = firebase.firestore().collection('messages');
        this.unsubscribe = this.referencemessages.onSnapshot(this.onCollectionUpdate)
        //Authenticates user
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                loggedInText: "Hello there!",
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    //Change the url to update the test avatar
                    avatar: "https://i.imgur.com/Ilg6qlx.jpg",
                },
            });

            //Refrence to the active user's information
            this.refMsgsUser = firebase
                .firestore()
                .collection('messages')
                .where('uid', '==', this.state.uid);


            this.unsubscribe = this.referencemessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);


        });

    }

    componentWillUnmount() {
        //Stop listening for authentication
        this.authUnsubscribe();
        //Stop listening for changes
        this.unsubscribe();
    }

<<<<<<< Updated upstream
=======
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // Makes a forEach to check the messages list
        querySnapshot.forEach((doc) => {
            // Gets the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                },

            });
        });
        this.setState({
            messages,

        });
        this.saveMessages();
    };

    //Adds new messages
    addMessages() {
        const message = this.state.messages[0];
        this.referencemessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
            location: message.location || null,
        });
    }
    //Get messages
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



>>>>>>> Stashed changes
    onSend(messages = []) {
        this.setState(
            (previousState) => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.addMessages();
                this.saveMessages();
            }
        );
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
                        _id: this.state.user._id,
                        name: this.state.name,
                        avatar: this.state.user.avatar,
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