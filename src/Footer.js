import React from 'react';

function Footer(/*props*/) {
  return (
    <footer className="bg-navy">
    <div class="row justify-content-center">
        <div class="col-10">
          <div className="row">
            <div className="col-3">
                <img src={require('./img/credibank-white.png')} className="img-fluid" alt="Logo Wallid"/>
            </div>
            <div className="col-9">
              <div className="row">
                <div className="col-3">
                  <p className="footer-menu">Pricing</p>
                  <p className="footer-menu">Security</p>
                  <p className="footer-menu">Promoters</p>
                  <p className="footer-menu">Distance Bank</p>
                </div>
                <div className="col-3 offset-1">
                  <p className="footer-menu">Legal information</p>
                  <p className="footer-menu">Credit agreements</p>
                  <p className="footer-menu">Main doc. information</p>
                  <p className="footer-menu">Corporative web</p>
                </div>
                <div className="col-3 offset-2">
                  <p className="footer-menu">Privacy</p>
                  <p className="footer-menu">About credibank</p>
                  <p className="footer-menu">Glossary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <hr></hr>
          <p className="copyright">CrediBank ©2018 All rights reserved</p>
        </div>
    </div>
    </footer>
  );
}

export default Footer;
