import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    ScrollView,
    TextInput,
    Dimensions,
    Button,
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class CreateStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            previewImage: "image_1",
            light_theme: true,
            dropdownHeight: 40,
            caption:""
        };
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
        this.fetchUser();
    }

    async addStory() {
        if (
            this.state.caption
        ) {
            let storyData = {
                preview_image: this.state.previewImage,
                caption: this.state.caption,
                name: firebase.auth().currentUser.displayName,
                created_on: new Date(),
                author_uid: firebase.auth().currentUser.uid,
                likes: 0
            };
            await firebase
                .database()
                .ref(
                    "/posts/" +
                    Math.random()
                        .toString(36)
                        .slice(2)
                )
                .set(storyData)
                .then(function (snapshot) { });
            //this.props.setUpdateToTrue();
            this.setState({
                caption: ""
            })
            Alert.alert(
                "Submitted",
                "Your post was successfully submitted!",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
            //this.props.navigation.navigate("DashboardScreen");
        } else {
            Alert.alert(
                "Error",
                "All fields are required!",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }
    }

    fetchUser = () => {
        let theme;
        firebase
            .database()
            .ref("/users/" + firebase.auth().currentUser.uid)
            .on("value", snapshot => {
                theme = snapshot.val().current_theme;
                this.setState({ light_theme: theme === "light" });
            });
    };

    render() {
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        } else {
            let preview_images = {
                image_1: require("../assets/image_1.jpg"),
                image_2: require("../assets/image_2.jpg"),
                image_3: require("../assets/image_3.jpg"),
                image_4: require("../assets/image_4.jpg"),
                image_5: require("../assets/image_5.jpg")
            };
            return (
                <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={styles.appTitle}>
                        <View style={styles.appIcon}>
                            <Image
                                source={require("../assets/post.jpeg")}
                                style={styles.iconImage}
                            ></Image>
                        </View>
                        <View style={styles.appTitleTextContainer}>
                            <Text style={this.state.light_theme
                                ? styles.appTitleTextLight
                                : styles.appTitleText}>New Post</Text>
                        </View>
                    </View>
                    <View style={styles.fieldsContainer}>
                        <ScrollView>
                            <Image
                                source={preview_images[this.state.previewImage]}
                                style={styles.previewImage}
                            ></Image>
                            <View style={{ height: this.state.dropdownHeight + RFValue(25) }}>
                                <DropDownPicker
                                    items={[
                                        { label: "Image 1", value: "image_1" },
                                        { label: "Image 2", value: "image_2" },
                                        { label: "Image 3", value: "image_3" },
                                        { label: "Image 4", value: "image_4" },
                                        { label: "Image 5", value: "image_5" }
                                    ]}
                                    defaultValue={this.state.previewImage}
                                    containerStyle={{
                                        height: RFValue(40),
                                        borderRadius: 20,
                                    }}
                                    onOpen={() => {
                                        this.setState({ dropdownHeight: 200 });
                                    }}
                                    onClose={() => {
                                        this.setState({ dropdownHeight: 40 });
                                    }}
                                    style={{
                                        backgroundColor: "transparent",
                                        width: Dimensions.get('window').width - RFValue(30),
                                        alignSelf: 'center',
                                        borderColor: this.state.light_theme ? "black" : "white"
                                    }}
                                    itemStyle={{
                                        justifyContent: "flex-start"
                                    }}
                                    dropDownStyle={{
                                        backgroundColor: this.state.light_theme ? "#eee" : "#2f345d",
                                        width: Dimensions.get('window').width - RFValue(30),
                                        alignSelf: 'center',
                                        borderColor: this.state.light_theme ? "black" : "white"
                                    }}
                                    dropDownMaxHeight={RFValue(180)}
                                    labelStyle={
                                        this.state.light_theme
                                            ? styles.dropdownLabelLight
                                            : styles.dropdownLabel
                                    }
                                    arrowStyle={
                                        this.state.light_theme
                                            ? styles.dropdownLabelLight
                                            : styles.dropdownLabel
                                    }
                                    onChangeItem={item =>
                                        this.setState({
                                            previewImage: item.value
                                        })
                                    } />
                            </View>

                            <TextInput
                                style={this.state.light_theme ? styles.inputFontLight : styles.inputFont}
                                onChangeText={caption => this.setState({ caption })}
                                placeholder="Caption"
                                value={this.state.caption}
                                clearButtonMode='always'
                                placeholderTextColor={this.state.light_theme ? "black" : "white"}
                                multiline={true}/>
                            <View style={{ marginBottom: RFValue(220) }} />
                            <View style={styles.submitButton}>
                                <Button
                                    onPress={() => this.addStory()}
                                    title="Submit"
                                    color="#841584"
                                    caption=""
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#15193c"
    },
    containerLight: {
        flex: 1,
        backgroundColor: "white"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
        flex: 0.07,
        flexDirection: "row",
        justifyContent: 'center',
        alignSelf: 'center',
        width: RFValue(200),
        margin: RFValue(10)
    },
    appIcon: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
    },
    iconImage: {
        width: RFValue(50),
        height: RFValue(50),
        resizeMode: "contain",
        borderRadius: 200
    },
    appTitleTextContainer: {
        flex: 0.7,
        justifyContent: 'center'
    },
    appTitleText: {
        color: "white",
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
    },
    appTitleTextLight: {
        color: "black",
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
    },
    fieldsContainer: {
        flex: 0.85
    },
    previewImage: {
        width: "93%",
        height: RFValue(250),
        alignSelf: "center",
        borderRadius: RFValue(10),
        marginVertical: RFValue(10),
        resizeMode: "contain"
    },
    inputFont: {
        height: 100,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: RFValue(5),
        paddingLeft: RFValue(10),
        color: "white",
        fontFamily: "Bubblegum-Sans",
        width: Dimensions.get('window').width - RFValue(30),
        alignSelf: 'center',
    },
    inputFontLight: {
        height: 100,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: RFValue(5),
        paddingLeft: RFValue(10),
        color: "black",
        fontFamily: "Bubblegum-Sans",
        width: Dimensions.get('window').width - RFValue(30),
        alignSelf: 'center',
    },
    dropdownLabel: {
        color: "white",
        fontFamily: "Bubblegum-Sans"
    },
    dropdownLabelLight: {
        color: "black",
        fontFamily: "Bubblegum-Sans"
    },
    submitButton: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: RFValue(-200),
        paddingBottom: RFValue(200)
    }
});

