import React from 'react';
import { Row, Col } from 'reactstrap';

function Footer(/*props*/) {
  return (
    <footer className="bg-navy">
        <Row className="justify-content-center">
            <Col md="9">
              <Row>
                <Col md="3">
                    <img src={require('./img/credibank-white.png')} className="img-fluid" alt="Logo Wallid"/>
                </Col>
                <Col md="9">
                  <Row>
                    <Col md="3">
                      <p className="footer-menu">Pricing</p>
                      <p className="footer-menu">Security</p>
                      <p className="footer-menu">Promoters</p>
                      <p className="footer-menu">Distance Bank</p>
                    </Col>
                    <Col md={{ size: 3, offset: 1 }}>
                      <p className="footer-menu">Legal information</p>
                      <p className="footer-menu">Credit agreements</p>
                      <p className="footer-menu">Main doc. information</p>
                      <p className="footer-menu">Corporative web</p>
                    </Col>
                    <Col md={{ size: 3, offset: 2 }}>
                      <p className="footer-menu">Privacy</p>
                      <p className="footer-menu">About credibank</p>
                      <p className="footer-menu">Glossary</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md="12">
              <hr></hr>
              <p className="copyright">Credibank is a website intended for demo purposes only and powered by WalliD</p>
            </Col>
        </Row>
    </footer>
  );
}

export default Footer;
