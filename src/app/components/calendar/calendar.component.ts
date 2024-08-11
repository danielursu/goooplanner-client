import { Component, OnInit } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventInput } from "@fullcalendar/core";
import { RouterModule } from "@angular/router";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { JwtService } from "src/app/services/jwt.service";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-calendar",
	standalone: true,
	imports: [FullCalendarModule, RouterModule],
	templateUrl: "./calendar.component.html",
	styleUrl: "./calendar.component.scss",
})
export class CalendarComponent implements OnInit {
	userData: any;

	constructor(
		private jwtService: JwtService,
		private authService: AuthService,
		private router: Router,
	) {}

	ngOnInit() {
		this.userData = this.jwtService.getUserData();
	}

	onLogOut() {
		this.authService.logout();
		this.router.navigate(["/login"]);
	}

	events: EventInput[] = [];

	calendarOptions: CalendarOptions = {
		initialView: "dayGridMonth",
		plugins: [interactionPlugin, dayGridPlugin],
		selectable: true,
		select: (selectedRange) => this.selectDates(selectedRange),
	};

	selectDates(selectedRange: DateSelectArg): void {
		const event = { title: "eventName", start: selectedRange.start, end: selectedRange.end };
		this.events = [...this.events, event];
		this.calendarOptions.events = this.events;
	}
}
