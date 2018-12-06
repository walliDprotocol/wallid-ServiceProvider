import React, { Component } from "react";
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router'

import Home from './Home';
import Footer from './Footer';

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <div className="row topbar">
            <div className="col-2">
                <a className="site-name" href="https://wallid.io/pilotidvalidation/#/">
                    <img src={require("./img/credibank.png")} className="img-fluid" alt="Credibank Logo"/>
                </a>
            </div>
            <div className="col-6 offset-4">
                <div className="row">
                    <div className="col-3 to-right">
                        <p className="text-uppercase item">Directbank</p>
                    </div>
                    <div className="col-3">
                        <input className="input" type="text" placeholder="User code"></input>
                    </div>
                    <div className="col-3">
                        <select className="select lg text-uppercase">
                            <option>Individuals</option>
                        </select>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div className="col-2">
                        <select className="select text-uppercase">
                          <option>En</option>
                        </select>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
          </div>
          <nav className="navbar navbar-expand-md navbar-gray">
              <div className="">
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse"
                      aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarCollapse">
                      <ul className="navbar-nav">
                          <li className="nav-item active">
                              <a className="nav-link" href="https://wallid.io/identityfortesting.html" target="_self">Credibank</a>
                          </li>
                          <li className="nav-item active">
                              <a className="nav-link" href="https://wallid.io/importid.html" target="_self">Personal Credit Application</a>
                          </li>
                          <li className="nav-item active">
                              <a className="nav-link" href="#">Products</a>
                          </li>
                          <li className="nav-item active">
                              <a className="nav-link" href="#">Clients</a>
                          </li>
                          <li className="nav-item active">
                              <a className="nav-link" href="#">Partners</a>
                          </li>
                          <li className="nav-item active">
                              <a className="nav-link" href="#">Help</a>
                          </li>
                          <li className="nav-item active search-icon">
                              <i class="fas fa-search"></i>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>
          <div className="content sectionOneImportId">
          <Route exact path="/" component={Home}/>
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default Main;
