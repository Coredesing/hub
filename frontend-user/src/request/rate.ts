import {BaseRequest} from "./Request";
import {apiRoute, routeWithPrefix} from "../utils";

const queryString = require('query-string');

export const getRateSettings = async (queryParams: any = {}) => {
  const baseRequest = new BaseRequest();
  let url = '/get-rate-setting';
  url += '?' + queryString.stringify(queryParams);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();

  return resObject;
};
