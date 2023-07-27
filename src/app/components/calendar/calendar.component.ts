import { Component } from "@angular/core";
import { CalendarOptions, DateSelectArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

@Component({
	selector: "app-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
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
		alert(selectedRange.start + " to " + selectedRange.end);
		console.log(selectedRange);
		const event = { title: "Samuel Buraga", start: selectedRange.start, end: selectedRange.end };
		this.events = [...this.events, event];
		this.calendarOptions.events = this.events;
	}
}
