import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import * as firebase from 'firebase';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            error: '',
            loading: false,
            accountType: 'user',
        };
    };
    submitForm = (e) => {
        e.preventDefault();
        const { name, email, password, accountType } = this.state;
        if(name && email && password){
            this.setState({loading: true});
            console.log(name, email, password, accountType);
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user)=>{
                firebase.database().ref(`/users/${user.uid}`).set({uid: user.uid, accountType, name, email})
                console.log('current User', user.uid);
                firebase.auth().currentUser.updateProfile({displayName: name})
                    .then(()=>{
                        console.log('update successfuly');                
                    })
                    .catch((error)=>{
                        console.log('error', error);                                
                    });
                this.setState({loading: false, name: '', password: '', email: ''});
                    this.props.abc.history.push('/home');
            })
                .catch((error)=>{
                    console.log(error.message, 'error');
                    this.setState({ loading: false, error: error.message });
            });
        }
        else{
            this.setState({error: 'Please enter all fields...'});
        }
    };
    render(){
        return(
            <div style={{marginLeft: '10%', marginTop: '1%'}}>
                <h2 style={styles.headline}>SignUp</h2>
                <form onSubmit={this.submitForm}>
                    <TextField
                        onChange={(e)=> this.setState({name: e.target.value, error: ''})}
                        hintText="user..."
                        defaultValue={this.state.name}
                        floatingLabelText="Name"
                    /><br />
                    <TextField
                        onChange={(e)=> this.setState({email: e.target.value, error: ''})}                    
                        defaultValue={this.state.email}                        
                        hintText="user@gmail.com"
                        floatingLabelText="Email address..."
                    /><br />
                    <TextField
                        onChange={(e)=> this.setState({password: e.target.value, error: ''})}                                        
                        hintText="***************"                                
                        defaultValue={this.state.password}                        
                        floatingLabelText="Enter password..."
                        type="password"
                    /><br />
                    <span><p style={styles.error}>{this.state.error}</p></span>
                    {
                        this.state.loading ? <LinearProgress style={styles.progress} mode="indeterminate" /> : 
                        <RaisedButton type='submit' label='SignUp' primary={true} style={styles.button} />
                    }
                </form>
            </div>
        );
    };
};
const styles = {
    headline: {
        fontSize: 24,
        paddingLeft: 75,        
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    error: {
        color: 'red',
        fontSize: '20px',
        marginLeft: '-5px', 
    },
    progress: {
        width: '75%',
        marginTop: '40px',
    },
    button: {
        marginTop: '-5px',
        marginLeft: '70px'
    },
};

export default SignUp;