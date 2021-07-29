import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";

const queryString = require('query-string');

export const getKycUserList = async (queryParams: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/kyc-users`);
  url += '?' + queryString.stringify(queryParams);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const getKycUserDetail = async (id: number | string) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/kyc-users/${id}`);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const updateKycUser = async (id: number | string, data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/kyc-users/${id}`);
  const response = await baseRequest.put(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

export const createKycUser = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/kyc-users`);

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();

  return resObject;
};

export const changeIsKycStatus = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/kyc-users/${data.userId}/change-kyc`);

  const response = await baseRequest.put(url, {
    is_kyc: data.isKyc,
  }) as any;

  const resObject = await response.json();
  return resObject;
};
