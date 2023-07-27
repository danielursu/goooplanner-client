import { Component } from "@angular/core";
import { CalendarOptions, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
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
		events: this.events,
		dateClick: (selectedDate: DateClickArg): void => {
			// alert("You selected: " + selectedDate.date);
			// console.log(selectedDate.date);
			const event = { title: "Samuel Buraga", date: selectedDate.date };
			this.events = [...this.events, event]; // Update events array
			// Trigger the change detection manually to update the calendar events
			this.calendarOptions.events = this.events;
		},
		select: (selectedRange) => {
			alert(selectedRange.start + " to " + selectedRange.end);
			const event = { title: "Samuel Buraga", start: selectedRange.start, end: selectedRange.end };
			this.events = [...this.events, event]; // Update events array
			// Trigger the change detection manually to update the calendar events
			this.calendarOptions.events = this.events;
		},
	};
}
