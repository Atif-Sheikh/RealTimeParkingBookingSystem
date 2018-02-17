import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import * as firebase from 'firebase';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

class AllFeedbacks extends Component{
    constructor(){
        super();
        this.state = {
            feedbacks: [],
            keys: [],
            reply: '',
            form: false,
            adminReply: false,
            replys: [],
        };
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
    toggleForm = () => {
        this.setState({form: !this.state.form});
    };
    componentDidMount(){
        firebase.database().ref(`/feedbacks`).on('value', snap => {
            let data = snap.val();
            let keys = [];
            let feedbacks = [];
            let replys = [];
            for(let key in data){
                console.log(key, ':::', data[key]);
                let data1 = data[key];
                for(let key1 in data1){
                    if(data1[key1]['reply']){
                        console.log(data1[key1]['reply']);
                        replys.push(data1[key1]['reply']);
                    }
                }
                console.log(replys);
                feedbacks.push(data[key]);
                keys.push(key);
            };
            this.setState({feedbacks, keys, replys});
            // console.log(this.state.feedbacks, this.state.keys);
        });
    };
    render(){
        console.log(this.state.replys)
        return(
            <Paper style={styles.paper} zDepth={1}>
                <h1>Feedbacks</h1>
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{width: 20}}>ID</TableHeaderColumn>
                        <TableHeaderColumn style={{width: 60}}>Name</TableHeaderColumn>
                        <TableHeaderColumn style={{width: 100}}>Feedback</TableHeaderColumn>
                        <TableHeaderColumn style={{width: 100}}>Admin Reply</TableHeaderColumn>                                                
                        <TableHeaderColumn style={{width: 200}}>Reply</TableHeaderColumn>                        
                    </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                    {
                        this.state.feedbacks.map((feedback, index) => {
                            return (
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
        width: '90%',
        height: 'auto',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
};
  
export default AllFeedbacks;