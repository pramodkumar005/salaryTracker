/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import {Actions} from 'react-native-router-flux';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var errorMsg = '';

type Props = {};
export default class Login extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { 
      text: 'Useless Placeholder',
      username:'',
      password:'',
      loader:false
    };

  }

  componentWillMount(){
    //AsyncStorage.removeItem('@MyLogin:key');
   AsyncStorage.getItem('@MyLogin:key', (err, result) => {
      console.log('Result>>>>>>>>>>>>>>>'+result);
      if (result==null) {
        console.log('Render login');
      }else{
        Actions.dashboard();
      }
    })
  }

  showAlert(){
     showMessage({
              message: errorMsg,
              type: "info",
            });
  }

  validate(){
    if (this.state.username=='') {
      errorMsg='Username cannot be empty';
      this.showAlert();
    }else if (this.state.password==''){
       errorMsg='Password cannot be empty';
      this.showAlert();
    }else{
      this.Login();
    }
  }

  Login(){
    // var days =  Math.floor(( Date.parse(this.state.leaveto) - Date.parse(this.state.leavefrom) ) / 86400000);
    console.log('login>>>>>>>'+this.state.username+':::'+this.state.password);

    this.setState({
      loader: true
    },()=>{
      // console.log('datasending:'+'empid:'+this.state.empid+':::'+'empname:' +'this.state.empname'+':::'+'leavefrom:'+this.state.leavefrom+':::'+'leaveid:'+ this.state.leaveid+':::'+'leaveto:'+ this.state.leaveto+':::'+'noofdays:'+ this.state.noofdays);
    fetch('http://pinakininfo.co.in/Turipati/Admin/data/backendService.php?action=validateUser',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user:{
            email: this.state.username,
            password: this.state.password
            }
          }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson>>>>>.'+JSON.stringify(responseJson.responsecode));
        if (responseJson.responsecode=='200') {
            //AsyncStorage.setItem('@MyLogin:key','true');
            console.log('Added successfully');
            Actions.dashboard();
        }else{
           console.log('Invalid username or password');
           errorMsg='Invalid username or password';
           this.showAlert();
           this.setState({
            loader:false
           })
        }
        
      })
      .catch((error) =>{
        console.log(error);
        errorMsg='No Network..';
        this.showAlert();
        this.setState({
            loader:false
           })
      });
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image}
          source={require('../assets/login2.png')} />
        <TextInput
        style={[styles.textInput,{marginTop:20}]}
        onChangeText={(text) => this.setState({username: text})}
        value={this.state.username}
        placeholder='Username'
        />
        <TextInput
        style={styles.textInput}
        onChangeText={(text) => this.setState({password: text})}
        value={this.state.password}
        placeholder='Password'
        secureTextEntry={true}
        />
        {(this.state.loader==false)?
        <TouchableOpacity style={styles.button} onPress={()=>{this.validate()}}>
          <Text style={{color:'white', fontSize:16}}>Login</Text>
        </TouchableOpacity>
        :
        <View style={styles.buttonDisabled}>
          <Text style={{color:'white', fontSize:16}}>Logging in....</Text>
        </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderColor:'#39a4ce',
    borderRadius: 50,
    marginBottom: 15,
    paddingLeft: 15,
    height:50,
    alignItems:'center'
  },
  image: {
    width:'100%',
    height:'55%'
  },
  button: {
    width: '80%',
    backgroundColor: '#39a4ce',
    borderRadius: 50,
    marginBottom: 5,
    paddingLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height:50
  },
   buttonDisabled: {
    width: '80%',
    backgroundColor: '#70cbef',
    borderRadius: 50,
    marginBottom: 5,
    paddingLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height:50
  }
});
