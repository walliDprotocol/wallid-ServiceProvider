import React, { Component } from "react";
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router'
import { NavLink } from 'react-router-dom'

import Home from './Home';
import Import from './Import';
import Footer from './Footer';

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <nav className="navbar navbar-expand-md navbar-dark fixed-top header bg-green-menu">
              <div className="container">
              <a className="navbar-brand" href="https://wallid.io/">
                  <img src={require("./img/wallid-logo.png")} className="img-fluid" alt="Wallid Logo"/>
              </a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse"
                  aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                  <ul className="navbar-nav ml-auto">
                      <li className="nav-item active">
                          <a className="nav-link" href="https://wallid.io/identityfortesting.html" target="_self">Test our Demo</a>
                      </li>
                      <li className="nav-item active">
                          <a className="nav-link" href="https://wallid.io/importid.html" target="_self">ImportiD</a>
                      </li>
                      <li className="nav-item active">
                          <a className="nav-link" href="https://myetherid.io" target="_blank">MyEtheriD</a>
                      </li>
                      <li className="nav-item active">
                          <a className="nav-link" href="javascript:window.scrollTo(0,document.body.scrollHeight);">Talk to us</a>
                      </li>
                      <li className="nav-item active">
                          <a className="nav-link" href="#">
                              <button type="button" className="btn btn-block btn-lg btnStyle navBtn">Get my Offer</button>
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
          </nav>
          <div className="content jumbotron mb-0 sectionOneImportId bg-green-gradient-menu pb-0">
          <Route exact path="/" component={Home}/>
          <Route path="/Import" component={Import}/>
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default Main;
