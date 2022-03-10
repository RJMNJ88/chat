import React from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default class Chat extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        name: '',
        messages: []
      };
  }
  
  componentDidMount() {

    let { name } = this.props.route.params;

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
              _id: 1,
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