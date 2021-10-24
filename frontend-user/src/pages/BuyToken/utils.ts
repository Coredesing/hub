export const isSwap = (status?: string) => {
    status = String(status).toLowerCase();
    return status === 'upcoming' || status === 'swap' || status === 'filled';
}

export const isClaim = (status?: string) => {
    status = String(status).toLowerCase();
    return status === 'claimable' || status === 'ended';
}