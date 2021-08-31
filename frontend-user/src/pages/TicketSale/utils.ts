import { TOKEN_TYPE } from "../../constants";

export const getRemaining = (totalTicket: number, totalSold: number) => {
    return (+totalTicket - +totalSold) || 0;
}

export const calcProgress = (sold: number, total: number) => {
    const percent = ((sold * 100) / total) || 0;
    if(percent > 99 && percent < 100) {
        return 99;
    }
    return Math.ceil(percent) || 0;
}

export const getRoute = (tokenType: string) => {
    switch(tokenType) {
        case TOKEN_TYPE.ERC20 : {
            return 'buy-token'
        }
        case TOKEN_TYPE.ERC721 : {
            return 'buy-nft'
        }
        default: {
            return 'buy-token'
        }
    }
}