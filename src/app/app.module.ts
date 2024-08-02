import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


import { AppComponent } from "./app.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { FullCalendarModule } from "@fullcalendar/angular";

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';


@NgModule({
	declarations: [AppComponent, CalendarComponent, LoginComponent, RegisterComponent],
	imports: [BrowserModule, AppRoutingModule, FullCalendarModule, CardModule, InputTextModule, ButtonModule, ReactiveFormsModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule { }
