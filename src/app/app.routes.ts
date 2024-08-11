import { Routes } from "@angular/router";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { AuthGuard } from "./guards/auth.guard";
import { NoAuthGuard } from "./guards/no-auth.guard";

export const routes: Routes = [
	{ path: "", component: CalendarComponent, title: "Calendar", canActivate: [AuthGuard] },
	{ path: "login", component: LoginComponent, title: "Login", canActivate: [NoAuthGuard] },
	{ path: "register", component: RegisterComponent, title: "Register", canActivate: [NoAuthGuard] },
];
