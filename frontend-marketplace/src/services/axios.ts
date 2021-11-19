import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default instance;

export const HeadersSignature = {
  headers: {
    msgSignature: process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE
  }
}