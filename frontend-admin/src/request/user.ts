import BigNumber from 'bignumber.js';
import FileDownload from 'js-file-download'
import _ from 'lodash';
import { BaseRequest } from "./Request";
import { apiRoute } from "../utils";
const queryString = require('query-string');

export const getUserList = async (queryParams: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users`);
  url += '?' + queryString.stringify(queryParams);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};

export const exportUserList = async (queryParams: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/export-user-list`);

  const response = await baseRequest.post(url, queryParams || {}) as any;
  const resObject = await response.json();

  return resObject;
}

export const exportSnapshotWhiteList = async (queryParams: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/export-whitelist`);
  const response = await baseRequest.post(url, queryParams || {}) as any;
  const resObject = await response.json();

  return resObject;
}

export const downloadUserList = async (fileId: number, fileName: string) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/download/${fileId}`);
  const fileData = await baseRequest.postDownload(url, {}) as any;
  FileDownload(fileData, fileName);
}

export const getFileExportList = async (params: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users/export-files`);
  url += '?' + queryString.stringify(params);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
}