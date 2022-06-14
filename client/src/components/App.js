import React, { Component } from 'react';
import {Route} from "react-router-dom";
import cookie from 'react-cookies';
import axios from "axios";


// css
import '../css/new.css';

// header
import HeaderAdmin from './Header/Header admin';


// footer
import Footer from './Footer/Footer';
import reactProxy from './reactProxy';

// login
import LoginForm from './LoginForm';
import Register from './Register/Register';
import ResearchProject from './ResearchProject'
import ResearchProjectView from './ResearchProjectView'
import SellProject from './SellProject'
import UserWinner from './UserWinner';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    axios.post('/api/LoginForm?type=SessionConfirm', {
      token1 : cookie.load('userid') 
      , token2 : cookie.load('username') 
    })
    .then( response => {
        this.state.userid = response.data.token1
        let password = cookie.load('userpassword')
        if(password !== undefined){
          axios.post('/api/LoginForm?type=SessionSignin', {
            is_Email: this.state.userid,
            is_Token : password
          })
          .then( response => {
            if(response.data.json[0].useremail === undefined){
              this.noPermission()
            }
          })
          .catch( error => {
            this.noPermission()
          });
        }else{
          this.noPermission()
        }
    })
    .catch( response => this.noPermission());
  }

  noPermission = (e) => {
    if(window.location.hash != 'nocookie'){
      this.remove_cookie();
      window.location.href = '/login/#nocookie';
    }
  };

  remove_cookie = (e) => {
    cookie.remove('userid', { path: '/'});
    cookie.remove('username', { path: '/'});
    cookie.remove('userpassword', { path: '/'});
  }

  render () {
    return (
      <div className="App">
        <HeaderAdmin/> 
        <Route exact path='/' component={LoginForm} />
        <Route path='/login' component={LoginForm} />
        <Route path='/register' component={Register} />
        <Route path='/ResearchProject' component={ResearchProject} />
        <Route path='/ResearchProjectView/:algocode' component={ResearchProjectView} />
        <Route path='/SellProject' component={SellProject} />
        <Route path='/UserWinner' component={UserWinner} />
        
        <Footer/>
      </div>
    );
  }
}

export default App;
