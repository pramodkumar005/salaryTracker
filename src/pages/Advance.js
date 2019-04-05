/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform,NetInfo ,StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, Dimensions, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import {Actions} from 'react-native-router-flux';
import { showMessage, hideMessage } from "react-native-flash-message";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const deviceW = Dimensions.get('window').width

const basePx = 375

function px2dp(px) {
  return px *  deviceW / basePx
}

var errorMsg = '';

type Props = {};
export default class Advance extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { 
      listData: '',
      text: 'Advance Amount',
      date:"2016-05-15",
      advdate: '',
      advid: '',
      amount: '',
      empid: this.props.item.empid,
      empname: this.props.item.empname,
    };
  }

  componentDidMount(){
    console.log('Props>>>>>>>>'+JSON.stringify(this.props.item))
  }

  postAdvance(){
    Keyboard.dismiss();
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected == true) {
        fetch('http://pinakininfo.co.in/Turipati/Admin/data/backendService.php?action=saveUpdateEmployeeAdvanceData',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
             advid: '',
             amount: this.state.amount,
             empid: this.props.item.empid,
             empname: this.props.item.empname,
             advdate: this.state.advdate
        })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.responsecode=='200') {
            console.log('Added successfully');
            Actions.dashboard();
        }else{
          errorMsg='Unable to add data';
        this.showAlert();
           console.log('Not able to Add');
        }

      })
      .catch((error) =>{
        errorMsg='No Network';
        this.showAlert();
        //console.error(error);
      });
      }else{
        errorMsg='No Network';
          this.showAlert();
      }
    })
  }

  dashboard(){
    Actions.pop();
  }

  showAlert(){
     showMessage({
              message: errorMsg,
              type: "info",
            });
  }

  validate(){
    if (this.state.advdate=='') {
        errorMsg='Date cannot be blank';
        this.showAlert();
    } else if(this.state.amount==''){
        errorMsg='Amount cannot be blank';
        this.showAlert();
    }else{
      this.postAdvance();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height:40, backgroundColor:'#39a4ce', width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableOpacity style={{paddingLeft:10, paddingRight:20}} onPress={()=>{this.dashboard()}}>
            <Icon name="chevron-left" size={px2dp(20)} style={{color:'white'}}/>
          </TouchableOpacity>
          <View>
            <Text style={{color:'white'}}>ADVANCE</Text>
          </View>
          <View>
            <Icon name="chevron-left" size={px2dp(20)} style={{color:'#39a4ce'}}/>
          </View>
        </View>
        <View style={{width:'100%', alignItems:'center'}}>
          <View style={{width:'90%', marginTop:10, marginBottom:10}}>
            <Text style={{fontSize:20, color:'#39a4ce'}}>{this.props.item.empname}</Text>
          </View>
          <DatePicker
            style={{width: '90%', borderRadius:50, borderColor:'#39a4ce', borderWidth:1}}
            date={this.state.advdate}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2019-01-01"
            maxDate="2100-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={(date) => {this.setState({advdate: date})}}
          />
          <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({amount: text})}
          value={this.state.amount}
          placeholder='Amount'
          keyboardType='numeric'
          />
        </View>
         <TouchableOpacity style={styles.button} onPress={()=>{this.validate()}}>
          <Text style={{color:'white', fontSize:16}}>Save</Text>
        </TouchableOpacity>
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
    width: '90%',
    borderWidth: 1,
    borderColor:'#39a4ce',
    borderRadius: 50,
    marginBottom: 15,
    paddingLeft: 15,
    height:50,
    alignItems:'center',
    marginTop:10
  },
  image: {
    width:'100%',
    height:'55%'
  },
  button: {
    width: '90%',
    backgroundColor: '#39a4ce',
    borderRadius: 50,
    marginBottom: 5,
    paddingLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height:50
  },
  actionButton: {paddingLeft:15, paddingRight:15, borderWidth:1, borderColor:'grey', paddingTop:5, paddingBottom:5, borderRadius:50}
});
