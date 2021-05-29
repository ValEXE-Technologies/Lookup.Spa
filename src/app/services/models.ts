export type ResponseViewModel<TModel> = {
    status: 'Successful' | 'Failed';
    message: string;
    data: TModel;
}

export type Currency = {
    code: string;
    symbol: string;
    name: string;
}

export type Registrar = {
    name: string;
    baseUrl: string;
    features: string[];
}

export type DomainPrice = {
    url: string;
    price: number;
}
