/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, Dimensions, RefreshControl, NetInfo, AsyncStorage, BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import { filter, indexOf, invert, findKey } from 'lodash';
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
export default class Login extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { 
      listData: '',
      text: 'Search',
      refreshing:false
    };
  }

  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    // AsyncStorage.getItem('@MyLogin:key', (err, result) => {
    //   console.log('Result>>>>>>>>>>>>>>>'+result);
    //   if (result==null) {
    //     Actions.login();
    //   }else{
            console.log('componentWillMount >>>>>>>>>>>>');
            NetInfo.isConnected.fetch().then(isConnected => {
                  this.setState({
                    connected: isConnected
                  },()=>{console.log('Network Status>>>'+this.state.connected)})
                });

            AsyncStorage.getItem('@MyEmployee:key', (err, result) => {
              console.log('Result>>>>>>>>>>>>>>>'+result);
              if (result==null) {
                console.log('Employee data is null>>>> '+result);
                this.fetchEmployee();
              }else{
                console.log('Employee data is not null>>>>');
                if(this.state.connected==true){
                    this.fetchEmployee();
                }else{
                  this.setState({
                  listData: JSON.parse(result),
                  rawData: JSON.parse(result)
                  })
                }
              }
            });
    //   }
    // });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return false;
  }

  advance(item){
    Actions.advance({item:item});
  }

  leave(item){
    Actions.leave({item:item});
  }

  edit(item){
    Actions.edit({item:item});
  }

  info(item){
    Actions.info({item:item});
  }

  add(){
    Actions.add();
  }

  showAlert(){
     showMessage({
              message: errorMsg,
              type: "info",
            });
  }

  fetchEmployee(){
    NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected == true) {
         console.log('In fetch>>>>>>>>>>>>>>>>>>>>>>');
        this.setState({
          refreshing: true
        },()=>{
        fetch('http://pinakininfo.co.in/Turipati/Admin/data/backendService.php?action=getAllEmployees')
          .then((response) => response.json())
          .then((responseJson) => {

            console.log('responseJson>>>>>.'+JSON.stringify(responseJson.salaryArray));
             AsyncStorage.setItem('@MyEmployee:key', JSON.stringify(responseJson.salaryArray));

            if (responseJson.responsecode=='200') {
                console.log('Added successfully...');
                this.setState({
                  listData: responseJson.salaryArray,
                  rawData: responseJson.salaryArray,
                  refreshing: false
                  })
                
            }else{
               console.log('Unable to get employee list');
               errorMsg='Unable to get employee list';
               this.showAlert();
                this.setState({
                  refreshing: false
                  })
            }
          })
          .catch((error) =>{
            errorMsg='Unable to get data';
            this.showAlert();
            this.setState({
              refreshing: false
              })
          });
        } )
        }else {
          console.log('In else statement');
          errorMsg='No Network';
          this.showAlert();
          this.setState({
                refreshing: false
          })
        }
  })
}

  deleteEmployee(item){
     NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected == true) {
        fetch('http://pinakininfo.co.in/Turipati/Admin/data/backendService.php?action=deleteEmployee&empid='+item.empid,{
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.responsecode=='200') {
            console.log('user deleted successfully');
            errorMsg='Deleted successfully';
            this.showAlert();
            Actions.dashboard();
        }else{
          errorMsg='Unable to delete user';
          this.showAlert();
           console.log('Unable to delete user');
        }
      })
      .catch((error) =>{
        //console.error(error);
         errorMsg='Unable to delete';
          this.showAlert();
      });

      }else{
        console.log('In else statement');
          errorMsg='No Network';
          this.showAlert();
      }
    })
  }

  setSearchText(event) {
     let searchText = event.nativeEvent.text;
     this.setState({searchText:searchText});
     data = this.state.rawData;
     let filteredData = this.filterNotes(searchText, data);
     //const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

     this.setState({
       listData: filteredData,
       rawData: data,
     });
    }

filterNotes(searchText, notes) {
      let text = searchText.toLowerCase();
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>notes::'+notes);
      return filter(notes,(n) => {
         console.log(":::::"+n.empname);
        let note = n.empname.toLowerCase();
        console.log(note);
        return note.search(text) !== -1;
      });
    }


_onRefresh = () => {
    this.fetchEmployee();
  }


 _keyExtractor = (item, index) => item.empid;


  _renderItem = ({item}) => (
   <View>
      <View style={{justifyContent:'space-between'}}>
      <View style={{}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Icon name="user-circle" size={px2dp(16)}/>
          <Text style={{color:'#39a4ce', fontSize:20, paddingLeft:5}}>{item.empname}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text>Join on: </Text>
          <Text>{item.doj}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text>Mobile No.: </Text>
          <Text>{item.mobileno}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text>Salary: </Text>
          <Text>{item.salary}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text>Working days: </Text>
          <Text>{item.noofdaysworked}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text>Leave: </Text>
          <Text>{item.leavestaken}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text>Advance: </Text>
          <Text>{item.advancetaken}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text>Salary Cycle: </Text>
          <Text>{item.monthst} - {item.monthend}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text>To be paid: </Text>
          <Text style={{color:'#39a4ce'}}>{item.totsalary}</Text>
        </View>
      </View>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:10}}>
        <TouchableOpacity style={styles.actionButton} onPress={()=>{this.advance(item)}}>
          <Icon name="money" size={px2dp(20)}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={()=>{this.leave(item)}}>
          <Icon name="ticket" size={px2dp(20)}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={()=>{this.info(item)}}>
          <Icon name="info-circle" size={px2dp(20)}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={()=>{this.edit(item)}}>
          <Icon name="edit" size={px2dp(20)}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={()=>{this.deleteEmployee(item)}}>
          <Icon name="trash" size={px2dp(20)}/>
        </TouchableOpacity>
      </View>
    </View>
    <View style={{height:1, backgroundColor:'grey', marginTop:10, marginBottom:5}}/>
   </View>
  );

  render() {
    return (
      <View style={styles.container}>
      <View style={{flexDirection:'row', alignItems:'center', width:'90%'}}>
        <View style={{width:'75%'}}>
        <TextInput
          style={styles.textInput}
          onChange={this.setSearchText.bind(this)}
          value={this.state.searchText}
          placeholder="Search employee"
          />
        </View>
          <TouchableOpacity style={{backgroundColor:'#39a4ce', height:50, paddingLeft:10, paddingRight:10, justifyContent:'center', width:'20%', marginLeft:'5%', borderRadius:50}} onPress={()=>{this.add()}}>
            <Text style={{color:'white'}}>+ Add</Text>
          </TouchableOpacity>
        </View>
       <FlatList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
       showsVerticalScrollIndicator={false}
        data={this.state.listData}
        style={{width:'90%'}}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        />
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
    width: '100%',
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
    width: '80%',
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
