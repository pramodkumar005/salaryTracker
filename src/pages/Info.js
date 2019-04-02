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

type Props = {};
export default class Info extends Component<Props> {
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
        }
        
      })
      .catch((error) =>{
        console.error(error);
      });
    })
  }

  dashboard(){
    Actions.pop();
  }

  _renderItem = ({item}) => (
    <View>
      <View style={{flexDirection:'row'}}>
        <Text>Leave From: </Text>
        <Text>{item.leavefrom}</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <Text>Leave To: </Text>
        <Text>{item.leaveto}</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <Text>No. of days: </Text>
        <Text>{item.noofdays}</Text>
      </View>
      <View style={{height:1, backgroundColor:'#C9C7C7', width:'100%', marginTop:4, marginBottom:4}}/>
    </View>
    )

_keyExtractor = (item, index) => item.empid;

_renderItemAdvance = ({item}) => (
    <View style={{marginTop:5}}>
      <View style={{flexDirection:'row'}}>
        <Text>Advance Date: </Text>
        <Text>{item.advdate}</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <Text>Amount: </Text>
        <Text>{item.amount}</Text>
      </View>
      <View style={{height:1, backgroundColor:'#C9C7C7', width:'100%', marginTop:4, marginBottom:4}}/>
    </View>
    )
_keyExtractorAdvance = (item, index) => item.advdate;

  render() {
    return (
      <View style={styles.container}>
        <View style={{height:40, backgroundColor:'#39a4ce', width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <TouchableOpacity style={{paddingLeft:10, paddingRight:20}} onPress={()=>{this.dashboard()}}>
            <Icon name="chevron-left" size={px2dp(20)} style={{color:'white'}}/>
          </TouchableOpacity>
          <View>
            <Text style={{color:'white'}}>INFO</Text>
          </View>
          <View>
            <Icon name="chevron-left" size={px2dp(20)} style={{color:'#39a4ce'}}/>
          </View>
        </View>
        <View style={{width:'100%', alignItems:'center'}}>
          <View style={{width:'90%', marginTop:10, marginBottom:10}}>
            <Text style={{fontSize:20, color:'#39a4ce'}}>{this.props.item.empname}</Text>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Salary: {this.props.item.salary}</Text>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>No. of days worked: {this.props.item.noofdaysworked}</Text>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Leaves Taken: {this.props.item.leavestaken}</Text>
          </View>
          {(this.props.item.leavestaken==0)?
            null:
            <View style={{width:'90%'}}>
              <View style={{width:'90%', paddingLeft:10,marginTop:5, height:30, backgroundColor:'#C9C7C7', justifyContent:'center'}}>
                <Text style={{color:'white'}}>Leave Details</Text>
              </View>
              <FlatList
              data={this.props.item.empLeaveArray}
              style={{width:'90%', paddingLeft:10}}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              />
          </View>
          }
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Advance Taken: {this.props.item.advancetaken}</Text>
          </View>
          {(this.props.item.advancetaken==0)?
            null:
            <View style={{width:'90%'}}>
              <View style={{width:'90%', paddingLeft:10,marginTop:5, height:30, backgroundColor:'#C9C7C7', justifyContent:'center'}}>
                <Text style={{color:'white'}}>Advance Details</Text>
              </View>
              <FlatList
              data={this.props.item.empAdvanceArray}
              style={{width:'90%', paddingLeft:10}}
              extraData={this.state}
              keyExtractor={this._keyExtractorAdvance}
              renderItem={this._renderItemAdvance}
              />
          </View>
          }
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Debit: {this.props.item.debit}</Text>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{fontSize:16, color:'#39a4ce'}}>Salary to be Paid: {this.props.item.totsalary}</Text>
          </View>
        </View>
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
