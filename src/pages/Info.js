/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Share, Platform, ScrollView, ActivityIndicator, NetInfo, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import {Actions} from 'react-native-router-flux';
import { showMessage, hideMessage } from "react-native-flash-message";
import Picker from 'react-native-picker';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var errorMsg = '';

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
      leaveRecords : '',
      advanceRecords: '',
      rawData:'',
      currentMonthName:'',
      year:'',
      loader:false
    };
  }

  componentWillMount(){

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var m_names = ['January', 'February', 'March', 
               'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 'November', 'December'];
    this.setState({
      currentYear: year,
      currentMonth:month-1,
      currentMonthName: m_names[date.getMonth()-1]
    },()=>{this.salarySlip()});
    
  }

  componentDidMount(){
    console.log('Props>>>>>>>>'+JSON.stringify(this.props.item));
    
  }

  showAlert(){
     showMessage({
              message: errorMsg,
              type: "info",
            });
  }

  salarySlip(){
    NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected == true) {
          this.setState({
            loader:true
          })
            console.log(this.state.currentMonthName +':::::'+this.state.currentYear+':::::'+this.props.item.empid);

          fetch('http://pinakininfo.co.in/Turipati/Admin/data/backendService.php?action=generateSalary&month='+this.state.currentMonth+'&year='+this.state.currentYear+'&empid='+this.props.item.empid,{
            method: 'GET'
          })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log('responseJson>>>>>.'+JSON.stringify(responseJson.leaveRecords));
              console.log('responseJson>>>>>.'+JSON.stringify(responseJson.advanceRecords));
              if (responseJson.message!=='Salary Slip not generated for the Month') {
                  console.log('Added successfully');
                  this.setState({
                    rawData: responseJson,
                    leaveRecords : responseJson.leaveRecords,
                    advanceRecords: responseJson.advanceRecords,
                    loader:false
                  })
                  
              }else{
                 console.log('Not able to Add');
                  errorMsg=responseJson.message;
                 this.showAlert();
                  this.setState({
                    loader:false
                  })
              }
              
            })
            .catch((error) =>{
              console.error(error);
            });
        }else {
           this.setState({
                    loader:false
                  })
          errorMsg='No Network';
          this.showAlert();
        }
    })
  }

  dashboard(){
    Actions.pop();
  }

  onShare = async () => {
    var shareText = 'Name: '+ this.props.item.empname + 'Leaves taken: '+ this.state.rawData.leavestaken + 'Working Days: '+ this.state.rawData.noofdaysworked + 'Advance Taken: '+ this.state.rawData.advancetaken + 'Total Salary: '+ this.state.rawData.totsalary
    try {
      const result = await Share.share({
        message:
          shareText,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  filter(){
    let dataSet = [['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ["2019", "2020","2021"] ];
    var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

      var defaultMonth= this.state.currentMonthName;

      Picker.init({
          pickerData: dataSet,
          pickerTitleText: " ",
          pickerConfirmBtnText: "DONE",
          pickerCancelBtnText: "CANCEL",
          selectedValue: [defaultMonth],
          onPickerConfirm: data => {

          },
          onPickerCancel: data => {
              console.log(data);
          },
          onPickerSelect: data => {
              console.log(data[0]);
              console.log(monthList.indexOf((data[0])));

              switch(data[0]) {
                case "January":
                  this.setState({
                    currentMonth: 1,
                    currentMonthName:'January'
                  })
                  break;
                case "February":
                  this.setState({
                    currentMonth: 2,
                    currentMonthName:'February'
                  })
                  break;
                case "March":
                  this.setState({
                    currentMonth: 3,
                    currentMonthName:'March'
                  })
                  break;
                  case "April":
                  this.setState({
                    currentMonth: 4,
                    currentMonthName:'April'
                  })
                  break;
                  case "May":
                  this.setState({
                    currentMonth: 5,
                    currentMonthName:'May'
                  })
                  break;
                  case "June":
                  this.setState({
                    currentMonth: 6,
                    currentMonthName:'June'
                  })
                  break;
                  case "July":
                  this.setState({
                    currentMonth: 7,
                    currentMonthName:'July'
                  })
                  break;
                  case "August":
                  this.setState({
                    currentMonth: 8,
                    currentMonthName:'August'
                  })
                  break;
                  case "September":
                  this.setState({
                    currentMonth: 9,
                    currentMonthName:'September'
                  })
                  break;
                  case "October":
                  this.setState({
                    currentMonth: 10,
                    currentMonthName:'October'
                  })
                  break;
                   case "November":
                  this.setState({
                    currentMonth: 11,
                    currentMonthName:'November'
                  })
                  break;
                   case "December":
                  this.setState({
                    currentMonth: 12,
                    currentMonthName:'December'
                  })
                  break;
                default:
                  this.setState({
                    currentMonth: 1,
                    currentMonthName:'January'
                  })
              }

              this.setState({
                currentYear: data[1]
              }, console.log('>>>>>>>>>>>>>>'+this.state.currentMonth))
          }
      });
      Picker.show();
  }

  _renderItem = ({item}) => (
    <View style={{width:'100%'}}>
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

_keyExtractor = (item, index) => item.leaveid;

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
_keyExtractorAdvance = (item, index) => item.advid;

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
          <TouchableOpacity onPress={()=>{this.onShare()}}>
            <Icon name="share-alt" size={px2dp(20)} style={{color:'white', paddingRight:15}}/>
          </TouchableOpacity>
        </View>
        {(this.state.loader==false)? null :
        <ActivityIndicator size="large" color="#39a4ce" style={{position:'absolute', left:0, right:0, top:0, bottom:0}}/>
        }
        
        <ScrollView style={{width:'100%', flexGrow:1, paddingLeft:'5%', paddingBottom:15}}>
          <View style={{width:'90%', marginTop:10, marginBottom:10, flexDirection:'row', alignItems:'space-between', justifyContent:'space-between'}}>
            <View style={{}}>
              <Text style={{fontSize:20, color:'#39a4ce'}}>{this.props.item.empname}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity style={{justifyContent:'center', backgroundColor:'white', alignItems:'center'}} onPress={()=>{this.filter()}}>
                <View style={{height:25, width:110, justifyContent:'center', alignItems:'center', flexDirection:'row' }}>
                <Text style={{paddingLeft:5, color:'#39a4ce'}}>{this.state.currentMonthName}, {this.state.currentYear}</Text>
                <Icon name="arrow-down" size={px2dp(12)} style={{paddingLeft:5, color:'#39a4ce', paddingRight:3}}/>
                </View>
              </TouchableOpacity>
              <Icon name="file-text-o" size={px2dp(24)} onPress={()=>{this.salarySlip()}} style={{paddingLeft:15, color:'#39a4ce'}}/>
            </View>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Salary: {this.state.rawData.salary}</Text>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>No. of days worked: {this.state.rawData.noofdaysworked}</Text>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Leaves Taken: {this.state.rawData.leavestaken}</Text>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Salary Cycle: {this.state.rawData.monthst} - {this.state.rawData.monthend}</Text>
          </View>
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Total Salary: {this.state.rawData.totsalary}</Text>
          </View>
          {(this.state.leaveRecords=='')?
            null:
            <View style={{width:'90%'}}>
              <View style={{width:'90%', paddingLeft:10,marginTop:5, height:30, backgroundColor:'#C9C7C7', justifyContent:'center'}}>
                <Text style={{color:'white'}}>Leave Details</Text>
              </View>
              <FlatList
              data={this.state.leaveRecords}
              style={{width:'90%', paddingLeft:10}}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              />
          </View>
          }
          <View style={{width:'90%', marginTop:5}}>
            <Text style={{}}>Advance Taken: {this.state.rawData.advancetaken}</Text>
          </View>
          {(this.state.advanceRecords=='')?
            null:
            <View style={{width:'90%'}}>
              <View style={{width:'90%', paddingLeft:10,marginTop:5, height:30, backgroundColor:'#C9C7C7', justifyContent:'center'}}>
                <Text style={{color:'white'}}>Advance Details</Text>
              </View>
              <FlatList
              data={this.state.advanceRecords}
              style={{width:'90%', paddingLeft:10}}
              extraData={this.state}
              keyExtractor={this._keyExtractorAdvance}
              renderItem={this._renderItemAdvance}
              />
          </View>
          }
          
        </ScrollView>
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
