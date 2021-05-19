import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@environments/environment';
import { Observable } from "rxjs";

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

    public getIsDomainAvailable(
        domainNameWithTLD: string
    ): Observable<ResponseViewModel<boolean>> {
        return this.httpClient.get<ResponseViewModel<boolean>>(`${environment.apiUrl}/api/domain/isavailable/${domainNameWithTLD}`);
    }
}
