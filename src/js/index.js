import store from "../js/store/index";
import { setYourPurpose } from "./actions/index";
import { setCreditState } from "./actions/index";
import { getCreditState } from "./actions/index";
window.store = store;
window.setYourPurpose = setYourPurpose;
window.setCreditState = setCreditState;
window.getCreditState = getCreditState;
