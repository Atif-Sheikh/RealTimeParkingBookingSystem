import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import * as firebase from 'firebase';

class TableFormRow extends Component{
    constructor(){
        super();
        this.state = {
            form: false,
        };
    };
    toggleForm = () => {
        this.setState({form: !this.state.form});
    };
    submitReply = (name) => {
        const { reply } = this.state;
        console.log(reply, name);
        if(reply){
            let UID = '';
            firebase.database().ref(`/feedbacks`).on('value', snap => {
                let data = snap.val();
                for(let key in data){
                    if(name === data[key]['name']){
                        UID = key;
                    }
                };
            });
            firebase.database().ref(`/feedbacks/${UID}/`).update({reply});
            this.setState({reply: '', form: false});
            alert('successfully send...');
        }else{
            alert('Enter Message...');
            this.setState({form: false});
        };
    };
    render(){
        console.log(this.props)
        const { index, feedback } = this.props;
        return(
            <TableRow key={index.toString()}>
                <TableRowColumn style={{width: 20}}>{index + 1}</TableRowColumn>
                <TableRowColumn style={{width: 60}}>{feedback.name}</TableRowColumn>
                <TableRowColumn style={{width: 100}}>{feedback.feedback}</TableRowColumn>
                <TableRowColumn style={{width: 100}}>{feedback.reply}</TableRowColumn>                            
                <TableRowColumn style={{width: 200}}>
                    {
                        this.state.form ? <form onSubmit={(e)=> {e.preventDefault();this.submitReply(feedback.name)}}><TextField
                        onChange={(e) => this.setState({reply: e.target.value})}
                        floatingLabelText="Reply..."
                        />
                        <FlatButton background='red' label="Send" type='submit' primary={true} />
                        <FlatButton label="Cancel" onClick={this.toggleForm} primary={true} />
                        </form>
                        : <FlatButton label="Reply" onClick={(e)=> { e.preventDefault(); this.toggleForm()}} primary={true} />
                    }
                </TableRowColumn>                        
            </TableRow>
        );
    };
};

export default TableFormRow;
