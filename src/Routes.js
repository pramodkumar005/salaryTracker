import React, { Component } from 'react';
import {Actions,Router,Stack,Scene} from 'react-native-router-flux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Advance from './pages/Advance';
import Leave from './pages/Leave';
import Edit from './pages/Edit';
import Info from './pages/Info';
import Add from './pages/Add';
export default class Routes extends Component<{}> {
	onBackPress = () => {
    if (Actions.state.index === 0) {
      return false
    }
    Actions.pop()
    return true
}
	render(){
		return(
		  <Router backAndroidHandler={this.onBackPress}>
		    <Stack key="root" hideNavBar={true}>
		      <Scene key="login" component={Login} title="Login" initial={true}/>
		      <Scene key="dashboard" component={Dashboard} title="Dashboard" />
		      <Scene key="advance" component={Advance} title="Advance" />
		      <Scene key="leave" component={Leave} title="Leave" />
		      <Scene key="edit" component={Edit} title="Edit" />
		      <Scene key="info" component={Info} title="Info" />
		      <Scene key="add" component={Add} title="Add" />
		    </Stack>
		  </Router>
		)
	}

}