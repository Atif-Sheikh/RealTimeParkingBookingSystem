import React, { Component } from 'react';
import '../App.css';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';

class Slots extends Component{
    constructor(props){
        super(props);
        this.state = {
            UID: '',
            value: 1,
            time: 1,
            hours: 1,
            controlledDate: null,
            hoursValue: 1,
            toggleSlots: false,
            email: '',
            displayName: '',
            slots: [],
            booking: false,
            slotClick: null,
        };
    };
    handleDropdown = (event, index, value) => {
        this.setState({value: value, time: value, toggleSlots: false});
        console.log(event.target.innerHTML, value);
    };
    hoursChange = (event, index, value) => {
        this.setState({hours: value, hoursValue: value, toggleSlots: false});
        console.log(event.target.innerHTML, value);        
    };
    dateChange = (event, date) => {
        let current = new Date();
        let input = date.getTime();
        if(input >= current){
            this.setState({
                controlledDate: date,
                toggleSlots: false
                // toggleSlots: false,
            });
            console.log(date);
        }else{
            alert('please enter Correct date!');                        
        }
    };
    slotClick = (index, booking) => {
        const { email, UID, displayName, time, hours, controlledDate } = this.state;
        // const months = ['januray', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        let date = controlledDate.getDate();
        let month = controlledDate.getMonth();
        let year = controlledDate.getFullYear();
        console.log(date, month, year);
        if(booking === false){
            if(time && hours && controlledDate){
                firebase.database().ref(`/locations/${this.props.locationKey}/slots/${index}/`).update({booking: true});
                // firebase.database().ref(`/locations/${this.props.locationKey}/slots/${index}/${UID}`).set({date, month, year, time, hours: hours});
                firebase.database().ref(`/bookings/${this.props.locationKey}/${index}/`).push({slot: index,email : email, UID: UID, dispalyName: displayName,
                time: time, date: date, month: month, year: year, hours: hours, controlledDate: controlledDate, areaName: this.props.areaName});
                this.setState({booking: true, slotClick: index});
            }else{
                alert('please select Time and date');
            };            
        }else{
            alert('Already booked!');
        };
    };
    submitButton = (e) => {e.preventDefault();
        const { time, hours, controlledDate, UID } = this.state;
        let date = controlledDate;
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let today = new Date();
        let todayDate = today.getDate();
        let todayMonth = today.getMonth();
        let todayHours = today.getHours();
        let todayYear = today.getFullYear();
        console.log(todayDate, day); 
        console.log(UID, this.props.locationKey);
        if(todayDate === day && todayMonth === month && year === todayYear){
            console.log(hours, todayHours);            
            if(time > todayHours){
                console.log(hours, todayHours);
                firebase.database().ref(`/bookings/${this.props.locationKey}/`).on('value', snap => {
                    let data = snap.val();
                    let slotKeys = [];
                    let unBook = [];
                    let dbmonth = '';
                    let dbdate = '';
                    let dbyear = '';
                    let dbtime = '';
                    let dbhours = '';
                    for(let key in data){
                        let data2 = data[key];
                        for(let key1 in data2){
                            console.log(data2[key1]);            
                            console.log(data[key]);
                            dbmonth = data2[key1]['month'];
                            dbdate = data2[key1]['date'];
                            dbyear = data2[key1]['year'];
                            dbtime = data2[key1]['time'];
                            dbhours = data2[key1]['hours'];
                            console.log(dbmonth, dbdate, dbyear, dbtime, dbhours);
                        }
                        if(year === dbyear && month === dbmonth && day === dbdate && dbtime === time){
                            unBook.push(key);
                        }
                        else if(year === dbyear && month === dbmonth && day === dbdate && dbtime+dbhours === time+hours){
                            console.log('false and push in unbook array');
                            unBook.push(key);
                        }else{
                            console.log('true and push in slotkeys array');
                            slotKeys.push(key);
                        }
                    }
                    if(slotKeys.length !== 0){
                        console.log(slotKeys);                                    
                        for(var i=0; i < slotKeys.length; i++){
                            firebase.database().ref(`/locations/${this.props.locationKey}/slots/${slotKeys[i]}/`).update({booking:false});
                            console.log(slotKeys[i]);
                        };
                    }
                    if(unBook){
                        console.log(unBook);
                        for(var j=0; j < unBook.length; j++){
                            firebase.database().ref(`/locations/${this.props.locationKey}/slots/${unBook[j]}/`).update({booking:true});
                            console.log(unBook[j]);
                        };
                    }
                });
                if(time && hours && controlledDate){
                    this.setState({toggleSlots: true});
                }else{
                    alert('Please enter time and date!');
                };
            }else{
                alert('Please select Correct Time...');
            }
        }else{
            firebase.database().ref(`/bookings/${this.props.locationKey}/`).on('value', snap => {
                let data = snap.val();
                let slotKeys = [];
                let unBook = [];
                let dbmonth = '';
                let dbdate = '';
                let dbyear = '';
                let dbtime = '';
                let dbhours = '';
                for(let key in data){
                    let data2 = data[key];
                    for(let key1 in data2){
                        console.log(data2[key1]);            
                        console.log(data[key]);
                        dbmonth = data2[key1]['month'];
                        dbdate = data2[key1]['date'];
                        dbyear = data2[key1]['year'];
                        dbtime = data2[key1]['time'];
                        dbhours = data2[key1]['hours'];
                        console.log(dbmonth, dbdate, dbyear, dbtime, dbhours);
                    }
                    if(year === dbyear && month === dbmonth && day === dbdate && dbtime === time){
                        unBook.push(key);
                    }
                    else if(year === dbyear && month === dbmonth && day === dbdate && dbtime+dbhours === time+hours){
                        console.log('false and push in unbook array');
                        unBook.push(key);
                    }else{
                        console.log('true and push in slotkeys array');
                        slotKeys.push(key);
                    }
                }
                if(slotKeys.length !== 0){
                    console.log(slotKeys);                                    
                    for(var i=0; i < slotKeys.length; i++){
                        firebase.database().ref(`/locations/${this.props.locationKey}/slots/${slotKeys[i]}/`).update({booking:false});
                        console.log(slotKeys[i]);
                    };
                }
                if(unBook){
                    console.log(unBook);
                    for(var j=0; j < unBook.length; j++){
                        firebase.database().ref(`/locations/${this.props.locationKey}/slots/${unBook[j]}/`).update({booking:true});
                        console.log(unBook[j]);
                    };
                }
            });
            if(time && hours && controlledDate){
                this.setState({toggleSlots: true});
            }else{
                alert('Please enter time and date!');
            };
        }
    };
    componentDidMount(){
        const current = new Date();
        let UID = '';
        let email = '';
        let displayName = '';
        firebase.auth().onAuthStateChanged((user)=>{
            UID = user.uid;
            email = user.email;
            displayName = user.displayName;
            // console.log(UID);
            this.setState({controlledDate: current ,UID, email, displayName});
        });
        firebase.database().ref(`/locations/${this.props.locationKey}/slots`).on('value', snap => {
            let data = snap.val();
            let slots = [];
            for(let key in data){
                slots.push(data[key]);
            };
            this.setState({slots});
        });
    };
    render(){
        // console.log(this.props.locationKey);
        return(
            <div>
                {      
                    this.state.booking ? <Paper style={{background: '#00BCD4', height: '100px', lineHeight: '100px', marginTop: '150px'}} zDepth={3}><h1>Successfully booked Slot No {this.state.slotClick}</h1></Paper> : 
                    <div>
                    <Paper style={styles.Paper} zDepth={5}>
                        <h1 style={{color: '#424242'}}>Select Timing</h1>
                        <div style={{width: '85%', height: '100px', position: 'relative', left: '50px'}}>
                            <span className='row'>
                                <DatePicker style={{float: 'left'}} autoOk={true} floatingLabelText='Select parking Date' 
                                    value={this.state.controlledDate}
                                    onChange={this.dateChange}
                                />
                            </span>
                        <span style={{top: '-20px', position: 'realtive'}}>Start Time:</span>
                        <span className='row'>
                            <DropDownMenu value={this.state.value} onChange={this.handleDropdown}> 
                                <MenuItem value={1} primaryText="12:00 AM" />
                                <MenuItem value={2} primaryText="01:00 AM" />
                                <MenuItem value={3} primaryText="02:00 AM" />
                                <MenuItem value={4} primaryText="03:00 AM" />
                                <MenuItem value={5} primaryText="04:00 AM" />
                                <MenuItem value={6} primaryText="05:00 AM" />
                                <MenuItem value={7} primaryText="06:00 AM" />
                                <MenuItem value={8} primaryText="07:00 AM" />
                                <MenuItem value={9} primaryText="08:00 AM" />
                                <MenuItem value={10} primaryText="09:00 AM" />
                                <MenuItem value={11} primaryText="10:00 AM" />
                                <MenuItem value={12} primaryText="11:00 AM" />
                                <MenuItem value={13} primaryText="12:00 PM" />
                                <MenuItem value={14} primaryText="01:00 PM" />                                        
                                <MenuItem value={15} primaryText="02:00 PM" />                                        
                                <MenuItem value={16} primaryText="03:00 PM" />                                        
                                <MenuItem value={17} primaryText="04:00 PM" />                                        
                                <MenuItem value={18} primaryText="05:00 PM" />                                        
                                <MenuItem value={19} primaryText="06:00 PM" />                                        
                                <MenuItem value={20} primaryText="07:00 PM" />                                        
                                <MenuItem value={21} primaryText="08:00 PM" />
                                <MenuItem value={22} primaryText="09:00 PM" />                                                                                                    
                                <MenuItem value={23} primaryText="10:00 PM" />                                                                                                    
                                <MenuItem value={24} primaryText="11:00 PM" />                                                                                                                                                                                                                            
                            </DropDownMenu>
                        </span>
                            <span style={{top: '-20px', position: 'realtive'}}>Select Hours:</span>
                        <span className='row'>
                            <DropDownMenu  value={this.state.hoursValue} onChange={this.hoursChange}> 
                                <MenuItem value={1} primaryText="1 hours" />
                                <MenuItem value={2} primaryText="2 hours" />
                                {/* <MenuItem value={3} primaryText="3 hours" />
                                <MenuItem value={4} primaryText="4 hours" />
                                <MenuItem value={5} primaryText="5 hours" />
                                <MenuItem value={6} primaryText="6 hours" />
                                <MenuItem value={7} primaryText="7 hours" /> */}
                            </DropDownMenu>
                        </span>
                        <RaisedButton onClick={this.submitButton} label="Book Slot" primary={true} /> 
                        </div>
                    </Paper>
                    <h1 style={{color: '#263238'}}>Slots:</h1>
                    {
                        this.state.toggleSlots ? <div>
                            {
                                this.state.slots.map((slot, index) => <button className={slot.booking ? 'bookingTrue' : 'bookingFalse'} onClick={(e)=> {e.preventDefault(); this.slotClick(index, slot.booking)}} key={index}>slot{+ index}</button>)                            
                            }
                        </div> : ''
                    }
                </div>
                }
            </div>
        );
    };
};
const styles = {
    Paper: {
        width: '90%',
        height: '200px',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
        background: 'rgb(38, 198, 213)',
    },
};
export default Slots;