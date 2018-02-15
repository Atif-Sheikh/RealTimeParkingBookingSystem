import React, { Component } from 'react';
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import AllFeedbacks from './allFeedbacks';
import AddLocation from './addLocation';
import AllUsers from './allUsers';
import AllBookings from './bookings';

class adminHome extends Component {
    constructor(){
    super();
        this.state = {
            name: '',
            email: '',
            uid: '',
            open: false,
            bookParking: false,
            viewBooking: false,
            feedback: false,
            addLocation: false,
            accountType: '',
        };
    };
    logout = () => {
        firebase.auth().signOut()
            .then(()=>{
                this.props.history.push('/');
            })
            .catch((e)=>{
                console.log(e);
            });
    };
    handleToggle = () => {
        this.setState({open: !this.state.open});
    };
    handleClose = () => {
    this.setState({open: false});
    };
    componentDidMount(){
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                firebase.database().ref(`/users/${user.uid}`).on('value', snap => {
                    // console.log(snap.val()['accountType']);
                    let accountType = snap.val()['accountType'];
                    let name = snap.val()['name'];
                    let email = snap.val()['email'];
                    let uid = snap.val()['uid'];                    
                    this.setState({ name, email, uid, accountType });
                });
            }
        });
    };
    render(){ 
        return(
            <div>
                <AppBar
                    title={<span style={styles.title}>{ this.state.name }</span>}
                    onLeftIconButtonClick={this.handleToggle}
                    iconElementRight={<FlatButton onClick={this.logout} label="LogOut" />}
                >
                    <span style={styles.heading}>Online Parking System</span>
                </AppBar>
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <MenuItem onClick={()=> this.setState({bookParking: false, viewBooking: false, feedback: false, addLocation: true})}>
                        Add Location
                    </MenuItem>                    
                    <MenuItem onClick={()=> this.setState({bookParking: true, viewBooking: false, feedback: false, addLocation: false})}>
                        View Bookings
                    </MenuItem>
                    <MenuItem onClick={()=> this.setState({bookParking: false, viewBooking: true, feedback: false, addLocation: false})}>
                        Users
                    </MenuItem>
                    <MenuItem onClick={()=> this.setState({bookParking: false, viewBooking: false, feedback: true, addLocation: false})}>
                        Feedbacks
                    </MenuItem>                
                </Drawer>
                <div>
                    {
                        this.state.addLocation ? <div>
                            <AddLocation />
                        </div> : ''
                    }{
                        this.state.bookParking ? <div>
                            <AllBookings accountType={this.state.accountType} />
                        </div> : ''
                    }{
                        this.state.viewBooking ? <div>
                            <AllUsers />                    
                        </div> : ''
                    }
                    {
                        this.state.feedback ? <div>
                            <AllFeedbacks />
                        </div> : ''
                    }
                </div>
            </div>
        );
    };
};
const styles = {
    title: {
      cursor: 'pointer',
      float: 'left',
    },
    heading: {
        position: 'absolute', 
        marginLeft: '35%', 
        marginTop: '20px',
        fontSize: '25px',
    },
};
export default adminHome;