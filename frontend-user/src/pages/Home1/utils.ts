export const getRemaining = (totalTicket: number, totalSold: number) => {
    return (+totalTicket - +totalSold) || 0;
}

export const calcProgress = (sold: number, total: number) => {
    return Math.ceil((sold * 100) / total) || 0;
}