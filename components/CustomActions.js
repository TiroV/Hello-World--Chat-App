import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//Expo Permissions
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

//Firebase imports
import firebase from "firebase";

export default class CustomActions extends React.Component {

    // Uploads Images to firestore
    uploadImage = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length - 1];

        const ref = firebase.storage().ref().child(`images/${imageName}`);

        const snapshot = await ref.put(blob);

        blob.close();

        return await snapshot.ref.getDownloadURL();
    };


    //#0)For picking an image to send in chat
    async pickImage() {
        try {
            //Asks for permission to access the user's library for pictures
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
            });

            console.log(result);
            if (!result.cancelled) {
                const imageUrl = await this.uploadImage(result.uri);
                this.props.onSend({ image: imageUrl });
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    //#1) Take a photo with the device's camera to send
    async takePhoto() {
        //Asks for permission to access the user's camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        console.log(permissionResult);

        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to acces the Camera!");
            return;
        }
        const result = await ImagePicker.launchCameraAsync();

        console.log(result);

        if (!result.cancelled) {
            const imageUrl = await this.uploadImage(result.uri);
            this.props.onSend({ image: imageUrl });
        }
    }

    //#2)For getting the location of the current user
    async getLocation() {
        //Asks for permission to use the user's location
        let { status } = await Location.requestForegroundPermissionsAsync();
        try {
            if (status === 'granted') {
                let result = await Location.getCurrentPositionAsync({}).catch((error) =>
                    console.log(error)
                );
                console.log(result);
                if (result) {
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude,
                        },
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }


    //For handling the actions to be used in ActionSheet
    onActionPress = () => {
        const options = [
            "Choose From Library",
            "Take Picture",
            "Send Location",
            "Cancel",
        ];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log("user wants to pick an image");
                        return this.pickImage();
                    case 1:
                        console.log("user wants to take a photo");
                        return this.takePhoto();
                    case 2:
                        console.log("user wants to get their location");
                        return this.getLocation();
                }
            }
        );
    };



    render() {
        return (
            <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}


//Stylesheet 
const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func
};