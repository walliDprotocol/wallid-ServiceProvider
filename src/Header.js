import React from 'react';

function Header(/*props*/) {
  return (
    <header>
        <div className="row justify-content-center topbar">
            <div className="col-9">
                <div className="row">
                    <div className="col-2">
                        <a className="site-name" href="https://wallid.io/pilotidvalidation/#/">
                            <img src={require("./img/credibank.png")} className="img-fluid" alt="Credibank Logo"/>
                        </a>
                    </div>
                    <div className="col-7 offset-3">
                        <div className="row text-uppercase text-right">
                            <div className="col-3 offset-1">
                                <p className="item">Directbank</p>
                            </div>
                            <div className="col-3">
                                <input className="input" type="text" placeholder="User code"></input>
                            </div>
                            <div className="col-3">
                                <p className="item">Individuals <i class="fas fa-chevron-down"></i></p>
                            </div>
                            <div className="col-2">
                                <p className="item">En <i class="fas fa-chevron-down"></i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav className="navbar navbar-expand-md navbar-gray">
            <div>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="https://wallid.io/pilotidvalidation/#/" target="_self">Credibank</a>
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
    </header>
  );
}

export default Header;
