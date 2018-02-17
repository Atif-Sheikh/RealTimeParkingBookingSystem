import React, { Component } from 'react';
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import Location from './locations';
import Feedback from './feedback';
import Bookings from './bookings';

class Home extends Component {
    constructor(){
    super();
        this.state = {
            name: '',
            email: '',
            uid: '',
            open: false,
            bookParking: true,
            viewBooking: false,
            feedback: false,
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
                    // console.log(snap.val());
                    let name = snap.val()['name'];
                    let email = snap.val()['email'];
                    let uid = snap.val()['uid'];                    
                    this.setState({ name, email, uid });
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
                    <MenuItem onClick={()=> this.setState({open: false, bookParking: true, viewBooking: false, feedback: false})}>Book Parking</MenuItem>
                    <MenuItem onClick={()=> this.setState({open: false, bookParking: false, viewBooking: true, feedback: false})}>View Bookings</MenuItem>
                    <MenuItem onClick={()=> this.setState({open: false, bookParking: false, viewBooking: false, feedback: true})}>Feedback</MenuItem>                
                </Drawer>
                <div>
                    {
                        this.state.bookParking ? <div>
                            <Location />
                        </div> : ''
                    }{
                        this.state.viewBooking ? <div>
                            <Bookings />                    
                        </div> : ''
                    }
                    {
                        this.state.feedback ? <div>
                            <Feedback UID={this.state.uid} name={this.state.name} />
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
export default Home;