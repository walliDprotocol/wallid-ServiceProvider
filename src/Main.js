import React, { Component } from "react";
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router'

import Header from './Header';
import Home from './Home';
import Footer from './Footer';

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Header />
          <div className="row justify-content-center">
              <div className="col-9">
                  <div className="content">
                      <Route exact path="/" component={Home}/>
                  </div>
              </div>
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default Main;
