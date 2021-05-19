import { Component } from "@angular/core";

@Component({
    selector: "footer-bar",
    templateUrl: "./template.html"
})
export class FooterBarComponent {
    public currentYear: number = new Date().getFullYear();
}
