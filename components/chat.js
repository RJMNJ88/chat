import React from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
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
        }
      };

      if (!firebase.apps.length){
        firebase.initializeApp(firebaseConfig);
      }

      this.referenceChatMessages = firebase.firestore().collection("messages");
      this.refMsgsUser = null;
  }
  
  componentDidMount() {

    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)

    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text:  `${name} has entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    })

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any',
        }
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
      messages,
    });
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
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
        this.saveMessages();
        this.addMessage();
      }
    )
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
    )
  }

  render() {
    let name = this.props.route.params.name; 
    this.props.navigation.setOptions({ title: name });

    const { bgColor } = this.props.route.params;

    return (
      <View style={{backgroundColor: bgColor, flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.welcomeFont}>Welcome to the Chat !</Text>
        {/* <Button
            title='Go to Start'
            onPress={() => this.props.navigation.navigate('Start')}
        /> */} 
        <View style= {{flex: 1, width: '100%'}}>
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