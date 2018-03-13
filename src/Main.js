import React, { Component } from "react";
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router'
import { NavLink } from 'react-router-dom'

import Home from './Home';
import Help from './Help';
import Footer from './Footer';

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>Cofidiz</h1>
          <ul className="header">
            <li><NavLink exact to="/">Cofidiz</NavLink></li>
            <li><NavLink to="">Products</NavLink></li>
            <li><NavLink to="">Clients</NavLink></li>
            <li><NavLink to="">Partners</NavLink></li>
            <li><NavLink to="">Help</NavLink></li>
          </ul>
          <div className="content">
          <Route exact path="/" component={Home}/>
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default Main;
