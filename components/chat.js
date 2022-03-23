import React from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
// import * as firebase from 'firebase';
// import 'firebase/firestore';
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

// Firebase
// const firebase = require('firebase');
// require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBQBypJpmjKldPsTq-jo6SqhvEBG3DH4IU",
  authDomain: "chat-bea94.firebaseapp.com",
  projectId: "chat-bea94",
  storageBucket: "chat-bea94.appspot.com",
  messagingSenderId: "1095425245015",
  appId: "1:1095425245015:web:0b4670d2a267829e674812",
  measurementId: "G-KJ867B935Z"
};

export default class Chat extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        name: '',
        messages: [],
        uid: 0,
        user: {
          _id: '',
          name: '',
          avatar: ''
        },
        isConnected: false
      };

      // initialize firebase
      if (!firebase.apps.length){
        firebase.initializeApp(firebaseConfig);
      }

      // reference to the firestore messages collection
      this.referenceChatMessages = firebase.firestore().collection("messages");
      this.refMsgsUser = null;
  }

  // componentDidMount() {

  //   let { name } = this.props.route.params;
  //   this.props.navigation.setOptions({ title: name });

  //   // creating a reference to messages
  //   // this.referenceChatMessages = firebase
  //   //   .firestore()
  //   //   .collection('messages');

  //   //  listen to authentication events
  //   this.authUnsubscribe = firebase.auth().onAuthStateChanged(async(user) => {
  //     if(!user) {
  //       await firebase.auth().signInAnonymously();
  //     }
  //     // update user state with currently active user data
  //     this.setState({
  //       uid: user.uid,
  //       user: {
  //         _id: user.uid,
  //         name: name,
  //         avatar: 'https://placeimg.com/140/140/any'
  //       },
  //       messages: [
  //         {
  //           _id: 1,
  //           text: 'Hello developer',
  //           createdAt: new Date(),
  //           user: {
  //             _id: 2,
  //             name: 'React Native',
  //             avatar: 'https://placeimg.com/140/140/any',
  //           },
  //         },
  //         {
  //           _id: 2,
  //           text:  `${name} has entered the chat`,
  //           createdAt: new Date(),
  //           system: true,
  //         },
  //       ],
  //     })
  //     // create a reference to the active users documents
  //     this.referenceChatMessages = firebase
  //       .firestore()
  //       .collection('messages')
  //       // .where('uid', '==', this.state.uid);
  //     // listen for collection changes for current user
  //     this.unsubscribeChatUser = this.referenceChatMessages
  //     .orderBy('createdAt','desc')
  //     .onSnapshot(this.onCollectionUpdate);
  //   });
  // }

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

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {

    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Check if the user is on or offline
    NetInfo.fetch().then((connection) => {
      if(connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('Online');

        // Listen for updates in the collection
        this.unsubscribe = this.referenceChatMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(this.onCollectionUpdate);

        // Listen for authentication events
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async(user) => {
            if(!user) {
              return await firebase.auth().signInAnonymously;
            }

            // Update user state with currently active user data
            this.setState({
              uid: user.uid,
              messages: [],
              user: {
                _id: user.uid,
                name: name,
                avatar: 'https://placeimg.com/140/140/any'
              }
            });

            // Referencing messages of current user
            this.refMsgsUser = firebase
              .firestore()
              .collection('messages')
              .where('uid', '==', this.state.uid);
          });

          // Save messages when online
          this.saveMessages();
          
      } else {
        // The user is offline
        this.setState({ isConnected: false });
        console.log('Offline');

        // Retreive from offline
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if(this.state.isConnected) {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribeChatUser();
      // this.unsubscribe();
    }
  }

  
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
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
      messages: messages,
    });
    this.saveMessages();
  };
  
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: this.state.user,
    });
  }
  
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }
    
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'red'
          },
          right: {
            backgroundColor: 'blue'
          }
        }}
      />
    );
  }

  renderInputToolbar(props) {
    if(this.state.isConnected == false) {
    } else {
      return <InputToolbar { ...props } />;
    }
  }

  render() {
    let name = this.props.route.params.name; 
    const { bgColor } = this.props.route.params;

    return (
      <View style={{backgroundColor: bgColor, flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.welcomeFont}>Welcome to the Chat !</Text>
        <View style= {{flex: 1, width: '100%'}}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            renderBubble={this.renderBubble.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            user={{
              uid: this.state.user.uid,
							_id: this.state.user._id,
							name: this.state.name,
							avatar: this.state.user.avatar,
						}}
          />
          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
      </View>
      
    );
  };
}

const styles = StyleSheet.create({
  welcomeFont: {
    fontSize: 20,
    color: '#ffffff'
  }
})





// this.referenceChatMessages = firebase.firestore().collection("messages");