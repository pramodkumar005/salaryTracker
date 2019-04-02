/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, Dimensions,  Keyboard} from 'react-native';
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
export default class Add extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { 
      doj: '',
      empid: '',
      empname: '',
      mobileno: '',
      monthend: '',
      monthst: '',
      salary: ''
    };
  }

  componentDidMount(){
    console.log('Props>>>>>>>>'+JSON.stringify(this.props.item));
    var dt = new Date();
         dt.setMonth( dt.getMonth() + 2 );
         console.log(dt);
  }


  addUser(){
     Keyboard.dismiss();
    // var days =  Math.floor(( Date.parse(this.state.leaveto) - Date.parse(this.state.leavefrom) ) / 86400000);

    this.setState({
      // noofdays: days
    },()=>{
      // console.log('datasending:'+'empid:'+this.state.empid+':::'+'empname:' +'this.state.empname'+':::'+'leavefrom:'+this.state.leavefrom+':::'+'leaveid:'+ this.state.leaveid+':::'+'leaveto:'+ this.state.leaveto+':::'+'noofdays:'+ this.state.noofdays);
    fetch('http://pinakininfo.co.in/Turipati/Admin/data/backendService.php?action=saveUpdateEmployeeData',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            doj: this.state.doj,
            empid: this.state.empid,
            empname: this.state.empname,
            mobileno: this.state.mobileno,
            monthend: this.state.monthend,
            monthst: this.state.monthst,
            salary: this.state.salary
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

  dashboard(){
    Actions.pop();
  }

  newEndDate(){
        var dt = new Date(this.state.monthst);
        dt.setMonth( dt.getMonth() + 2 );
        console.log(dt);
        var monthendDate = dt.getFullYear()+ '-' + dt.getMonth() + '-' + dt.getDate();
        console.log(monthendDate);
        this.setState({
          monthend:monthendDate
        })
  }

  validate(){
    if (this.state.empname=='') {
        errorMsg='Usename cannot be empty';
        this.showAlert();
    } else if (this.state.doj=='') {
      errorMsg='Date of joining cannot be empty';
      this.showAlert();
    } else if (this.state.monthst=='') {
      errorMsg='Salary cycle annot be empty';
      this.showAlert();
    } else if (this.state.salary=='') {
      errorMsg='Salary cannot be empty';
      this.showAlert();
    } else {
      this.addUser();
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
            <Text style={{color:'white'}}>ADD</Text>
          </View>
          <View>
            <Icon name="chevron-left" size={px2dp(20)} style={{color:'#39a4ce'}}/>
          </View>
        </View>
        <View style={{width:'100%', alignItems:'center'}}>
          <View style={{width:'90%', padding:5, marginTop:10}}>
            <Text>Employee name</Text>
          </View>
          <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({empname: text})}
          placeholder='Employee name'
          value={this.state.empname}
          />
          <DatePicker
            style={{width: '90%', borderRadius:50, borderColor:'#39a4ce', borderWidth:1}}
            date={this.state.doj}
            mode="date"
            placeholder="Date of joining"
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
            onDateChange={(date) => {this.setState({doj: date})}}
          />
           <View style={{width:'90%', padding:5, marginTop:10}}>
            <Text>Salary cycle</Text>
          </View>
          <DatePicker
            style={{width: '90%', borderRadius:50, borderColor:'#39a4ce', borderWidth:1, marginTop:0}}
            date={this.state.monthst}
            mode="date"
            placeholder="Salary cycle"
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
            onDateChange={(date) => {
               this.setState({
                monthst: date
              },()=>{this.newEndDate()})
            }}
          />
          
          <View style={{width:'90%', padding:5, marginTop:10}}>
            <Text>Salary</Text>
          </View>
          <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({salary: text})}
          value={this.state.salary}
          placeholder='Salary'
          keyboardType='numeric'
          />
          <View style={{width:'90%', padding:5, marginTop:5}}>
            <Text>Mobile No.</Text>
          </View>
          <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({mobileno: text})}
          value={this.state.mobileno}
          placeholder='Mobile number'
          keyboardType='numeric'
          />
        </View>
         <TouchableOpacity style={styles.button} onPress={()=>{this.validate()}}>
          <Text style={{color:'white', fontSize:16}}>SAVE</Text>
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
    marginTop:0
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
