import React, { Component } from 'react';
import pic from './parking.jpg'
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SignUp from './signUp';
import LinearProgress from 'material-ui/LinearProgress';
import * as firebase from 'firebase';

class SignIn extends Component{
    constructor() {
    super();
        this.state = {
            value: 'a',
            email: '',
            password: '',
            error: '',
            loading: false,
        };
    };
    handleChange = (value) => {
        this.setState({
          value: value,
        });
    };
    submitForm = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        if(email && password){
            this.setState({loading: true});
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((user)=>{
                    firebase.database().ref(`/users/${user.uid}`).on('value', snap => {
                        let data = snap.val();
                        if(data){
                            let accountType = snap.val()['accountType'];
                            if(accountType === 'admin'){
                                this.props.history.push('/admin');
                            }else{
                                this.props.history.push('/home');
                            }
                        }else{
                            user.delete().then(() => {
                                firebase.database().ref(`/bookings/${user.uid}`).remove();
                                this.setState({error: 'delete by admin', loading: false});
                            });
                        };
                    });
                })
                .catch((error)=>{
                    this.setState({ error: error.message, loading: false });
                });
        }else{
            this.setState({error: 'Please Enter all fields...'});
        };
    };
    render(){
        return(
            <div style={styles.main}>
                <Paper style={styles.paper} zDepth={5} >
                <Tabs 
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        <Tab style={{height: '70px'}} label="Login" value="a">
                        <div style={{marginLeft: '25%', marginTop: '15%'}}>
                            <h2 style={styles.headline}>Login</h2>
                            <form onSubmit={this.submitForm}>
                                <TextField
                                    onChange={(e)=> this.setState({email: e.target.value, error: ''})}
                                    hintText="user@gmail.com"
                                    floatingLabelText="Email address..."
                                /><br />
                                <TextField
                                    onChange={(e)=> this.setState({password: e.target.value, error: ''})}                                
                                    hintText="***************"                                
                                    floatingLabelText="Enter password..."
                                    type="password"
                                /><br />
                                <span><p style={styles.message}>{ this.state.error }</p></span>
                                {
                                    this.state.loading ? <LinearProgress style={styles.progress} mode='indeterminate' /> : 
                                    <RaisedButton type='submit' label='Login' primary={true} style={styles.button} />
                                }
                            </form>
                        </div>
                        </Tab>
                        <Tab to='./signUp' label="SignUp" value="b">
                        <div>
                            <h2 style={styles.headline}><SignUp abc={this.props}/></h2>
                        </div>
                        </Tab>
                    </Tabs>
                </Paper>
            </div>
        );
    };
};
const styles = {
    paper: {
        height: '600px',
        width: '450px',
        margin: 60,
        textAlign: 'center',
        display: 'inline-block',
        borderRadius: '5px',
    },
    message: {
        color: 'red',
        fontSize: 20,
        marginRight: '15px',
    },
    progress: {
        width: '75%',
        marginTop: '40px',
    },
    headline: {
        fontSize: 24,
        paddingLeft: 70,        
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    button: {
        marginTop: '15px',
        marginLeft: '70px'
    },
    main: {
        backgroundImage: `url(${pic})`,
        width: '100%',
        height: '745px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
};

export default SignIn;