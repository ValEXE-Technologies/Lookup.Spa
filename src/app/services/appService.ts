import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '@environments/environment';

import {
    ResponseViewModel,
    Currency,
    Registrar,
    DomainPrice
} from "./models";

@Injectable({
    providedIn: "root"
})
export class AppService {
    constructor(
        private readonly httpClient: HttpClient
    ) {
    }

    public async getCurrencies(): Promise<ResponseViewModel<Currency[]>> {
        return this.httpClient.get<ResponseViewModel<Currency[]>>(`${environment.apiUrl}/api/referencedata/currencies`).toPromise();
    }

    public async getRegistrars(): Promise<ResponseViewModel<Registrar[]>> {
        return this.httpClient.get<ResponseViewModel<Registrar[]>>(`${environment.apiUrl}/api/domain/registrars`).toPromise();
    }

    public async getIsDomainAvailable(
        domainNameWithTLD: string
    ): Promise<ResponseViewModel<boolean>> {
        return this.httpClient.get<ResponseViewModel<boolean>>(`${environment.apiUrl}/api/domain/isavailable/${domainNameWithTLD}`).toPromise();
    }

    public async getDomainPrice(
        currency: string,
        registrar: string,
        domainNameWithTLD: string
    ): Promise<ResponseViewModel<DomainPrice>> {
        return this.httpClient.get<ResponseViewModel<DomainPrice>>(`${environment.apiUrl}/api/domain/price/${currency}/${registrar}/${domainNameWithTLD}`).toPromise();
    }
}
