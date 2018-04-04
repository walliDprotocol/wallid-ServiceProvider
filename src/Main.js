import React, { Component } from "react";
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router'
import { NavLink } from 'react-router-dom'

import Home from './Home';
import Footer from './Footer';
import CardSelect from './CardSelect';
import KycVerify from './KycVerify';
import KycVerified from './KycVerified';


class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <div className="logo">
            <img src={require('./credibank_logo.png')} alt="MyEtherID Logo"/>
          </div>
          <ul className="header">
            <li><NavLink exact to="/">Credit Simulator</NavLink></li>
            <li><NavLink to="">Products</NavLink></li>
            <li><NavLink to="">Clients</NavLink></li>
            <li><NavLink to="">Partners</NavLink></li>
            <li><NavLink to="">Help</NavLink></li>
          </ul>
          <div className="content">
          <Route exact path="/" component={Home}/>
          <Route exact path="/CardSelect" component={CardSelect}/>
          <Route path="/KycVerify" component={KycVerify}/>
          <Route path="/KycVerified" component={KycVerified}/>
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default Main;
