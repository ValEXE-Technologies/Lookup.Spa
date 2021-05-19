import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "@app/app.routing.module";
import { AppComponent } from "@app/app.component";
import {
    TopBarComponent,
    FooterBarComponent,
    IntroSectionComponent
} from "@app/components";
import {
    WelcomPage,
} from "@app/pages";

@NgModule({
    declarations: [
        AppComponent,
        TopBarComponent,
        FooterBarComponent,
        IntroSectionComponent,
        WelcomPage
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
