import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import * as firebase from 'firebase';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

class AllUsers extends Component{
    constructor(){
        super();
        this.state = {
            users: [],
        };
    };
    removeButton = (uid) => {
        firebase.database().ref(`/users/${uid}`).remove();
    };
    componentDidMount(){
        firebase.database().ref(`/users`).on('value', snap => {
            // console.log(snap.val());
            let data = snap.val();
            let users = [];
            for(let key in data){
                if(data[key]['accountType'] === 'user'){
                    users.push(data[key]);
                }
            };
            this.setState({ users });
        });
    }; 
    render(){
        return(
            <Paper style={styles.paper} zDepth={3}>
                <h2>Users List</h2>
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>ID</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Email</TableHeaderColumn>
                        <TableHeaderColumn>Remove</TableHeaderColumn>                        
                    </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.state.users.map((user, index) => {
                                return <TableRow key={index.toString()}>
                                    <TableRowColumn>{index + 1}</TableRowColumn>
                                    <TableRowColumn>{user.name}</TableRowColumn>
                                    <TableRowColumn>{user.email}</TableRowColumn>                                    
                                    <TableRowColumn>{<FlatButton label="Remove" onClick={()=> this.removeButton(user.uid)} primary={true} />}</TableRowColumn>                                                                        
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
        width: 700,
        height: 'auto',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
};
export default AllUsers;