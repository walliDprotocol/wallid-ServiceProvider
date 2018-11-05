import React from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Web3 from 'web3';
import Switch from "react-switch";
import WallidContract from '../wallid/wallid.js';
import { Link } from 'react-router-dom';
var CryptoJS = require("crypto-js");

var Spinner = require('react-spinkit');
const PASSWORD = "20THIS_WILL_USE_METAMASK_SECURITY18";

const state = {
  STATE_CARD_SELECT: 0,
  STATE_LOADING_DATA: 1,
  STATE_LOADING_DATA_FAIL: 2,
  STATE_ENCRYPTED_DATA: 3,
  STATE_DECRYPTED_DATA: 4,
  STATE_VERIFIED_DATA:  5,
  STATE_SUBMITED_DATA: 6
};

window.addEventListener('load', async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error(error)
    }
  }
})

window.addEventListener('reload', function () {
  if(typeof web3 !== 'undefined'){
    console.log("Using web3 detected from external source like Metamask")
    window.web3 = new Web3(window.web3.currentProvider)
  }else{
    console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    alert('No web3? You should consider trying MetaMask!')
  }
});

class ImportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: state['STATE_CARD_SELECT'],
      isUserLogged: 0,
      errorMsg: '',
      data: '',
      dataId: '',
      dataVerifyId: '',
      dataVerifyIdEncrypted: '',
      dataIdentityIdEncrypted: '',
      dataIdentityId: '',
      ContractAddress : '0x787e5fc4773cad0c45f287bf00daca402845b1b7',
      ContractInstance : null,
      password: PASSWORD,
      passwordCheck: PASSWORD,
      userWa: '',
      idt: '',
      isManualPassword : true,
      chiperPassword  : PASSWORD
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIdt = this.handleChangeIdt.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsePassword = this.handleUsePassword.bind(this);

    if(window.web3){
      console.log('*********************** window.web3 ********************');
      const MyContract = window.web3.eth.contract(WallidContract.abi)
      this.state.ContractInstance = MyContract.at(this.state.ContractAddress)

      // this.state.ContractInstance.countItemList( (err, data) => {
      //   console.log('Count items :  ', data);
      //   console.log('total items #', data.c[0] );
      // });
      var self = this
      window.web3.eth.getAccounts(function(err, accounts){

        if (err != null) {
          console.error("An error occurred: "+err);
          self.state.isUserLogged = 0;
        }
        else if (accounts.length === 0) {
          console.log("User is not logged in to MetaMask");
          self.state.isUserLogged = 0;
          alert('User logged out? Please login your account at metamask and refresh to try again!')
        }
        else {
          console.log("User is logged in to MetaMask");
          console.log(accounts[0]);
          self.state.userWa = accounts[0];
          self.state.isUserLogged = 1;
        }
      });

    }else {
      alert('No web3? You should consider trying MetaMask!')
    }
  }

  handleChange(event) {
    console.log("handleChange");
    console.log(event.target.name + event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleChangeIdt(event) {
    console.log("handleChangeIdt");
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleUsePassword(event){
    console.log('LOG ', this.state.isManualPassword);
    this.setState({ isManualPassword : event });
  }

  handleSubmit(event) {
    console.log("handleSubmit" + event);
    switch (this.state.step) {
      case state['STATE_ENCRYPTED_DATA']:
        this.getInfo();
      break;
      case state['STATE_DECRYPTED_DATA']:
        this.getVerify();
      break;
      case state['STATE_VERIFIED_DATA']:
        this.state.step = state['STATE_SUBMITED_DATA']
        this.forceUpdate()
      break;
      case state['STATE_CARD_SELECT']:

      if(this.state.isUserLogged == 0){
        alert('User logged out? Please login your account at metamask and refresh to try again!')
      }else{
        if(this.state.idt!=""){
          this.state.step = state['STATE_LOADING_DATA']
          this.forceUpdate()
          this.getInfoCrypted();
        }else{
          alert("Please select your Identity Type\n\n")
        }
      }

      break;
      default:
      break;
    }

    event.preventDefault();
  }

  handleErrors(response) {
    console.log("handleErrors");
    if (!response.ok) {
      console.log("response = ",response);
      console.log("response.status = ", response.status)
      alert("Error Verifying data\n\n",response.status)

      throw Error(response.status);
    }
    return response;
  }

  handleSucess(response) {
    console.log("handleSucess = ", this.state.step);
    console.log("response = ",response);

    switch (this.state.step) {

      case state['STATE_ENCRYPTED_DATA']:
      break;

      case state['STATE_DECRYPTED_DATA']:
        this.state.step = state['STATE_VERIFIED_DATA']
        this.forceUpdate()
      break;

      case state['STATE_VERIFIED_DATA']:
      break;

      default:
      break;
    }

    return;
  }

  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  getVerify()
  {
    console.log("******************** GetVerify *******************************");
    // TODO: verifyIdProviderUrl ??
    var verifyIdProviderUrl = "https://verifyid.caixamagica.pt/api/v1/data";

    var dataID = JSON.parse('{ "data":{"wa":"","idt":"","idtName":"","identityID":"","verifyID":""}}');

    dataID.data.wa = this.state.userWa;
    dataID.data.idt = this.state.idt;
    dataID.data.identityID = this.state.dataIdentityId;
    dataID.data.verifyID = this.state.dataVerifyId;

    console.log("dataID = ", JSON.stringify(dataID));
    //this.handleSucess();
    if(this.state.password === this.state.passwordCheck){
      console.log("call storeIdProvider: " + verifyIdProviderUrl);
        fetch(verifyIdProviderUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataID)
        })
        .then(response => this.handleErrors(response))
        .then(response => this.handleSucess(response) )
        .catch(error => {
          console.log(error)
          alert("VerifyID Service Fail")
        }
      );
    }else{
      alert("Password and comfirm password is not the same")
    }
  }

  getInfo()
  {
    console.log("******************** GetInfo *******************************");
    var loadData = [];
    var identifyId = {}
    var verifyId = {}

    try {
      var password = this.state.isManualPassword ? this.state.chiperPassword : this.state.password;
      console.log('Password to decrypt ', password)
      var bytes =  CryptoJS.AES.decrypt(this.state.dataIdentityIdEncrypted, password);
      var ret_1 = bytes.toString(CryptoJS.enc.Utf8);
      identifyId = JSON.parse(ret_1);

      bytes =  CryptoJS.AES.decrypt(this.state.dataVerifyIdEncrypted, password);
      ret_1 = bytes.toString(CryptoJS.enc.Utf8);
      verifyId = JSON.parse(ret_1);

      this.state.dataIdentityId = identifyId;
      this.state.dataVerifyId = verifyId;

      console.log('Identify ', identifyId);
      console.log(Object.keys(identifyId));

      for(var i in identifyId.identityAttributes){
        //console.log(i);
        //console.log(identifyId[i]);
        loadData.push({ 'item' : i, 'value' : identifyId.identityAttributes[i]})
      }

      for( i in identifyId.addressAttributes){
        //console.log(i);
        //console.log(identifyId[i]);
        loadData.push({ 'item' : i, 'value' : identifyId.addressAttributes[i]})
      }
      this.state.data = loadData
      this.state.step = state['STATE_DECRYPTED_DATA']

      this.forceUpdate()

    }
    catch(err) {
      console.log("error",err);
      alert("Decrypt fail! Try Again!")
    }
  }

  getInfoCrypted()
  {
    console.log("******************** GetInfoCrypted *******************************");
    console.log(this.state.idt);
    this.state.ContractInstance.getIdtDataVerified( this.state.idt, "123456789", (err, data) => {
      if(data){
        console.log('get Info Result ', data);
      }else{
        console.log('Operation fail');
        // TODO: Show popup about Operation fail
      }
    });

    this.state.ContractInstance.EventDataId((err, data) => {
      console.log('get event data ', data);
      console.log(data["address"]);
      console.log(data["args"]);
      var wallid = data["args"];
      console.log("IdentityId = " + wallid["identityId"]);
      console.log("Idt = " + this.hex2a(wallid["idt"]));
      console.log("VeridyId = " + wallid["veridyId"]);

      console.log("IdentityId hexa = " + this.hex2a(wallid["identityId"]));
      console.log("Idt hexa = " + this.hex2a(wallid["idt"]));
      console.log("VeridyId hexa = " + this.hex2a(wallid["veridyId"]));

      this.state.dataIdentityIdEncrypted = this.hex2a(wallid["identityId"]);
      this.state.idt = this.hex2a(wallid["idt"]);
      this.state.dataVerifyIdEncrypted = this.hex2a(wallid["veridyId"]);

      if(this.state.dataIdentityIdEncrypted === ""){
        this.state.errorMsg = "Wallet Not Registered in WalliD. Please create at myetherid.io!";
        console.log("Wallet Not Registered in WalliD. Please create at myetherid.io!");
        this.state.step = state['STATE_LOADING_DATA_FAIL'];
      }else if(this.state.dataVerifyIdEncrypted === "STOREID_FAIL"){
        this.state.errorMsg = "StoreId Fail. Wallet Not Registered. Please register again at myetherid.io!";
        console.log("StoreId Fail. Wallet Not Registered. Please register again at myetherid.io!");
        this.state.step = state['STATE_LOADING_DATA_FAIL'];
      }else{
        this.state.step = state['STATE_ENCRYPTED_DATA']
      }
      this.forceUpdate()

    });
    // Dummy data
    //  this.state.userWa = "0xE33C85c506F54fa369e7858bd698962fF8443A57"
    //  this.state.idt = "CC_PT"
    //  this.state.dataVerifyId = JSON.parse('{"walletSignature":"9a332b0e8796ac3806f373c4e5359f39067870c916e3e7d40f5cbb61e4921e0d762304f2f49ba6def16f0eeae97c3d03d7a516c786981d20a629e15f87ef2708b2db551f2c66883fc1032434f653a56b06e842ab67afad64053a9526ca00ca6d444ff9f28a74a8b22a4600699d261de371928679cc9efd693a3496493b437d3fff9bc356dc7cb26b903c29a5b1db508e0f3c55b5a58ed81db5b86e5494a1b8d6bd136bbc7402e4ac91ae227762c04486a7ac02213cf20a91b7de0e56f0b97a453abcc9e21d1d4d581a946bb9e8e7f07cced43891130050af3c7c8f20ec26a7ef5e0c2b30e0d9bf54625d97f0d5ca9ef44bf8653f23da9104e29c1cb06cb202b7","sod":"778209f4308209f006092a864886f70d010702a08209e1308209dd020103310f300d060960864801650304020105003081c20606678108010101a081b70481b43081b1020100300d0609608648016503040201050030819c302502010104207e626f57a12aa6b091174f88704d66f592dbf552b99986deceade117e7ba1d0d30250201020420370e3d556a71c4b05dc0f729fe1478b1ed13137c133ebb51bae1bf16d4e6dc4230250201030420a340dfdb4418595d1be9b5ec9cafed4cbfb42235147fc33c05ac4cdc8b238b8230250201040420edf2237357bdce583209a047f49960f7360dbd8503c9dd20598fcf3d0b73b85aa08206eb308206e7308204cfa00302010202085a0958da77e6c7a1300d06092a864886f70d01010b050030818e310b300906035504061302505431423040060355040a0c395343454520e280932053697374656d6120646520436572746966696361c3a7c3a36f20456c65637472c3b36e69636120646f2045737461646f3111300f060355040b0c08454345737461646f3128302606035504030c1f285465737465292043617274c3a36f206465204369646164c3a36f20303034301e170d3136313132353131343035395a170d3232303230373131343035395a3081da310b3009060355040613025054311c301a060355040a0c1343617274c3a36f206465204369646164c3a36f31293027060355040b0c205365727669c3a76f7320646f2043617274c3a36f206465204369646164c3a36f312d302b060355040b0c24456e74696461646520436572746966696361646f726120646520446f63756d656e746f733153305106035504030c4a2854657374652920456e74696461646520436572746966696361646f726120646520446f63756d656e746f7320646f2043617274c3a36f206465204369646164c3a36f2030303030313730820122300d06092a864886f70d01010105000382010f003082010a0282010100ea0d28fd9a4860a805fda732b0d4a14c37dd395db52b384b8eeada67058e50d1a716bafcb0fcb7f3b744157621826dd844e978654dfa2c395e5d79dd16e9a82578a789ff0ebeddfeca99b0c44285d896c0ffffe889cf3e6ba1a7d689664cfeebb07480aaf03c6e6ea48441adf28528dbf761fa98facec4e788e8143425fe143155498788b3a02536ca06a4c056548727feeea2471b7895afd6cafa9b51c7c30e625d14f99be1bcd13ccca3ab8fc393440ee67503eeaddffd6bcf6c27153b52361c9cb566502f2159d43371c984ae8edd698cb04ba81ee5099b0c14731f720ccc09dda0f5e4ba1b9d2c92646b8f5f7bb0a58fadc0403c74b9a25850e14ca941730203010001a38201f9308201f5305206082b0601050507010104463044304206082b060105050730018636687474703a2f2f6f6373702e726f6f742e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f6f637370301d0603551d0e04160414beb7c5bc7c7074137a4556e80c26fbb1bcbfd6f6300c0603551d130101ff04023000301f0603551d23041830168014951e3a50fa05909762063341bdae9a8b55fa14903081e10603551d200481d93081d6306c060a60846c01010102040007305e305c06082b060105050702011650687474703a2f2f706b692e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f706f6c6974696361732f6470632f63635f65635f6369646164616f5f6470632e68746d6c3066060b60846c01010102040001053057305506082b0601050507020230490c47687474703a2f2f706b692e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f706f6c6974696361732f70632f63635f4543445f70632e68746d6c305d0603551d1f045630543052a050a04e864c687474703a2f2f706b692e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f6c72632f63635f65635f6369646164616f5f63726c3030345f63726c2e63726c300e0603551d0f0101ff040403020780300d06092a864886f70d01010b0500038202010084e3fe5d222db6bc569130d6c30cb6625f1f64617ab896b96393e04de0ca5a19a084342ce6137697c039b63e265a8e7172b0a488bf744f7d1d890dd90d0476149b48d3c4b0b8c55f918dd6b17a939d97b9fa89a0c13acabf4da5e4ab2d4593f427a4b8f6312177782900cedb37c27b00e670ddba4617611973cb4721bbd98aab007cf2d3a526c1c3e968711953ac9ef57c4746d2198790e6a3d6621153c201440b9218f9bf418885f28fe65743936d79af098289679a6b12f682a09733f007f8fb1542f19077d199d9b7a3eb41cac9bb15366a11c7e7a506216d52b35fddd9af3a25ec28dd978f6c4f65e8da523eb4bf79807b3a0a79dfec3130c989397fcf2068ba55257e1312631c6aae3ea715e3c1ed298bd75cd7ac7161de2af0f52d40f41de21de6a7d8b21892ca24faf395122dbc2adbbf38020324d74b710dcb5dfce8850e9864f38dc33df4852140d344d2fd6b533d37cfb4903d610a193d8dd7602781e66917b7a7fff6a1d17ad90083673e13d8630175514833de0c62433272d54b872cd2d4d5e98435615495e367f842dddcfd989bcbf61cbacdee221d7555142f1508bf1bbf9abfb7153bb02d0df0234a5ef28239b72f79b5ba85b4581f7f32ef4ad35be03dc04b4240a6208dcf30ddd7991399df4cf67eaa386fb68752bf7d1b36c16afc7d5a4d80083e8c952511d557c785437d66b2be566fb5ac19b485196e318202113082020d02010130819b30818e310b300906035504061302505431423040060355040a0c395343454520e280932053697374656d6120646520436572746966696361c3a7c3a36f20456c65637472c3b36e69636120646f2045737461646f3111300f060355040b0c08454345737461646f3128302606035504030c1f285465737465292043617274c3a36f206465204369646164c3a36f2030303402085a0958da77e6c7a1300d06096086480165030402010500a048301506092a864886f70d01090331080606678108010101302f06092a864886f70d01090431220420d3f2bded95485b10f14e8fb2d4ab8d0acbfda103a5b706abe2fbe9ffe40e4bb1300d06092a864886f70d01010b050004820100812e2a7b4460a3d5e18f8415627cbd7ef47b6deb15bb7c2009e0a62e9b3a463db9a7f872d053a258ee338df1f914918b09dc696b7497b32d92a4667b3ca8ec0db6889502a75f657bac290a7de459b1a27b754cc31abbd5a282bec140a381a716a2b6606fde5f9137a1b28b72632a7f50e561ecf115dc0e8fee90e7c400f1dcad53bbb8022d8ee41a3d061ca4fa8ab5182b614c26a58d25a1d1fc74e0ac596cafbd73feda9e314284855e75b4669c8adafd678810fe85b001a3fa12a231f240c16b1094d4a28d10cfff755d0c74e0d1662f6195071d1149ce7339ab00f0a3188446a445b3d57dbea0f6f95b4cb1ee0b953c4452df053e8fc16753e54114702aa3", "certificate":"308207bf308206a7a003020102020830c0fc1e94f40895300d06092a864886f70d01010b0500308184310b3009060355040613025054311c301a060355040a0c1343617274c3a36f206465204369646164c3a36f31143012060355040b0c0b737562454345737461646f3141303f06035504030c382854657374652920454320646520417574656e74696361c3a7c3a36f20646f2043617274c3a36f206465204369646164c3a36f2030303133301e170d3136313232373136303931335a170d3231313232363233353935395a3081c4310b3009060355040613025054311c301a060355040a0c1343617274c3a36f206465204369646164c3a36f311c301a060355040b0c134369646164c3a36f20506f7274756775c3aa73312b3029060355040b0c222854657374652920417574656e74696361c3a7c3a36f20646f204369646164c3a36f310e300c06035504040c0553494c5641310f300d060355042a0c064d414e55454c311430120603550405130b42493030303030363330303115301306035504030c0c4d414e55454c2053494c564130820122300d06092a864886f70d01010105000382010f003082010a0282010100d17ef7dbc160c08d75830ec62026feaf4212726a5b108f43d8d6701e13e89b19414dd4e32f5938f944065df7ce3c1cd639c8fb907c6304ef96f212743c658f6b1653644b4a6a2bd3f1966052a152c38ba201b93b2060f4035e2a87ebd2be17e788801aba891994621a2ce4d943a5288f6d98699f028af383033068ba7417bf90f12fbb04ff520de072874e768f13951f23b15d17c315b951ca527d3415eddf38062080295387db27bcd3493016d86973a3a1ad1beced324b65abb4cd678bdbd5e44a49ed7406f1f066ec04c2b2872866cd75440e0d41a2a208dad7a6bf7b4fe1e41a20d162c6cf203a1d12926aa095ac215aa6d9abded6d7959ab6b605f618d30203010001a38203f1308203ed300c0603551d130101ff04023000300e0603551d0f0101ff040403020388301d0603551d0e04160414d60643757080bb3000ce18395f0cfee0bfba8d81301f0603551d23041830168014c46c0e7cb0924d45b41d750afcff317ca60ef3b63082020f0603551d2004820206308202023081c8060860846c01010102143081bb3081b806082b060105050702023081ab1e81a8004f00200063006500720074006900660069006300610064006f00200065006d0069007400690064006f00200073006500670075006e0064006f0020006500730074006100200070006f006c00ed0074006900630061002000e90020007500740069006c0069007a00610064006f0020007000610072006100200061007500740065006e007400690063006100e700e3006f00200064006f00200043006900640061006400e3006f307e060b60846c0101010204020007306f306d06082b060105050702011661687474703a2f2f706b692e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f706f6c6974696361732f6470632f63635f7375622d65635f6369646164616f5f617574656e7469636163616f5f6470632e68746d6c3036060860846c010101020a302a302806082b06010505070201161c687474703a2f2f7777772e736365652e676f762e70742f7063657274307d060c60846c010101020402000101306d306b06082b06010505070201165f687474703a2f2f706b692e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f706f6c6974696361732f70632f63635f7375622d65635f6369646164616f5f617574656e7469636163616f5f70632e68746d6c30710603551d1f046a30683066a064a0628660687474703a2f2f706b692e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f6c72632f63635f7375622d65635f6369646164616f5f617574656e7469636163616f5f63726c303031335f70303030312e63726c30770603551d2e0470306e306ca06aa0688666687474703a2f2f706b692e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f6c72632f63635f7375622d65635f6369646164616f5f617574656e7469636163616f5f63726c303031335f64656c74615f70303030312e63726c305106082b0601050507010104453043304106082b060105050730018635687474703a2f2f6f6373702e6175632e74657374652e63617274616f64656369646164616f2e70742f7075626c69636f2f6f637370301106096086480186f84201010404030200a030280603551d090421301f301d06082b060105050709013111180f31393830313031303132303030305a300d06092a864886f70d01010b0500038201010060ad7c2dfc466dcabe2b41db866d9943b6c8731c6525267c682d5598c036c468dd663f696efb32e4d548b6ea07f570f50eccaac6e6928ef282f214245193255fc985497637b42dc8cf3cf62230cf074579977bffe3e0e31878087e096d089cc99713b1dff37c1562d764ff8921f0e7c91462029b09a777eaad845dd7cba9dfd6ff13e25d7554e6feb352eaa931b991bd9cd7b8193809dc9ecdb0bdf84c6d7c68cf3ab8e0ba1302e8fa996d34647d2b0cd2e9661b7698d9aa3a6b6c8e45af056c5d0982d3f21233f010506db7bf179d878bde83987ad0e4421e9764eae59fd5a70ca0721fcb584380ba6b2b984e5a5dbc721773ce5defbe26a6ec76a05c3a99b5"}');
    //  this.state.dataIdentityIdEncrypted="U2FsdGVkX18+wNWJ0tydZM26vW1mZSLHzeouCNlljYMDnbMI/eKOZu93FwJGoH+g8X3ZyRLPWsY/S0L+BVDDxBIOuxWuoSo+aS/bmtW/zE9Lrz9dhVdD+gxZejQpRMUHe3blUKyrtqrgmyZKRgeKqenK4Xl3TEtOWbMetdcAbCjhG2tN2UR2sAiy6bEMP4YttIcjoCILdRz9BM5gumQQqw9YcD5OwPLzzxW1tqELPBpjIV7Bw8koC4XdEl7pB+srjbkEH5Y5F3khZFAF+Pmi6TEbd4VrVAQrKvvUHo16GHK9QEmFRePF11tO410IIVGnSjn3QW6q6uvYwBxNbq6wFu+4dEc5W2IKSl2BDWakrKPwM9wKNwNsK7zULko30JeEXkq6oxt4fjxHnjHQtXi+5WhuPC3s2tWyhjWB1q7kadSyYnUouK0+ybS/7nEnBkR/0TA3q+CvWj/vhMcjRRXOvcBRWeCPbvf4Mo4OAYpcsh54zbd0XRWsL1hYdo9H0qDaKCxe1H13LXTybeXO01QDS80Uab5fWVfOd7A2L5ckxcN3Xc0OMRaGuT3x0yGUCtvXteZExXeYdG39xtaafT1YSvra4PCYf/Y7Vntl9JJtFVh7W9V/YPfj9BKVpzOJTi49p5SFchUNR6KgbYCCk3dXiF/4KcqcRtV2MZR8zSxgqKDRi700X7WXVIeFN/C7d40CXhQ/1SWRFxz5BHCkSQIkcYjqIDQfz1lbQOkUmOnTjDLBrf0XEANXBo1EU2xhtEyJ4IyuBH8OZro+MZSgcrwQdN3rxCRGpVRQYx23BWbo/T0zdo6U4WosfrILuNcnOtnkiulKnMqvjvyWeABxPlxWsdtNzTh2mY5HLF+jdL1QPdOYvq8+/M+x+g1FuUqUNtkFTtbmCp0DQJFDh8mqo60RH/Z/7wNi/D9DBL4ieEocNrOxjJRf/vFdZrbPTaKXsS2jtAxmUZ3qnHNtzNjOJrzYLSKT2R2LlBziH8hFHfV6gBHp7ORre/HS+vrVq2d8EhKsOx58iuukMEjfZxYOGzxelq6e3H/14GPXmadVJtxScTyoHM5GdcEsrUPOLdAcWfgz7OWOByTPwiPQi2Fqa+g2FV7eYiQvKhPmcqIJJTLQDTY9MYlkDZI7nDQW5Knm1bqNcq0a6+ixEJkc9QExrQtoxN8N9qVKgv9TU85TQDamU45f2Joj9VpnWJUaIP9saaI0EiBTzsymJSWDO7N6VkL0zlhlp3QON4TqG8YoapXDmqCo3iAxe9RxSO0kvZ3AWlRStjaYmCOew6Tjau6Jb6aOrw4ThiGXtkHVaEtkzIQWBHNliLrry74O9MPTDU0i3KcxhIhkYpR0clp3qLbdy4DHjaEhOPnjx3e8r72icRIX+36LnjMeJfjob/mKx5bnXQDtEp+GPgikrFihGeI4PCwX58hQ3Wh6Vjzhd1GRf2fTZhn0O0SuqJhQz20xbgFo7WGVa9uFTHJcvnjDsybxRbp/ILYk8vwmWovLVEV4CF918dFFMhBryUYbmsW2cXt868MsCEJnQ8/vqSLlmVBKrahW7U7P4xMJ0v3q9ijvR//yxibNY4hGuTHdh+/M4AlUCtS0r06GVpBShMyuiKg6R5FjTDQvKL9tpI9sZgqGw/W5tUqwnLFLFW+51UC5RX+Y53G6/uubDI4esZixBS0UZvTbw0ukWgrMD9tyaTvbkJ4SwBKfZ0mzDzhyr8nnLr9UfuCz9ziAk4sbuwiKLM3pBkOZ5bSiLKQOHzw3CBUutaWVjA4sHegkC4Hy7TP2effGHYfN4TMZU1feQvaToYD46KpAJ/6mU8t7LCIx+alkHJEf4bk="
    // this.state.step = state['STATE_ENCRYPTED_DATA']
    // this.forceUpdate()
  }

  render() {
    if(window.web3){
      switch (this.state.step) {
        case state['STATE_CARD_SELECT']:
        return (
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-8 headerTextImportId">
                <h2>
                  Step 2 - Load your identity
                </h2>
              </div>
            </div>
            <form onSubmit={this.handleSubmit} >
              <div class="form-group">
                <br />
                <label className="text-white">
                  Select StoreID Provider:
                </label>
                <select class="form-control" required>
                  <option disabled="disabled" selected="selected">Select an valid StoreID Provider</option>
                  <option>CaixaMagica@StoreID</option>
                </select>
                <label className="text-white">
                  Select identity type:
                </label>
                <select class="form-control"
                  required
                  name="idt"
                  onChange={this.handleChangeIdt}>
                  <option disabled="disabled" selected="selected">Select an valid identity</option>
                  <option value="CC_PT">Cartão de Cidadão - República Portuguesa</option>
                  <option value="CC_PT_TST">Cartão de Cidadão TST - República Portuguesa</option>
                </select>
                <p>
                  To prove your identity connect with metamask
                </p>
                <input
                  type="submit"
                  value="Connect with metamask"
                  className="btn btn-block btn-lg btnStyle btnMetaMask" />
                <p className="text-center">
                  <a className="text-white" href="https://metamask.io/">
                    what it means?
                  </a>
                </p>
              </div>
            </form>
          </div>
        );
        case state['STATE_LOADING_DATA']:
        return (
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-8 headerTextImportId">
                <h2>
                  Step 3 - Loading data from the blockchain
                </h2>
              </div>
            </div>
            <br />
            <div align="center">
              <h2>
                Please wait....
              </h2>
              <Spinner name="wandering-cubes" color="orange"/>
            </div>
            <br />
          </div>
        );
        case state['STATE_LOADING_DATA_FAIL']:
        return (
          <div>
            <form>
              <div class="form-group">
                <div className="row">
                  <div className="col-sm-12 col-md-8 headerTextImportId">
                    <h2>
                      We are sorry.
                    </h2>
                  </div>
                </div>
                <p>Loading data from the blockchain fail!</p>
                <p>{this.state.errorMsg}</p>
              </div>
            </form>
          </div>
        );
        case state['STATE_ENCRYPTED_DATA']:
        return (
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-8 headerTextImportId">
                <h2>
                  Step 3 - Decrypt your data Locally
                </h2>
              </div>
            </div>
            <div class="row justify-content-start">
              <div class="col-sm-12 col-md-12">
                <form onSubmit={this.handleSubmit} >
                  <div class="form-group">
                    <br />
                    <label className="text-white">
                      Your encrypted data:
                    </label>
                    <textarea
                      readOnly
                      rows="5"
                      value={this.state.dataIdentityIdEncrypted}
                      type="text"
                      name="EncryptedData"
                      class="form-control"
                      />
                    </div>
                    <div class="form-group">
                      <br />
                      <label className="text-white">
                        Your verifyId data encrypted:
                      </label>
                      <textarea
                        readOnly
                        rows="5"
                        value={this.state.dataVerifyIdEncrypted}
                        type="text"
                        name="EncryptedData"
                        class="form-control"
                        />
                  </div>
                  <div className="disclaimer">
                    <br/>
                    <div className="form-inline">
                      <div>
                      <p><strong> Disclaimer: </strong> Current Metamask build doesn't support the features do encrypt data with users'private keys. It will be available as soon. you can encrypt your ID data with a password of your choice <strong>(recommended action)</strong>  Otherwise you can choose to allow MyEtheriD to encrypt your ID data with a default password (We do not recommend this action)</p>
                      </div>
                      <Switch
                        onChange={this.handleUsePassword}
                        checked={this.state.isManualPassword}
                        id="normal-switch"
                      />
                    </div>
                    <div className="form-inline"  hidden={ !this.state.isManualPassword ?  true : false }>
                      <label className="text-white">
                        Password : 	&nbsp;	&nbsp;
                      </label>

                      <input
                        style={{width: "300px"}}
                        hidden={ !this.state.isManualPassword ?  true : false }
                        id="chiperPassword"
                        name="chiperPassword"
                        onChange={this.handleChange}
                        className="form-control"
                        type="password"
                        placeholder="Insert password to decrypt your data"
                        required={this.state.isManualPassword ?  true : false }
                        >
                      </input>
                    </div>

                  </div>
                  <br/>
                  <div class="form-group">
                    <input
                      type="submit"
                      value="Decrypt ID"
                      className="btn btn-block btn-lg btnStyle btnNext" />
                    <p className="text-center">
                      <a className="text-white" href="https://metamask.io/">
                        what it means?
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
        case state['STATE_DECRYPTED_DATA']:
        return (
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-8 headerTextImportId">
                <h2>
                  Step 4 - Verify your data
                </h2>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">

                <div class="form-group">
                  <br />
                  <label className="text-white">
                    Your encrypted data:
                  </label>
                  <textarea
                    readOnly
                    rows="10"
                    value={this.state.dataIdentityIdEncrypted}
                    type="text"
                    name="EncryptedData"
                    class="form-control"
                    />
                  <div class="form-group">
                  </div>
                  <br />
                    <label className="text-white">
                      Your verifyId data:
                    </label>
                    <textarea
                      readOnly
                      rows="10"
                      value={JSON.stringify(this.state.dataVerifyId)}
                      type="text"
                      name="EncryptedData"
                      class="form-control"
                      />
                </div>
              </div>
              <div class="col-sm">
                <br />
                <label className="text-white">
                  Your decrypted data:
                </label>
                <BootstrapTable
                  data={this.state.data}
                  hover
                  condensed
                  pagination
                  className="text-white"
                  >
                  <TableHeaderColumn
                    dataField="item"
                    width='50%'
                    className="text-white"
                    isKey={true}>Item</TableHeaderColumn>
                  <TableHeaderColumn dataField="value" className="text-white" width='50%'>Value</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
            <form onSubmit={this.handleSubmit} >
              <div class="form-group">
                <input
                  type="submit"
                  value="Verify ID"
                  className="btn btn-block btn-lg btnStyle btnNext" />
                <p class="text-center">
                  <a className="text-white" href="https://metamask.io/">
                    what it means?
                  </a>
                </p>
              </div>
            </form>
          </div>
        );
        case state['STATE_VERIFIED_DATA']:
        return (
          <div>
              <div class="form-group">
                <div className="row">
                  <div className="col-sm-12 col-md-8 headerTextImportId">
                    <h2>
                      Step 5 - Submit your application
                    </h2>
                  </div>
                </div>
                <p>
                  Your identity attributes were successfully verified by Wallid.
                </p>
                <p>
                  You can now submit your application to personal credit with Credibank.
                </p>
              </div>
              <form onSubmit={this.handleSubmit} >
                <div class="form-group">
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-block btn-lg btnStyle btnNext" />
                  <p className="text-center">
                    <a className="text-white" href="https://metamask.io/">
                      what it means?
                    </a>
                  </p>
                </div>
              </form>
            </div>
          );
          case state['STATE_SUBMITED_DATA']:
          return (
            <div>
              <form>
                <div class="form-group">
                  <div className="row">
                    <div className="col-sm-12 col-md-8 headerTextImportId">
                      <h2>
                        Thank you
                      </h2>
                    </div>
                  </div>
                  <p>Thank you for applying to a personal credit with CrediBank.</p>
                  <p>We sent you our official proposal to your email.</p>
                  <p>
                    You can now submit your application to personal credit with Credibank.
                  </p>
                </div>
              </form>
            </div>
          );
          default:
          break;
        }
      }else{
        return (
          <div>
            <p>
              No MetaMask detected.
            </p>
            <p>
              To prove your identity connect with metamask.
            </p>
            <p>
              <a href="https://metamask.io/">
                What is Metamask?
              </a>
            </p>
            <p>
              <a href="https://metamask.io/">
                Download Metamask?
              </a>
            </p>
          </div>
        );
      }
    }
  }

  export default ImportForm;
