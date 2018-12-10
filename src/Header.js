import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

function Header(/*props*/) {
  return (
    <header>
        <Row className="justify-content-center topbar">
            <Col md="9">
                <Row>
                    <Col md="2">
                        <NavLink className="site-name" exact to="/">
                            <img src={require("./img/credibank.png")} className="img-fluid" alt="Credibank Logo"/>
                        </NavLink>
                    </Col>
                    <Col md={{ size: 7, offset: 3 }}>
                        <Row className="text-uppercase text-right">
                            <Col md={{ size: 3, offset: 1 }}>
                                <p className="item">Directbank</p>
                            </Col>
                            <Col md="3">
                                <input className="input" type="text" placeholder="User code"></input>
                            </Col>
                            <Col md="3">
                                <p className="item">Individuals <i class="fas fa-chevron-down"></i></p>
                            </Col>
                            <Col md="2">
                                <p className="item">En <i class="fas fa-chevron-down"></i></p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
        <nav className="navbar navbar-expand-md navbar-gray">
            <div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <NavLink className="nav-link" exact to="/" activeClassName="selected">Credibank</NavLink>
                        </li>
                        <li className="nav-item active">
                            <NavLink className="nav-link" exact to="/apply" activeClassName="selected">Personal Credit Application</NavLink>
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
    </header>
  );
}

export default Header;
