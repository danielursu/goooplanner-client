import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";

const routes: Routes = [
	{ path: '', component: CalendarComponent, title: 'Calendar' },
	{ path: 'login', component: LoginComponent, title: 'Login' },
	{ path: 'register', component: RegisterComponent, title: 'Register' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
