import { ConnectorNames, connectorNames } from '../../constants/connectors';

const MESSAGE_SIGNATURE = process.env.REACT_APP_MESSAGE_SIGNATURE || "";

const getMessageParams = () => {
  const msgSignature = MESSAGE_SIGNATURE;

  return [{
    type: 'string',      // Any valid solidity type
    name: 'Message',     // Any string label you want
    value: msgSignature // The value to sign
  }]
}

export const getParamsWithConnector = (connectedAccount: string) => ({
  [ConnectorNames.BSC]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_SIGNATURE]
  },
  [ConnectorNames.WalletConnect]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_SIGNATURE]
  },
  [ConnectorNames.WalletLinkConnect]: {
    method: 'eth_sign',
    params: [connectedAccount, MESSAGE_SIGNATURE]
  },
  [ConnectorNames.Fortmatic]: {
    method: 'eth_signTypedData',
    params: [getMessageParams(), connectedAccount]
  },
  [ConnectorNames.MetaMask]: {
    method: 'eth_signTypedData',
    params: [getMessageParams(), connectedAccount]
  },
})
