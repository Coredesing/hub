import { TOKEN_TYPE } from "../../constants";

export const getRemaining = (totalTicket: number, totalSold: number) => {
    return (+totalTicket - +totalSold) || 0;
}

export const calcProgress = (sold: number, total: number) => {
    return Math.ceil((sold * 100) / total) || 0;
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