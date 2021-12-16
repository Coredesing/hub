import {BaseRequest} from "./Request";
import {apiRoute} from "../utils";

export const createCollection = async (data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute('/collections/create');

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const updateCollection = async (id: any, data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/collections/${id}`);

  const response = await baseRequest.post(url, data) as any;
  const resObject = await response.json();
  return resObject;
};

export const getCollectionDetail = async (id: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/collections/${id}`);

  const response = await baseRequest.get(url) as any;
  const resObject = await response.json();
  return resObject;
};

export const changeDisplayStatus = async (id: any, data: any) => {
  const baseRequest = new BaseRequest();
  let url = apiRoute(`/collections/change-display/${id}`);

  const response = await baseRequest.post(url, {
    is_show: data,
  }) as any;

  const resObject = await response.json();
  return resObject;
};