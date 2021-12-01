import { getContractInstance } from '../services/web3';
import erc20ABI from '../abi/Erc20.json';

export type TokenType =  {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
};

type ReturnType = TokenType | undefined;

export const getTokenInfo = async (tokenAddress: string): Promise<ReturnType> => {
    try {
      const erc20Token = getContractInstance(erc20ABI, tokenAddress);

      if (erc20Token) {
        const tokenName = erc20Token.methods.name().call();
        const tokenSymbol = erc20Token.methods.symbol().call();
        const tokenDecimals = erc20Token.methods.decimals().call();

        const res = await Promise.all([tokenName, tokenSymbol, tokenDecimals]);

        return {
          name: res[0],
          symbol: res[1],
          decimals: res[2],
          address: tokenAddress
        }
      };
    } catch (e) {
      throw new Error("Token address is invalid.");
    };
}
