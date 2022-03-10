import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView, ImageBackground, Image, TouchableOpacity } from 'react-native';
import background from '../assets/background.png';
import icon2 from '../assets/icon2.svg';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          name: '',
          bgColor: this.colors.option1 
        };
    }

    colors = {
      option1: '#090C08',
      option2: '#474056',
      option3: '#8A95A5',
      option4: '#B9C6AE'
    }

    changeColor = (newColor) => {
      this.setState({ bgColor: newColor});
    }

    render() {
      return (
        <View style={{ display: 'flex', flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <ImageBackground source={background} style={{ height: '100%', width: '100%' }} resizeMode='cover'>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>ChatApp</Text>
            </View>

            <View style={styles.mainContainer}>
              <View style={styles.inputContainer}>
                {/* <Image source={icon2} style={styles.icon} /> */}
                <TextInput 
                  style={styles.inputBox}
                  onChangeText={(name) => this.setState({ name })}
                  value={this.state.name}
                  placeholder='Enter your name ...'
                />
              </View>
              <View style={styles.colorContainer}>
                <Text style={styles.colorText}>Choose a Background Color:</Text>
                <View style={styles.colorSelectors}>
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="black"
                    accessibilityHint="Choose black for your chat background color."
                    accessibilityRole="button" 
                    style={styles.color1}
                    onPress={() => this.changeColor(this.colors.option1)}
                  />
                  <TouchableOpacity 
                    accessible={true}
                    accessibilityLabel="purple"
                    accessibilityHint="Choose purple for your chat background color."
                    accessibilityRole="button"
                    style={styles.color2}
                    onPress={() => this.changeColor(this.colors.option2)}
                  />
                  <TouchableOpacity 
                    accessible={true}
                    accessibilityLabel="grey"
                    accessibilityHint="Choose grey for your chat background color."
                    accessibilityRole="button"
                    style={styles.color3}
                    onPress={() => this.changeColor(this.colors.option3)}
                  />
                  <TouchableOpacity 
                    accessible={true}
                    accessibilityLabel="green"
                    accessibilityHint="Choose green for your chat background color."
                    accessibilityRole="button"
                    style={styles.color4}
                    onPress={() => this.changeColor(this.colors.option4)}
                  />
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.chatButton}
                  title="Enter Chat"
                  onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, bgColor: this.state.bgColor })}
                />
              </View>
            </View>

          </ImageBackground>
        </View>
      )
    }
  }


  const styles = StyleSheet.create({
  titleContainer: {
    marginRight: 'auto',
    marginTop: 'auto',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    marginTop: 40
  },
  titleText: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  mainContainer: {
    backgroundColor: '#FFFFFF',
    width: '88%',
    height: '44%',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 15,
    borderRadius: 4
  },
  inputContainer: {
    // display: 'flex',
    // flexDirection: 'row',
    paddingLeft: 2,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 4,
    width: '88%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  inputBox: {
    height: 40,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: .5,
    // marginLeft: 'auto',
    marginRight: 'auto',
    // focus: {
    //   border: 'none'
    // }
  },
  // icon: {
  //   height: 20,
  //   width: 20,
  //   // position: 'absolute',
  //   top: '50%',
  //   // transform: 'translateY(-50%)',
  //   marginLeft: 80,
  //   color: 'black'
  // },
  colorContainer: {
    width: '88%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color:  '#757083',
    opacity: 1
  },
  colorSelectors: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20
  },
  buttonContainer: {
    width: '88%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 40
  },
  chatButton: {
    display: 'flex',
    width: '88%',
    height: '100%',
    backgroundColor: '#685563',
    fontSize: 16,
    padding: 4
  },
  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
})
