import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import {
    AppService,
    Currency
} from "@app/services";

export type RegistrarModel = {
    name: string;
    status: "Loading" | "Ready" | "Error";
    price: number;
    url: string;
    features: string[];
}

@Component({
    templateUrl: "./template.html"
})
export class WelcomPage implements OnInit {
    public domainLookupForm: FormGroup;
    public supportedCurrencies: Currency[] = null;
    public selectedCurrency: Currency = null;
    public registrars: RegistrarModel[] = [];
    public domainStatus: '' | 'Available' | 'NotAvailable' = '';
    public sortBy: 'Price - Lower to Higher' | 'Price - Higher to Lower' | 'Registrar A-Z' | 'Registrar Z-A' = 'Price - Lower to Higher';
    public isBusy: boolean = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly appServices: AppService
    ) {
    }

    async ngOnInit() {
        await this.loadCurrencies();
        
        this.domainLookupForm = this.formBuilder.group({
            selectedCurrencyCode: [this.selectedCurrency.code, [Validators.required]],
            domainNameWithTLD: [null, [
                Validators.required,
                Validators.pattern("^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$")]]
        });
    }

    private async loadCurrencies() {
        this.isBusy = true;

        try {
            let response = await this.appServices.getCurrencies();
            this.supportedCurrencies = response.data;
            this.selectedCurrency = this.supportedCurrencies[0];
        } finally {
            this.isBusy = false;
        }
    }

    private async loadRegistrars() {
        this.registrars = [];

        let response = await this.appServices.getRegistrars(
            this.selectedCurrency.code
        );
        
        response.data.forEach( async (d) => {
            let registrar: RegistrarModel = {
                name: d.name,
                status: 'Loading',
                price: 0,
                url: d.baseUrl,
                features: d.features
            };

            this.registrars.push(registrar);

            this.loadDomainPrice(registrar);
        });
    }

    private async loadDomainPrice(
        registrar: RegistrarModel
    ) {
        try {
            let response = await this.appServices.getDomainPrice(
                this.selectedCurrency.code,
                registrar.name,
                this.domainLookupForm.controls['domainNameWithTLD'].value);
            if (null == response.data) {
                registrar.status = 'Error';
            } else {
                registrar.price = response.data.price;
                registrar.url = response.data.url;
                registrar.status = 'Ready';
            }

            this.sortResult();
        } catch (err) {
            registrar.status = 'Error';
        }

        let registrarIndex = this.registrars.indexOf(registrar);
        this.registrars[registrarIndex] = registrar;
    }

    public get f() {
        return this.domainLookupForm.controls;
    }

    public currencyChanged(
        newCurrencyCode: string
    ): void {
        this.selectedCurrency = this.supportedCurrencies
            .find((value) => value.code === newCurrencyCode);
        this.f.selectedCurrencyCode.setValue(this.selectedCurrency.code);
        this.registrars = [];
        this.domainStatus = '';
    }

    public sortByChanged(
        newSortBy: 'Price - Lower to Higher' | 'Price - Higher to Lower' | 'Registrar A-Z' | 'Registrar Z-A'
    ): void {
        this.sortBy = newSortBy;
        this.sortResult();
    }

    private async sortResult() {
        switch (this.sortBy) {
            case 'Price - Lower to Higher':
                this.registrars.sort((one, two) => {
                    if (one.status == 'Ready' && two.status == 'Ready') {
                        return one.price - two.price;
                    }

                    return -1;
                });
                break;
            case 'Price - Higher to Lower':
                this.registrars.sort((one, two) => {
                    if (one.status == 'Ready' && two.status == 'Ready') {
                        return two.price - one.price;
                    }

                    return -1;
                });
                break;
            case 'Registrar A-Z':
                this.registrars.sort((one, two) => {
                    if (one.name.toLocaleLowerCase() > two.name.toLocaleLowerCase()) {
                        return 1;
                    }

                    if (one.name.toLocaleLowerCase() < two.name.toLocaleLowerCase()) {
                        return -1;
                    }

                    return 0;
                })
                break;
            case 'Registrar Z-A':
                this.registrars.sort((one, two) => {
                    if (one.name.toLocaleLowerCase() < two.name.toLocaleLowerCase()) {
                        return 1;
                    }

                    if (one.name.toLocaleLowerCase() > two.name.toLocaleLowerCase()) {
                        return -1;
                    }

                    return 0;
                })
                break;
        }
    }

    public async onSubmit() {
        this.domainStatus = '';

        if (this.domainLookupForm.invalid) {
            return;
        }

        this.isBusy = true;

        try {
            let response = await this.appServices.getIsDomainAvailable(this.f.domainNameWithTLD.value);

            if (response.data) {
                this.domainStatus = 'Available';
                
                this.loadRegistrars();
            } else {
                this.domainStatus = 'NotAvailable';
            }
        } finally {
            this.isBusy = false;
        }
    }
}
