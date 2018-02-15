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
        };
    };
    handleDropdown = (event, index, value) => {
        this.setState({value: value, time: value});
        console.log(event.target.innerHTML, value);
    };
    hoursChange = (event, index, value) => {
        this.setState({hours: value, hoursValue: value});
        console.log(event.target.innerHTML, value);        
    };
    dateChange = (event, date) => {
        let current = new Date();
        let input = date.getTime();
        if(input >= current){
            this.setState({
                controlledDate: date,
                // toggleSlots: false,
            });
            console.log(date);
        }else{
            alert('please enter Correct date!');                        
        }
        // console.log(input-current);
        // let miliseconds = input - current;
        // let hours = Math.floor(miliseconds/(60*60*1000));
        // console.log(hours);
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
                firebase.database().ref(`/bookings/${UID}/${this.props.locationKey}/${index}/`).set({slot: index,email : email, UID: UID, dispalyName: displayName,
                time: time, date: date, month: month, year: year, hours: hours, controlledDate: controlledDate, areaName: this.props.areaName});
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
        // let msec = Date.parse(month, day, year); 
        console.log(UID, this.props.locationKey);
        firebase.database().ref(`/bookings/${UID}/${this.props.locationKey}/`).on('value', snap => {
            let data = snap.val();
            let slotKeys = [];
            for(let key in data){
                let dbmonth = data[key]['month'];
                let dbdate = data[key]['date'];
                let dbyear = data[key]['year'];
                let dbtime = data[key]['time'];
                let dbhours = data[key]['hours'];
                if(year === dbyear){
                    if(month === dbmonth){
                        if(day === dbdate){
                            if(dbhours+dbtime < time+hours ){
                                console.log(time+hours, dbhours+dbtime, this.props.locationKey, key);
                                // console.log(time+hours, dbhours+dbtime, this.props.locationKey, key2, moreKey, slotNo);                                        
                                // firebase.database().ref(`/locations/${this.props.locationKey}/slots/${key2}/`).update({booking:false});
                                slotKeys.push(key);
                            }
                        }else if(day > dbdate){
                            slotKeys.push(key);                                    
                            // firebase.database().ref(`/locations/${this.props.locationKey}/slots/${key2}/`).update({booking:false});                                                                        
                        }
                    }else if(month > dbmonth){
                        slotKeys.push(key);                                
                        // firebase.database().ref(`/locations/${this.props.locationKey}/slots/${key2}/`).update({booking:false});                                
                    }
                }
            }
            if(slotKeys.length !== 0){
                console.log(slotKeys);                                    
                for(var i=0; i < slotKeys.length; i++){
                    console.log(slotKeys[i]);
                    firebase.database().ref(`/locations/${this.props.locationKey}/slots/${slotKeys[i]}/`).update({booking:false});
                };
            }
            // for(let key in data){
            //     let moreData = data[key];
            //     for(let moreKey in moreData){
            //         let moreAndMore = moreData[moreKey];
            //         for(let key2 in moreAndMore){
            //             // console.log(moreAndMore[key2], key2);
            //             let dbmonth = moreAndMore[key2]['month'];
            //             let dbdate = moreAndMore[key2]['date'];
            //             let dbyear = moreAndMore[key2]['year'];
            //             let dbtime = moreAndMore[key2]['time'];
            //             let dbhours = moreAndMore[key2]['hours'];
            //             let slotNo = moreAndMore[key2]['slot'];
            //             // let dbmsec = Date.parse(dbmonth, dbdate, dbyear);
            //             if(year === dbyear){
            //                 if(month == dbmonth){
            //                     if(day == dbdate){
            //                         if(dbhours+dbtime <= time+hours ){
            //                             console.log(time+hours, dbhours+dbtime, this.props.locationKey, key2, slotNo);
            //                             // console.log(time+hours, dbhours+dbtime, this.props.locationKey, key2, moreKey, slotNo);                                        
            //                             // firebase.database().ref(`/locations/${this.props.locationKey}/slots/${key2}/`).update({booking:false});
            //                             slotKeys.push(key2);
            //                         }
            //                     }else if(day > dbdate){
            //                         slotKeys.push(key2);                                    
            //                         // firebase.database().ref(`/locations/${this.props.locationKey}/slots/${key2}/`).update({booking:false});                                                                        
            //                     }
            //                 }else if(month > dbmonth){
            //                     slotKeys.push(key2);                                
            //                     // firebase.database().ref(`/locations/${this.props.locationKey}/slots/${key2}/`).update({booking:false});                                
            //                 }
            //             }
            //         }
                    // if(slotKeys){
                    //     console.log(slotKeys);                                    
                    //     for(var i=0; i < slotKeys.length; i++){
                    //         console.log(slotKeys[i]);
                    //         // firebase.database().ref(`/locations/${this.props.locationKey}/slots/${slotKeys[i]}/`).update({booking:false});
                    //     };
                    // }
        //             if(moreData[moreKey] === true){
        //                 // console.log(moreData, moreKey);
        //                 let moreAndMore = moreData;
        //                 for(let moreAndMoreKey in moreAndMore){
        //                     if(moreAndMoreKey !== 'booking'){
        //                         // console.log(moreAndMore[moreAndMoreKey]['date']);
        //                         let dbmonth = moreAndMore[moreAndMoreKey]['month'];
        //                         let dbdate = moreAndMore[moreAndMoreKey]['date'];
        //                         let dbyear = moreAndMore[moreAndMoreKey]['year'];
        //                         let dbtime = moreAndMore[moreAndMoreKey]['time'];
        //                         // let dbhours = moreAndMore[moreAndMoreKey]['hours'];
        //                         let dbmsec = Date.parse(dbmonth, dbdate, dbyear);
        //                         if(msec > dbmsec || time > dbtime){
        //                             firebase.database().ref(`/locations/${this.props.locationKey}/slots/${key}`).update({booking: false});
        //                         }else{
        //                             console.log('already bOOked', dbmsec , dbtime);
        //                         }                                                                                        
        //                     }
        //                 }
                    // }
        //         }
        //     };
        });
        if(time && hours && controlledDate){
            this.setState({toggleSlots: true});
        }else{
            alert('Please enter time and date!');
        };
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
            // console.log(snap.val());

            let data = snap.val();
            let slots = [];
            for(let key in data){
                slots.push(data[key]);
            };
            this.setState({slots});
        });
        // console.log(current.getDate(),  current.getMonth(), current.getFullYear());
        // let days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        // let months = ['january', 'fedruary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    };
    render(){
        // console.log(this.props.locationKey);
        return(
            <div>
                <Paper style={styles.Paper} zDepth={5}>
                    <h1>Select Timing</h1>
                    <div style={{width: '85%', height: '100px', position: 'relative', left: '50px'}}>
                        <span className='row'>
                            <DatePicker style={{float: 'left'}} floatingLabelText='Select parking Date' 
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
                <h1>Slots:</h1>
                {
                    this.state.toggleSlots ? <div>
                        {
                            this.state.slots.map((slot, index) => <button className={slot.booking ? 'bookingTrue' : 'bookingFalse'} onClick={(e)=> {e.preventDefault(); this.slotClick(index, slot.booking)}} key={index}>slot{+ index}</button>)                            
                        }
                    </div> : ''
                }
            </div>
        );
    };
};
const styles = {
    paper: {
        width: '400px',
        height: '600px',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
};
export default Slots;