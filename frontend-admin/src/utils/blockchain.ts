import _ from "lodash";
import moment from "moment";
import BigNumber from 'bignumber.js';
import {getContractInstance, getWeb3Instance} from "../services/web3";
import campaignABI from "../abi/Swap/Campaign.json";
import erc20ABI from "../abi/Erc20.json";
import {convertUnixTimeToDateTime} from "./convertDate";

const ETH_LINK_DEFAULT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_ETHLINK_ADDRESS || "";
const USDT_LINK_DEFAULT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_USDT_ADDRESS || "";

export const getPoolBlockchainInfo = async (loginUser: any, params: any): Promise<any> => {
  const campaignHash = params.campaign_hash;
  const web3Instance = getWeb3Instance();
  const campaignContract = getContractInstance(campaignABI, campaignHash);

  if (web3Instance && campaignContract) {
    // Check if this campaign is owned by this account
    const userWalletAddress = loginUser.wallet_address;
    const campaignOwner = await campaignContract.methods.owner().call();
    let isCampaignOwner = campaignOwner === userWalletAddress;

    // Get All information of selected campaign
    const title = campaignContract.methods.name().call();
    const fundingWallet = campaignContract.methods.fundingWallet().call();
    const tokenSold = campaignContract.methods.tokenSold().call();
    const weiRaised = campaignContract.methods.weiRaised().call();
    const startTime = campaignContract.methods.openTime().call();
    const closeTime = campaignContract.methods.closeTime().call();
    const token = campaignContract.methods.token().call();
    const owner = campaignContract.methods.owner().call();
    const isSuspend = campaignContract.methods.paused().call();
    const etherRate =  campaignContract.methods.getEtherConversionRate().call();
    const etherConversionRateDecimals = campaignContract.methods.getEtherConversionRateDecimals().call();
    const ethLink = "0x00";
    const erc20ConversionRate = campaignContract.methods.getErc20TokenConversionRate(USDT_LINK_DEFAULT_ADDRESS).call();

    // const releaseTime = campaignContract.methods.releaseTime().call();
    // const isClaimable = campaignContract.methods.isClaimable().call();
    // const claimableTokens = campaignContract.methods.getClaimableTokens(userWalletAddress).call();
    // const tokenClaimed = campaignContract.methods.tokenClaimed().call();

    const campaignDetail = await Promise.all([
      title, tokenSold, weiRaised,
      ethLink, etherRate, startTime,
      closeTime, fundingWallet, token,
      owner, erc20ConversionRate, isSuspend,
      etherConversionRateDecimals,
      // isClaimable, claimableTokens,
      // releaseTime, tokenClaimed,
    ]);

    const campaignInfo = {
      title: campaignDetail[0],
      tokenSold: campaignDetail[1],
      weiRaised: campaignDetail[2],
      ethLink: campaignDetail[3],
      etherRate: campaignDetail[4],
      startTime: campaignDetail[5],
      closeTime: campaignDetail[6],
      fundingWallet: campaignDetail[7],
      token: campaignDetail[8],
      owner: campaignDetail[9],
      erc20ConversionRate: campaignDetail[10],
      isSuspend: campaignDetail[11],
      etherConversionRateDecimals: campaignDetail[12],
    };

    // Init ERC20 Contract By Token Address get from Campaign Contract
    const erc20Contract = getContractInstance(erc20ABI, campaignDetail[8]);
    const usdtContract = getContractInstance(erc20ABI, USDT_LINK_DEFAULT_ADDRESS);

    if (erc20Contract && usdtContract) {
      const tokenName = erc20Contract.methods.name().call();
      const tokenSymbol = erc20Contract.methods.symbol().call();
      const tokenDecimals = erc20Contract.methods.decimals().call();
      const totalTokens = erc20Contract.methods.balanceOf(campaignHash).call();
      const tokenDetail = await Promise.all([tokenName, tokenSymbol, tokenDecimals, totalTokens]);
      const tokenInfo = {
        name: tokenDetail[0],
        symbol: tokenDetail[1],
        decimals: tokenDetail[2],
        totalTokens: tokenDetail[3],
      };
    }
    return campaignInfo;
  }
};
