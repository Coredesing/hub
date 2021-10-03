import { calcPercentRate } from "@utils/index";
import { TOKEN_TYPE } from "../../constants";
import { ACCEPT_ROUTES } from "./ contants";

export const getRemaining = (totalTicket: number, totalSold: number) => {
    return (+totalTicket - +totalSold) || 0;
}

export const calcProgress = (sold: number, total: number) => {
    return calcPercentRate(sold, total);
};

export const getRoute = (tokenType: string) => {
    switch (tokenType) {
        case TOKEN_TYPE.ERC20: {
            return 'buy-token'
        }
        case TOKEN_TYPE.ERC721: {
            return 'buy-nft'
        }
        case TOKEN_TYPE.Box: {
            return 'mystery-box'
        }
        default: {
            return 'buy-token'
        }
    }
}

export const getFilterTokenType = (type: string) => {
    if(type === ACCEPT_ROUTES.Ticket) return TOKEN_TYPE.ERC721;
    if(type === ACCEPT_ROUTES.Token) return TOKEN_TYPE.ERC20;
    if(type === ACCEPT_ROUTES.MysteryBoxes) return TOKEN_TYPE.Box;
    return TOKEN_TYPE.ERC20;
}