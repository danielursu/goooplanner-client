import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FullCalendarModule } from "@fullcalendar/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CalendarComponent } from "./components/calendar/calendar.component";

@NgModule({
	declarations: [AppComponent, CalendarComponent],
	imports: [BrowserModule, AppRoutingModule, FullCalendarModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
