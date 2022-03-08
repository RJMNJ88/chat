import React from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView } from 'react-native';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '' };
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