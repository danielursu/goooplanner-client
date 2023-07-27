import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CheckboxComponent } from "./checkbox/checkbox.component";

@NgModule({
	declarations: [AppComponent, CalendarComponent, CheckboxComponent],
	imports: [BrowserModule, AppRoutingModule, CheckboxModule, FormsModule, FullCalendarModule],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
