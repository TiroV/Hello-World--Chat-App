import React from 'react';
// For importing the react native components
import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, Image, TouchableOpacity, keyboardAvoiding } from 'react-native';
// For importing the images and icons
import BackgroundImage from '../assets/Background-Image.png';
import icon from '../assets/usericon.png';

export default class Start extends React.Component {
    constructor(props) {
        super(props);

        // Updates both the name and the color depending on user input
        this.state = {
            name: '',
            bgColor: this.colors.blue
        };
    }

    // Function to update the color based on what the user chooses
    changeBgColor = (newColor) => {
        this.setState({ bgColor: newColor });
    };

    // Background colors the user can choose from that is used to update BgColor
    colors = {
        red: '#8a0303',
        purple: '#474056',
        blue: '#8A95A5',
        green: '#B9C6AE',
        gold: '#E8B248'
    };

    render() {
        return (
            //Different components do differents things; View acts as a div from html
            <View style={styles.container}>

                <ImageBackground source={BackgroundImage} resizeMode='cover' style={styles.backgroundImage}>

                    <View style={styles.titleBox}>
                        <Text style={styles.title}>Welcome the chat screen!</Text>
                    </View>

                    <View style={styles.box1}>
                        <View style={styles.inputBox}>
                            <Image source={icon} style={styles.image} />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => this.setState({ name: text })}
                                value={this.state.name}
                                placeholder='Your Name'
                            />
                        </View>

                        <View style={styles.colorBox}>
                            <Text style={styles.chooseColor}> Choose Background Color: </Text>
                        </View>

                        <View style={styles.colorArray}>
                            <TouchableOpacity
                                style={styles.color1}
                                onPress={() => this.changeBgColor(this.colors.red)}>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.color2}
                                onPress={() => this.changeBgColor(this.colors.purple)}>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.color3}
                                onPress={() => this.changeBgColor(this.colors.blue)}>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.color4}
                                onPress={() => this.changeBgColor(this.colors.green)}>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.color5}
                                onPress={() => this.changeBgColor(this.colors.gold)}>
                            </TouchableOpacity>
                        </View>

                        <Pressable
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('Chat', {
                                name: this.state.name,
                                bgColor: this.state.bgColor
                            })}>
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </Pressable>

                    </View>

                </ImageBackground>

            </View>
        )
    }
}
//The Stylesheets
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    //Image Background
    backgroundImage: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    //Box that has all information contained
    titleBox: {
        height: '50%',
        width: '88%',
        alignItems: 'center',
        paddingTop: 100

    },

    title: {
        fontSize: 45,
        fontWeight: "600",
        color: '#FFFFFF',
    },
    //Box beneath welcome text
    box1: {
        backgroundColor: 'white',
        height: '44%',
        width: '88%',
        justifyContent: 'space-around',
        alignItems: 'center',

    },
    //Box where name is inputted
    inputBox: {
        borderWidth: 2,
        borderRadius: 1,
        borderColor: 'grey',
        width: '88%',
        height: 60,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },

    image: {
        width: 20,
        height: 20,
        marginRight: 10
    },

    input: {
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
        opacity: 0.5,
    },

    colorBox: {
        marginRight: 'auto',
        paddingLeft: 15,
        width: '88%'
    },

    chooseColor: {
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
        opacity: 1,
    },

    colorArray: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '88%',
        paddingRight: 60
    },

    color1: {
        backgroundColor: '#8a0303',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    color2: {
        backgroundColor: '#474056',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    color3: {
        backgroundColor: '#8A95A5',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    color4: {
        backgroundColor: '#B9C6AE',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    color5: {
        backgroundColor: '#E8B248',
        width: 50,
        height: 50,
        borderRadius: 25
    },

    button: {
        width: '88%',
        height: 70,
        backgroundColor: '#757083',
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: "600"
    }
});