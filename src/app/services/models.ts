export type ResponseViewModel<TModel> = {
    status: string;
    message: string;
    data: TModel;
}

export type CurrencyResponse = {
    code: string;
    symbol: string;
    name: string;
}

export type Registrar = {
    name: string;
    baseUrl: string;
}
