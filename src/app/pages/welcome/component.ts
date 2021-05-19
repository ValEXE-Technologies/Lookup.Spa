import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from 'rxjs/operators';

import {
    CurrencyResponse,
    AppService,
} from "@app/services";

@Component({
    templateUrl: "./template.html"
})
export class WelcomPage implements OnInit {
    public domainLookupForm: FormGroup;
    public supportedCurrencies: CurrencyResponse[] = null;
    public isBusy: boolean = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly appServices: AppService
    ) {
    }

    ngOnInit() {
        this.supportedCurrencies = this.appServices.getCurrencies();

        this.domainLookupForm = this.formBuilder.group({
            selectedCurrencyCode: [this.supportedCurrencies[0].code, [Validators.required]],
            domainNameWithTLD: [null, [
                Validators.required,
                Validators.pattern("^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$")]]
        });
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
        if (this.domainLookupForm.invalid) {
            return;
        }

        this.isBusy = true;

        // TODO:
        try {
            let response = await this.appServices.getIsDomainAvailable(this.f.domainNameWithTLD.value);
            // - Pull & get domain price for each registrars
        } finally {
            this.isBusy = false;
        }
    }
}
