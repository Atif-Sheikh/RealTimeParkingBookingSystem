import React, { Component } from 'react';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

class Bookings extends Component{
    constructor(){
        super();
        this.state = {
            keys: [],
            values: [],
            noBooking: false,
            // areaKeys: [],
        };  
    };
    cancelBooking = (areaName, userUID, index, slot, date, time) => {
        // var index1 = this.state.keys[index];
        if(this.props.accountType === 'admin'){
            // var UID;
            // firebase.database().ref(`/bookings/`).on('value', snap => {
            //     let data = snap.val();
            //     // var slot; 
            //     for(let key in data){
            //         let moreData = data[key];
            //         for(let key2 in moreData){
            //             let moreAndMoreData = moreData[key2];
            //             for(let key3 in moreAndMoreData){
            //             console.log(moreAndMoreData[key3]);                                                                                        
            //                 let val = moreAndMoreData[key3];
            //                 console.log(val['slot'], this.state.keys[index], val['areaName'], areaName);
            //                 if(val['slot'] === this.state.keys[index] && val['areaName'] === areaName){
            //                     UID = val['UID'];
            //                     console.log(UID);
            //                     // slot = val.slot;
            //                 }
            //             }
            //         }
            //     };
            let areaKey;
            let deleteKey;
            firebase.database().ref(`/locations`).on('value', snap => {
                let data = snap.val();
                for(let key in data){
                    if(areaName === data[key]['areaName']){
                        areaKey = key;
                    }
                };
                // firebase.database().ref(`/locations/${areaKey}/slots/${index1}`).update({booking: false});
                // console.log(areaKey, slot);
                firebase.database().ref(`/bookings/${areaKey}/${slot}/`).on('value', snap => {
                    let data1 = snap.val();
                    for(let key1 in data1){
                        console.log(data1[key1], userUID, slot, date, time);
                        if(data1[key1]['UID'] === userUID && data1[key1]['date'] === date && data1[key1]['time'] === time){
                            console.log(key1);
                            deleteKey = key1;             
                        }
                    };
                    // console.log(areaKey, deleteKey, slot)
                    firebase.database().ref(`/bookings/${areaKey}/${slot}/${deleteKey}/`).remove();
                    firebase.database().ref(`/locations/${areaKey}/slots/${slot}`).update({booking: false});
                });                
            });
            // });
        }else{
            firebase.auth().onAuthStateChanged((user) => {
                let UID = user.uid;
                let deleteKey = '';
                firebase.database().ref(`/locations`).on('value', snap => {
                    let data = snap.val();
                    var areaKey = '';
                    for(let key in data){
                        let areaData = data[key].areaName;
                        if(areaData === areaName){
                            areaKey = key; 
                        }
                    }
                    firebase.database().ref(`/bookings/${areaKey}/${slot}`).on('value', snap => {
                        let data = snap.val();
                        for(let key in data){
                            if(data[key]['UID'] === UID && date === data[key]['date'] && time === data[key]['time'])
                            deleteKey = key;
                        }
                    })
                    console.log(areaKey, slot)
                    firebase.database().ref(`/bookings/${areaKey}/${slot}/${deleteKey}`).remove();
                    firebase.database().ref(`/locations/${areaKey}/slots/${slot}`).update({booking: false})
                });
            });
        };
    };
    componentDidMount(){
        if(this.props.accountType === 'admin'){
            firebase.database().ref(`/bookings`).on('value', snap => {
                let data = snap.val();
                if(data){
                    let keys = [];
                    let values = [];
                    for(let key in data){
                        let moreData = data[key];
                        for(let key in moreData){
                            let moreAndMoreData = moreData[key];
                            for(let key in moreAndMoreData){
                                // console.log(moreAndMoreData[key]);
                                values.push(moreAndMoreData[key]);
                                keys.push(key);
                            }
                        };
                    };
                    this.setState({keys, values});
                }else{
                    this.setState({noBooking: true});
                }
            });
        }else{
            firebase.auth().onAuthStateChanged((user) => {
                let UID = user.uid;
                firebase.database().ref(`/bookings/`).on('value', snap => {
                    // console.log(snap.val());
                    let data = snap.val();
                    if(data){
                        let keys = [];
                        let values = [];
                        for(let key in data){
                            // keys.push(key);
                            // values.push(data[key]);
                            // console.log(data[key]);
                            let moreData = data[key];
                            for(let key1 in moreData){
                                let moreAndMore = moreData[key1];
                                for(let key2 in moreAndMore){
                                    console.log(moreAndMore[key2]['UID']);
                                    if(moreAndMore[key2]['UID'] === UID){
                                        keys.push(key);
                                        // console.log(key);
                                        values.push(moreAndMore[key2]);
                                    }
                                }
                            }
                        }
                        console.log(values, keys)
                        this.setState({keys, values});
                    }else{
                        this.setState({noBooking: true});
                    }
                });
            });
        };
    };
    renderTime = (time) => {
        if(time === 0){
            return '12 A.M';
        }else{
            if(time > 12){
                return (time - 12) +' P.M'; 
            }else{
                return time + ' A.M';
            }
        }
    };
    render(){
        return(
            <div>
                {
                    this.state.noBooking ? <Paper style={{background: '#00BCD4', height: '100px', lineHeight: '100px', marginTop: '150px'}} zDepth={3}><h1>You have No booking Yet...</h1></Paper> 
                    : <Paper style={styles.paper} zDepth={3}>
                    <Table style={{background: '#E0F7FA',}}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width: '50px'}}>Slot No</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '200px'}}>Name</TableHeaderColumn>                        
                            <TableHeaderColumn style={{width: '100px'}}>Location</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '100px'}}>Date</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '70px'}}>Start Time</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '70px'}}>Hours</TableHeaderColumn>
                            <TableHeaderColumn>Cancel Booking</TableHeaderColumn>                                                                        
                        </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                        {
                            this.state.values.map((val, index) => {
                                return <TableRow key={index}>
                                    <TableRowColumn style={{width: '50px'}}>{val.slot}</TableRowColumn>
                                    <TableRowColumn style={{width: '200px'}}>{val.email}</TableRowColumn>
                                    <TableRowColumn style={{width: '100px'}}>{val.areaName}</TableRowColumn>
                                    <TableRowColumn style={{width: '100px'}}>{val.date+'-'+(val.month + 1)+'-'+ val.year}</TableRowColumn>
                                    <TableRowColumn style={{width: '70px'}}>{this.renderTime(val.time-1)}</TableRowColumn>
                                    <TableRowColumn style={{width: '70px'}}>{`${val.hours} hour`}</TableRowColumn>
                                    <TableRowColumn><FlatButton onClick={(e) => {e.preventDefault(); this.cancelBooking(val.areaName, val.UID, index, val.slot, val.date, val.time)}} label="Cancel Booking" primary={true} /></TableRowColumn>                                                                                                
                                </TableRow>
                            })
                        }       
                        </TableBody>
                    </Table>
                </Paper>
                }
            </div>
        );
    };
};
const styles = {
    paper: {
        width: '1200px',
        height: 'auto',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
};
export default Bookings;