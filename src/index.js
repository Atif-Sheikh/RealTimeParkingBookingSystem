import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';


var config = {
    apiKey: "AIzaSyA6_YXMtoCpofU-ojsXy00NbcR0dzpcMmg",
    authDomain: "hunting-52bb4.firebaseapp.com",
    databaseURL: "https://hunting-52bb4.firebaseio.com",
    projectId: "hunting-52bb4",
    storageBucket: "hunting-52bb4.appspot.com",
    messagingSenderId: "252132230810"
};
  firebase.initializeApp(config);
ReactDOM.render(<MuiThemeProvider>
        <App />
    </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
