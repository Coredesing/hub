import { getContractInstance } from '../services/web3';
import erc20ABI from '../abi/Erc20.json';
import erc721ABI from '../abi/Erc721.json';
import ethLinkABI from '../abi/Ethlink.json';
import {TOKEN_TYPE} from "../constants";

const ETH_LINK_DEFAULT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_ETHLINK_ADDRESS || "";

export type TokenType =  {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  token_type: string;
};

type ReturnType = TokenType | undefined;

export const getTokenInfo = async (tokenAddress: string, token_type: string = 'erc20'): Promise<ReturnType> => {
    try {
      let token = getContractInstance(erc20ABI, tokenAddress);
      if (token_type === TOKEN_TYPE.ERC721) {
        token = getContractInstance(erc721ABI, tokenAddress);
      }

      if (!token) {
        throw new Error("Token address is invalid.")
      }

      const tokenName = token.methods.name().call();
      const tokenSymbol = token.methods.symbol().call();

      const res = await Promise.all([tokenName, tokenSymbol]);

      switch (token_type) {
        case TOKEN_TYPE.ERC721:
          return {
            name: res[0],
            symbol: res[1],
            decimals: 0,
            address: tokenAddress,
            token_type: TOKEN_TYPE.ERC721,
          }
        default:
          const tokenDecimals = await token.methods.decimals().call();

          return {
            name: res[0],
            symbol: res[1],
            decimals: tokenDecimals,
            address: tokenAddress,
            token_type: TOKEN_TYPE.ERC20,
          }
      }
    } catch (err: any) {
      throw new Error("Token address is invalid." +  err.message);
    };
}

export const tokenAlreadyUsed = async (tokenAddress: string): Promise<boolean> => {
  try {
    const ethLinkContract = getContractInstance(ethLinkABI, ETH_LINK_DEFAULT_ADDRESS);

    if (ethLinkContract) {
      const tokenRegistered = await ethLinkContract.methods.tokens(tokenAddress).call();

      if (Number(tokenRegistered.registeredBy) === 0) return false;

      return Number(tokenRegistered.registeredBy) > 0;
    }

  } catch (err: any) {
    console.log(err?.message);
    return true;
  }

  return false;
}

export const getShortTokenSymbol = (tokenSymbol: string, yourLength = 10) => {
  if (!tokenSymbol) tokenSymbol += '';
  if (tokenSymbol.length <= yourLength) {
    return tokenSymbol;
  }

  return `${tokenSymbol.substring(0, 10)}...`;
};
