import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
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
import { InitialsPipe } from "src/app/pipes/initials.pipe";

interface CalendarEvent extends EventInput {
	title: string;
	start: Date;
	end: Date;
}

@Component({
	selector: "app-calendar",
	standalone: true,
	imports: [FullCalendarModule, RouterModule, CommonModule, InitialsPipe],
	templateUrl: "./calendar.component.html",
	styleUrl: "./calendar.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
	private readonly jwtService = inject(JwtService);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	constructor() {
		this.profileColor = this.getRandomColor();
	}

	ngOnInit(): void {
		this.userData = this.jwtService.getUserData();
	}

	public userData: UserData | null | undefined;
	private events: EventInput[] = [];
	public profileColor = this.getRandomColor();

	public onLogOut(): void {
		this.authService.logout().subscribe({
			next: (response: { message: string }) => {
				console.log(response.message);
				this.router.navigate(["/login"]);
			},
			error: (error: string) => {
				console.error("Logout failed:", error);
			},
		});
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

	private getRandomColor(): string {
		return (
			"#" +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, "0")
		);
	}
}
