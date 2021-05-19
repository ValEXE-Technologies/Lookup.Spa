import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from 'rxjs/operators';

import {
    AppService,
    CurrencyResponse,
    Registrar
} from "@app/services";

@Component({
    templateUrl: "./template.html"
})
export class WelcomPage implements OnInit {
    public domainLookupForm: FormGroup;
    public supportedCurrencies: CurrencyResponse[] = null;
    public supportedRegistrars: Registrar[] = null;
    public domainStatus: '' | 'Available' | 'NotAvailable' = '';
    public isBusy: boolean = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly appServices: AppService
    ) {
    }

    async ngOnInit() {
        await this.loadCurrencies();
        await this.loadSupportedRegistrars();

        this.domainLookupForm = this.formBuilder.group({
            selectedCurrencyCode: [this.supportedCurrencies[0].code, [Validators.required]],
            domainNameWithTLD: [null, [
                Validators.required,
                Validators.pattern("^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$")]]
        });
    }

    private async loadCurrencies() {
        this.supportedCurrencies = this.appServices.getCurrencies();
    }

    private async loadSupportedRegistrars() {
        try {
            let response = await this.appServices.getRegistrars();
            this.supportedRegistrars = response.data;
        } finally {
        }
    }

    public get f() {
        return this.domainLookupForm.controls;
    }

    public currencyChanged(
        newCurrencyCode: string
    ): void {
        this.f.selectedCurrencyCode.setValue(newCurrencyCode);
    }

    public async onSubmit() {
        this.domainStatus = '';

        if (this.domainLookupForm.invalid) {
            return;
        }

        this.isBusy = true;

        // TODO:
        try {
            let response = await this.appServices.getIsDomainAvailable(this.f.domainNameWithTLD.value);
            this.domainStatus = response.data ? 'Available' : 'NotAvailable';
            
            // - Pull & get domain price for each registrars
        } finally {
            this.isBusy = false;
        }
    }
}
