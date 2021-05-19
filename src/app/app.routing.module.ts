import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    WelcomPage
} from "@app/pages"

const routes: Routes = [
    { path: "", component: WelcomPage },

    { path: "**", redirectTo: "" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
