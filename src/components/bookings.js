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
            // areaKeys: [],
        };  
    };
    cancelBooking = (areaName, userUID,index) => {
        var index1 = this.state.keys[index];
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
                firebase.database().ref(`/locations`).on('value', snap => {
                    let data = snap.val();
                    let areaKey;
                    for(let key in data){
                        if(areaName === data[key]['areaName']){
                            areaKey = key;
                        }
                    };
                    console.log(userUID , areaKey, index1);
                    firebase.database().ref(`/bookings/${userUID}/${areaKey}/${index1}`).remove();
                    firebase.database().ref(`/locations/${areaKey}/slots/${index1}`).update({booking: false});
                });
                // firebase.database().ref(`/locations`).on('value', snap => {
                //     // console.log(snap.val());
                // });
            // });
        }else{
            firebase.auth().onAuthStateChanged((user) => {
                let UID = user.uid;
                firebase.database().ref(`/locations`).on('value', snap => {
                    let data = snap.val();
                    var areaKey = '';
                    for(let key in data){
                        let areaData = data[key].areaName;
                        if(areaData === areaName){
                            areaKey = key; 
                        }
                    }
                    firebase.database().ref(`/bookings/${UID}/${areaKey}/${this.state.keys[index]}`).remove();
                    firebase.database().ref(`/locations/${areaKey}/slots/${this.state.keys[index]}`).update({booking: false})
                });
            });
        };
    };
    componentDidMount(){
        if(this.props.accountType === 'admin'){
            firebase.database().ref(`/bookings`).on('value', snap => {
                let data = snap.val();
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
            });
        }else{
            firebase.auth().onAuthStateChanged((user) => {
                let UID = user.uid;
                firebase.database().ref(`/bookings/${UID}`).on('value', snap => {
                    // console.log(snap.val());
                    let data = snap.val();
                    let keys = [];
                    let values = [];
                    for(let key in data){
                        // keys.push(key);
                        // values.push(data[key]);
                        // console.log(data[key]);
                        let moreData = data[key];
                        for(let key in moreData){
                            console.log(moreData[key]['UID'], UID);
                            if(moreData[key]['UID'] === UID){
                                keys.push(key);
                                // console.log(key);
                                values.push(moreData[key]);
                            }
                        }
                    }
                    console.log(values, keys)
                    this.setState({keys, values});
                });
            });
        };
    };
    renderTime = (time) => {
        if(time > 12){
            return (time -12) +' P.M'; 
        }else{
            return time+' A.M';
        }
    };
    render(){
        return(
            <Paper style={styles.paper} zDepth={3}>
                <Table>
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
                                <TableRowColumn style={{width: '50px'}}>{this.state.keys[index]}</TableRowColumn>
                                <TableRowColumn style={{width: '200px'}}>{val.email}</TableRowColumn>
                                <TableRowColumn style={{width: '100px'}}>{val.areaName}</TableRowColumn>
                                <TableRowColumn style={{width: '100px'}}>{val.date+'-'+(val.month + 1)+'-'+ val.year}</TableRowColumn>
                                <TableRowColumn style={{width: '70px'}}>{this.renderTime(val.time)}</TableRowColumn>
                                <TableRowColumn style={{width: '70px'}}>{`${val.hours} hour`}</TableRowColumn>
                                <TableRowColumn><FlatButton onClick={(e) => {e.preventDefault(); this.cancelBooking(val.areaName, val.UID, index)}} label="Cancel Booking" primary={true} /></TableRowColumn>                                                                                                
                            </TableRow>
                        })
                    }       
                    </TableBody>
                </Table>
            </Paper>
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