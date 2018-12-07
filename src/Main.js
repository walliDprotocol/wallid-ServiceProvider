import React, { Component } from "react";
import { HashRouter } from 'react-router-dom';
import { Route } from 'react-router';
import { Row, Col } from 'reactstrap';

import Header from './Header';
import Home from './Home';
import Apply from './Apply';
import Footer from './Footer';

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Header />
          <Row className="justify-content-center page-content">
              <Col md="9">
                  <div className="content">
                      <Route exact path="/" component={Home}/>
                      <Route exact path="/apply" component={Apply}/>
                  </div>
              </Col>
          </Row>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default Main;
