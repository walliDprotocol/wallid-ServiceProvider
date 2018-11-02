import React from 'react';

function Footer(/*props*/) {
  return (
    <footer className="p-5 bg-black">
    <div class="text-center">
        <img src={require('./img/wallid-logo.png')} class="img-fluid footerImg" alt="Logo Wallid"/>
    </div>

    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-3 mt-5">
            <p>Join the conversation</p>
            <div class="footerContent row">
                <div class="col-3">
                    <div>
                        <a href="https://github.com/walliDprotocol" target="_blank">
                            <img src={require('./img/github.png')} class="img-fluid socialMedia mt-2" alt="Github"/>
                        </a>
                    </div>
                </div>
                <div class="col-3">
                    <div>
                        <a href="" target="_blank">
                            <img src={require('./img/twitter.png')} class="img-fluid socialMedia mt-2" alt="Twitter"/>
                        </a>
                    </div>
                </div>
                <div class="col-3">
                    <div>
                        <a href="" target="_blank">
                            <img src={require('./img/medium.png')} class="img-fluid socialMedia mt-2" alt="Medium"/>
                        </a>
                    </div>
                </div>
                <div class="col-3">
                    <div>
                        <a href="" target="_blank">
                            <img src={require('./img/telegram.png')} class="img-fluid socialMedia mt-2" alt="Telegram"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-sm-12 col-md-6 col-lg-4 mt-5">
            <p>Stay updated</p>
            <div class="input-group footerContent mb-3 mt-3">
                <input type="text" class="form-control input-form" placeholder="name@email.com" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                <div class="input-group-append">
                <button class="btn btn-block btn-lg btnStyle" type="button">Subscribe</button>
                </div>
            </div>
        </div>

        <div class="col-sm-12 col-md-12 col-lg-5 mt-5">
            <p>More about WalliD</p>
            <div class="row footerContent mt-3">
                <div class="col-sm-12 col-md-3 col-lg-3 mt-2">
                    <div>
                        <a href="https://wallid.io/">Solution
                            <span class="sr-only">(current)</span>
                        </a>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 mt-2">
                    <div>
                        <a href="https://wallid.io/importid.html" target="_blank">
                            ImportiD
                        </a>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 mt-2">
                    <div>
                        <a href="https://myetherid.io" target="_blank">
                            MyEtheriD
                        </a>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 mt-2">
                    <div>
                        <a href="javascript:window.scrollTo(0,document.body.scrollHeight);">
                            Talk to us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </footer>
  );
}

export default Footer;
