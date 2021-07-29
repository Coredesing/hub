import BigNumber from 'bignumber.js';
import _ from 'lodash';
import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";
const queryString = require('query-string');

export const getUserList = async (queryParams: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/users`);
  url += '?' + queryString.stringify(queryParams);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};