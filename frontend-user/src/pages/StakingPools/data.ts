const makeData = (number: number) => {
    return {
        wallet_address: (Math.random() * number).toString(16),
        amount: 2 * number,
    }
}

const tops = [
    makeData(10),
    makeData(14),
    makeData(6),
    makeData(5),
    makeData(22),
    makeData(9),
    makeData(12),
    makeData(1),
    makeData(44),
    makeData(11),
]

export const topStaking = [
    {
        poolname: 'PoolName 1', 
        top: tops.sort((a, b) => b.amount - a.amount),
        id: 0,
    },
    {
        poolname: 'PoolName 2', 
        top: tops.map((t) => ({...t, amount: Math.floor(Math.random() * 50)})).sort((a, b) => b.amount - a.amount),
        id: 1,
    },
    {
        poolname: 'PoolName 3', 
        top: tops.map((t) => ({...t, amount: Math.floor(Math.random() * 50)})).sort((a, b) => b.amount - a.amount),
        id: 2,
    }
]