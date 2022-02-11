export type ObjectType<V = any> = {
    [k: string]: V;
}

export type Address = string;

export type TokenType = {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
}
