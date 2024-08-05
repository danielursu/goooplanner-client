import { Component } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventInput } from "@fullcalendar/core";
import { RouterModule } from "@angular/router";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

@Component({
	selector: "app-calendar",
	standalone: true,
	imports: [FullCalendarModule, RouterModule],
	templateUrl: "./calendar.component.html",
	styleUrl: "./calendar.component.scss",
})
export class CalendarComponent {
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
