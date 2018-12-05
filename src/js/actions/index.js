// src/js/actions/index.js
import { SET_YOUR_PURPOSE } from "../constants/action-types";
import { SET_CREDIT_STATE } from "../constants/action-types";
import { GET_CREDIT_STATE } from "../constants/action-types";
import { SET_IDT } from "../constants/action-types";
import { GET_IDT } from "../constants/action-types";
import { GET_OPID } from "../constants/action-types";
import { SET_OPID } from "../constants/action-types";
import { GET_IDENTITY_ID_ENCRYPTED } from "../constants/action-types";
import { SET_IDENTITY_ID_ENCRYPTED } from "../constants/action-types";
import { GET_VERIFY_ID_ENCRYPTED } from "../constants/action-types";
import { SET_VERIFY_ID_ENCRYPTED } from "../constants/action-types";
import { GET_DATA_IDENTITY_ID } from "../constants/action-types";
import { SET_DATA_IDENTITY_ID } from "../constants/action-types";
import { GET_DATA_VERIFY_ID } from "../constants/action-types";
import { SET_DATA_VERIFY_ID } from "../constants/action-types";
import { GET_DATA } from "../constants/action-types";
import { SET_DATA } from "../constants/action-types";

export const setYourPurpose = yourPurpose => ({
  type: SET_YOUR_PURPOSE,
  payload: yourPurpose
});
export const setCreditState = creditState => ({
  type: SET_CREDIT_STATE,
  payload: creditState
});
export const getCreditState = creditState => ({
  type: GET_CREDIT_STATE,
  payload: creditState
});
export const setIdt = idt => ({ type: SET_IDT, payload: idt });
export const getIdt = idt => ({ type: GET_IDT, payload: idt });
export const setOPID = opid => ({ type: SET_OPID, payload: opid });
export const getOPID = opid => ({ type: GET_OPID, payload: opid });

export const setIdentityIdEncrypted = dataIdentityIdEncrypted => ({
  type: SET_IDENTITY_ID_ENCRYPTED,
  payload: dataIdentityIdEncrypted
});
export const getIdentityIdEncrypted = dataIdentityIdEncrypted => ({
  type: GET_IDENTITY_ID_ENCRYPTED,
  payload: dataIdentityIdEncrypted
});
export const setVerifyIdEncrypted = dataVerifyIdEncrypted => ({
  type: SET_VERIFY_ID_ENCRYPTED,
  payload: dataVerifyIdEncrypted
});
export const getVerifyIdEncrypted = dataVerifyIdEncrypted => ({
  type: GET_VERIFY_ID_ENCRYPTED,
  payload: dataVerifyIdEncrypted
});

export const setDataIdentityId = dataIdentityId => ({
  type: SET_DATA_IDENTITY_ID,
  payload: dataIdentityId
});
export const getDataIdentityId = dataIdentityId => ({
  type: GET_DATA_IDENTITY_ID,
  payload: dataIdentityId
});
export const setDataVerifyId = dataVerifyId => ({
  type: SET_DATA_VERIFY_ID,
  payload: dataVerifyId
});
export const getDataVerifyId = dataVerifyId => ({
  type: GET_DATA_VERIFY_ID,
  payload: dataVerifyId
});

export const setData = data => ({ type: SET_DATA, payload: data });
export const getData = data => ({ type: GET_DATA, payload: data });
