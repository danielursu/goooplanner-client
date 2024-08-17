import { Component, OnInit } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventInput } from "@fullcalendar/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Router } from "@angular/router";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { JwtService } from "src/app/services/jwt.service";
import { AuthService } from "src/app/services/auth.service";

import { UserData } from "src/app/types/jwt.types";

interface CalendarEvent extends EventInput {
	title: string;
	start: Date;
	end: Date;
}

@Component({
	selector: "app-calendar",
	standalone: true,
	imports: [FullCalendarModule, RouterModule, CommonModule],
	templateUrl: "./calendar.component.html",
	styleUrl: "./calendar.component.scss",
})
export class CalendarComponent implements OnInit {
	constructor(
		private jwtService: JwtService,
		private authService: AuthService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.userData = this.jwtService.getUserData();
		this.profileColor = this.getRandomColor();
	}

	public userData: UserData | null | undefined;
	private events: EventInput[] = [];
	public profileColor = this.getRandomColor();

	public onLogOut(): void {
		this.authService.logout();
		this.router.navigate(["/login"]);
	}

	calendarOptions: CalendarOptions = {
		initialView: "dayGridMonth",
		plugins: [interactionPlugin, dayGridPlugin],
		selectable: true,
		select: (selectedRange) => this.selectDates(selectedRange),
	};

	private selectDates(selectedRange: DateSelectArg): void {
		const event: CalendarEvent = { title: "eventName", start: selectedRange.start, end: selectedRange.end };
		this.events = [...this.events, event];
		this.calendarOptions.events = this.events;
	}

	public getInitials() {
		if (!this.userData || !this.userData.firstName || !this.userData.lastName) {
			return "";
		}

		return `${this.userData.firstName.charAt(0)}${this.userData.lastName.charAt(0)}`;
	}
	private getRandomColor(): string {
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
}
