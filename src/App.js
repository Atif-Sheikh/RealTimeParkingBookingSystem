import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import SignIn from './components/signIn';
import Home from './components/home';
import AdminHome from './components/adminHome';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <section>
            <Switch>
            <Route exact path='/' component={SignIn} />
            <Route path='/home' component={Home} />
            <Route path='/admin' component={AdminHome} />
            <Route component={()=> <h1>404 error</h1>} />
            </Switch>            
          </section>          
        </Router>
      </div>
    );
  }
}

export default App;
