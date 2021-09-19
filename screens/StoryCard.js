import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
    Dimensions,
    TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
    "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            light_theme: true,
            story_id: this.props.story.key,
            story_data: this.props.story.value,
            is_liked: false,
            likes: this.props.story.value.likes
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

    likeAction = () => {
        if (this.state.is_liked) {
            firebase.database()
                .ref('posts')
                .child(this.state.story_id)
                .child('likes')
                .set(firebase.database.ServerValue.increment(-1))
            this.setState({
                likes: this.state.likes - 1,
                is_liked: false
            })
        }
        else {
            firebase.database()
                .ref('posts')
                .child(this.state.story_id)
                .child('likes')
                .set(firebase.database.ServerValue.increment(1))
            this.setState({
                likes: this.state.likes + 1,
                is_liked: true
            })
        }
    };

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
        let post = this.state.story_data;
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        } else {
            return (
                <TouchableOpacity
                    style={styles.container}
                    onPress={() =>
                        this.props.navigation.navigate("StoryScreen", {
                            post: post
                        })
                    }
                >
                    <View style={styles.cardContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.storyTitleText}>
                                {post.name}
                            </Text>
                        </View>
                        <Image
                            source={require("../assets/image_1.jpg")}
                            style={styles.storyImage} />
                        <View style={styles.captionContainer}>
                            <Text style={styles.descriptionText}>
                                {post.caption}
                            </Text>
                        </View>
                        <View style={styles.actionContainer}>
                            <View style={styles.likeButton}>
                                <Ionicons name={"heart"} size={RFValue(30)} color={"white"} />
                                <Text style={styles.likeText}>12k</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        margin: RFValue(13),
        backgroundColor: "#2f345d",
        borderRadius: RFValue(20)
    },
    storyImage: {
        resizeMode: "contain",
        width: RFValue(Dimensions.get('window').width - RFValue(100)),
        alignSelf: "center",
        height: RFValue(200),
    },
    titleContainer: {
        paddingLeft: RFValue(20),
        justifyContent: "center",
        marginTop: RFValue(30)
    },
    captionContainer: {
        paddingLeft: RFValue(20),
        justifyContent: "center",
    },
    storyTitleText: {
        fontSize: RFValue(25),
        fontFamily: "Bubblegum-Sans",
        color: "white"
    },
    storyAuthorText: {
        fontSize: RFValue(18),
        fontFamily: "Bubblegum-Sans",
        color: "white"
    },
    descriptionText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(16),
        color: "white",
        marginTop: RFValue(5)
    },
    actionContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10)
    },
    likeButton: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#eb3948",
        borderRadius: RFValue(30)
    },
    likeText: {
        color: "white",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
    }
});
