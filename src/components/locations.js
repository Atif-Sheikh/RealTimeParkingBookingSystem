import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import * as firebase from 'firebase';
import Slots from './slots';

class Location extends Component{
    constructor(){
        super();
        this.state = {
            areaData: [],
            toggleSlot: false,
            areaName: '',
            address: '',
            slots: [],
            index: '',
            keys: [],
        };
    };
    addBooking = (areaName, address, Slots, index) => {
        this.setState({areaName, address, slots: Slots, toggleSlot: true, index});
    };
    componentDidMount(){
        firebase.database().ref(`/locations`).on('value', snap => {
            let data = snap.val();
            let areaData = [];
            let keys = [];
            for(let key in data){
                areaData.push(data[key]);
                keys.push(key);
            };
            this.setState({areaData, keys});
        });
    };
    render(){
        return(
            <div>
                   {
                    this.state.toggleSlot ? <Slots slots={this.state.slots} locationKey={this.state.keys[this.state.index]} areaName={this.state.areaName} address={this.state.address} />
                    : <Paper style={styles.paper} zDepth={3}>
                    <h1 style={{color: '#455A64',}}>Select Parking Area</h1>
                    <Table style={{background: '#E0F7FA'}}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width: 20}}>Index</TableHeaderColumn>
                            <TableHeaderColumn style={{width: 100}}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={{width: 400}}>Address</TableHeaderColumn>
                            <TableHeaderColumn>Book</TableHeaderColumn>                        
                        </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                        {
                            this.state.areaData.map((data, index) => {
                                return(
                                    <TableRow key={index.toString()}>
                                        <TableRowColumn style={{width: 20}}>{index+1}</TableRowColumn>
                                        <TableRowColumn style={{width: 100}}>{data.areaName}</TableRowColumn>
                                        <TableRowColumn style={{width: 400}}>{data.address}</TableRowColumn>
                                        <TableRowColumn>
                                            <FlatButton label="Book" 
                                                onClick={(e) => {e.preventDefault(); this.addBooking(data.areaName, data.address, data.slots, index)}} 
                                                backgroundColor='#80DEEA' 
                                            />
                                        </TableRowColumn>                        
                                    </TableRow> 
                                );
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
    width: 800,
    height: 'auto',
    margin: 30,
    marginTop: 100,
    textAlign: 'center',
    display: 'inline-block',
  },
};

export default Location;