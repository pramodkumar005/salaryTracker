/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
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

var errorMsg = '';

function px2dp(px) {
  return px *  deviceW / basePx
}

type Props = {};
export default class Advance extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { 
      listData: '',
      text: 'Advance Amount',
      empid: this.props.item.empid,
      empname: this.props.item.empname,
      leavefrom: '',
      leaveid: '',
      leaveto: '',
      noofdays: '',
    };
  }

  componentDidMount(){
    console.log('Props>>>>>>>>'+JSON.stringify(this.props.item))
  }


  saveLeave(){
    var days =  Math.floor(( Date.parse(this.state.leaveto) - Date.parse(this.state.leavefrom) ) / 86400000);
    this.setState({
      noofdays: days
    },()=>{
      console.log('datasending:'+'empid:'+this.state.empid+':::'+'empname:' +'this.state.empname'+':::'+'leavefrom:'+this.state.leavefrom+':::'+'leaveid:'+ this.state.leaveid+':::'+'leaveto:'+ this.state.leaveto+':::'+'noofdays:'+ this.state.noofdays);
    fetch('http://pinakininfo.co.in/Turipati/Admin/data/backendService.php?action=saveUpdateEmployeeLeaveData',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            empid: this.state.empid,
            empname: this.state.empname,
            leavefrom: this.state.leavefrom,
            leaveid: this.state.leaveid,
            leaveto: this.state.leaveto,
            noofdays: this.state.noofdays,
            }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson>>>>>.'+JSON.stringify(responseJson.responsecode));
        if (responseJson.responsecode=='200') {
            console.log('Added successfully');
            Actions.dashboard();
        }else{
           console.log('Not able to Add');
            errorMsg='Unable to add data';
            this.showAlert();
        }
        
      })
      .catch((error) =>{
         errorMsg='No Network';
        this.showAlert();
        //console.error(error);
      });
    })
  }

 showAlert(){
     showMessage({
              message: errorMsg,
              type: "info",
            });
  }

  dashboard(item){
    Actions.pop();
  }

  validate(){
    if (this.state.leavefrom=='') {
        errorMsg='Leave from date cannot be empty';
        this.showAlert();
    }else if(this.state.leavefrom==''){
        errorMsg='Leave to date cannot be empty';
        this.showAlert();
    } else {
      this.saveLeave();
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
            <Text style={{color:'white'}}>LEAVE</Text>
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
            date={this.state.leavefrom}
            mode="date"
            placeholder="Leave from"
            format="YYYY-MM-DD"
            minDate="2019-03-01"
            maxDate="2100-03-01"
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
            onDateChange={(date) => {this.setState({leavefrom: date})}}
          />
          <DatePicker
            style={{width: '90%', borderRadius:50, borderColor:'#39a4ce', borderWidth:1, marginTop:20}}
            date={this.state.leaveto}
            mode="date"
            placeholder="Leave to"
            format="YYYY-MM-DD"
            minDate="2019-03-01"
            maxDate="2100-03-01"
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
            onDateChange={(date) => {this.setState({leaveto: date})}}
          />
        </View>
         <TouchableOpacity style={styles.button} onPress={()=>{this.validate()}}>
          <Text style={{color:'white', fontSize:16}}>ADD LEAVE</Text>
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
    height:50,
    marginTop:25
  },
  actionButton: {paddingLeft:15, paddingRight:15, borderWidth:1, borderColor:'grey', paddingTop:5, paddingBottom:5, borderRadius:50}
});
