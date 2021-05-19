import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@environments/environment';

import {
    ResponseViewModel,
    CurrencyResponse
} from "./models";

@Injectable({
    providedIn: "root"
})
export class AppService {
    constructor(
        private readonly httpClient: HttpClient
    ) {
    }

    private readonly supportedCurrencies: CurrencyResponse[] = [
        { code: "USD", symbol: "$", name: "United States Dollars" }
    ]

    public getCurrencies(): CurrencyResponse[] {
        return this.supportedCurrencies;
    }

    public async getIsDomainAvailable(
        domainNameWithTLD: string
    ): Promise<ResponseViewModel<boolean>> {
        return this.httpClient.get<ResponseViewModel<boolean>>(`${environment.apiUrl}/api/domain/isavailable/${domainNameWithTLD}`).toPromise();
    }
}
