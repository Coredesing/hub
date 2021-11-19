import { NETWORK } from "../../constants";

enum CURRENCIES {
    USDT = 'USDT',
    USDC = 'USDC',
    ETH = 'ETH',
}

export const getContractAddress = (networkAvailable: string, acceptCurrency: string) => {
    let contract: string = '';
    const currency = String(acceptCurrency).toUpperCase();
    switch (networkAvailable) {
        
        case NETWORK.BSC:
            if (currency === CURRENCIES.USDT) {
                contract = process.env.REACT_APP_USDT_BSC_SMART_CONTRACT || '';
            }
            if (currency === CURRENCIES.USDC) {
                contract = process.env.REACT_APP_USDC_BSC_SMART_CONTRACT || '';
            }
            break;

        case NETWORK.POLYGON:
            if (currency === CURRENCIES.USDT) {
                contract = process.env.REACT_APP_USDT_POLYGON_SMART_CONTRACT || '';
            }
            if (currency === CURRENCIES.USDC) {
                contract = process.env.REACT_APP_USDC_POLYGON_SMART_CONTRACT || '';
            }
            break;

        case NETWORK.ETHEREUM:
            if (currency === CURRENCIES.USDT) {
                contract = process.env.REACT_APP_USDT_SMART_CONTRACT || '';
            }
            if (currency === CURRENCIES.USDC) {
                contract = process.env.REACT_APP_USDC_SMART_CONTRACT || '';
            }
            break;
    }

    return contract;
}