import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';

class AddLocation extends Component{
    constructor(){
        super();
        this.state = {
            areaName: '',
            address: '',
            slots: [],
            noOfSlots: '',
            error: '',
            successfully: '',
        };
    };
    AddLocation = (e) => {
        e.preventDefault();
        const { areaName, address, noOfSlots } = this.state;
        if(areaName && noOfSlots && address){
            let slots = [];
            for(var i=0; i<noOfSlots; i++){
                slots.push({booking: false});
            }
            // console.log(slots);
            // this.setState({slots});
            firebase.database().ref(`/locations/`).push({slots, areaName, address})
                .then(()=>{
                    this.setState({successfully: 'successfully Added', areaName: '', address: '', noOfSlots: ''});
                })
        }else{
            this.setState({error: 'Please enter all Fields...', successfully: ''});
        }
    };
    render(){
        return(
            <div>
                <Paper style={styles.paper} zDepth={4}>
                    <h2>Add Location</h2>
                    <form onSubmit={this.AddLocation}>
                        <TextField
                            value={this.state.areaName}
                            floatingLabelText="Enter Area..."
                            onChange={(e)=> this.setState({areaName: e.target.value, error: '', successfully: ''})}
                        /><br />
                        <TextField
                            value={this.state.address}
                            floatingLabelText="Enter Address..."
                            onChange={(e)=> this.setState({address: e.target.value, error: '', successfully: ''})}
                        /><br />
                        <TextField
                            value={this.state.noOfSlots}                            
                            type='number'
                            onChange={(e)=> this.setState({noOfSlots: e.target.value, error: '', successfully: ''})}                            
                            floatingLabelText="Enter No of slots..."
                        /><br />
                        <span><p style={styles.successfully}>{this.state.successfully}</p></span>                        
                        <span><p style={styles.error}>{this.state.error}</p></span>
                        <RaisedButton label="Add Location" type='submit' style={styles.button} primary={true} />
                    </form>
                </Paper>
            </div>
        );
    };
};
const styles = {
    paper: {
        height: 400,
        width: 400,
        paddingTop: 10,
        margin: 20,
        marginTop: 100,
        textAlign: 'center',
        display: 'inline-block',
    },
    error: {
        color: 'red',
        fontSize: 20,
    },
    successfully: {
        color: 'green',
        fontSize: 20,
    },
    button: {
        marginTop: 2,
    },
};
export default AddLocation;