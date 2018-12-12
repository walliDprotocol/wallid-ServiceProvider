import React, { Component } from "react";
import { Row, Col } from "reactstrap";

class Home extends Component {

  render() {
    return (
      <div>
        <div className="banner">
            <div className="info">
                <p>Apply to a personal Credit and get approved in less than 2 minutes</p>
                <button className="btn btn-apply" onClick={() => this.props.history.push('/apply')}>Apply here</button>
            </div>
            <img src={require("./img/banner_1.png")} className="img-fluid" alt="Banner"/>
            <div className="buttons">
                <i class="fas fa-circle active"></i>
                <i class="fas fa-circle"></i>
                <i class="fas fa-circle"></i>
                <i class="fas fa-circle"></i>
            </div>
        </div>
        <Row>
            <Col md="4">
                <div className="products">
                    <img src={require("./img/product_1.png")} className="img-fluid" alt="Product 1"/>
                    <p>Credibank applies WalliD validation service to its's Onboarding proccess</p>
                </div>
            </Col>
            <Col md="4">
                <div className="products">
                    <img src={require("./img/product_2.png")} className="img-fluid" alt="Product 2"/>
                    <p>Credibank is the only fully digital</p>
                </div>
            </Col>
            <Col md="4">
                <div className="products">
                    <img src={require("./img/product_3.png")} className="img-fluid" alt="Product 3"/>
                    <p>Know more about us</p>
                </div>
            </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
