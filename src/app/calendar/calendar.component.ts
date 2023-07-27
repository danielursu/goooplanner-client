import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";


@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild("fullcalendar") fullcalendar: any;

  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin],
    events: this.generateEvents(),
    eventDidMount: this.addCheckbox.bind(this),
    select: this.handleDateSelect.bind(this),
    eventBackgroundColor: "transparent",
    eventBorderColor: "transparent",
  };

  selectedDates: Set<string> = new Set();

  ngAfterViewInit() {
    this.updateSelectableState();
  }

  updateSelectableState() {
    this.calendarOptions.selectable = !this.calendarOptions.selectable;
    if (!this.calendarOptions.selectable) {
      this.fullcalendar.getApi().unselect();
    }
  }

  handleDateSelect(info: any) {
    const selectedDate = info.startStr;
    this.selectedDates.has(selectedDate)
      ? this.selectedDates.delete(selectedDate)
      : this.selectedDates.add(selectedDate);
    console.log("Selected Dates:", this.selectedDates);
  }

  addCheckbox(info: any) {
    const dayCell = info.el;
    const { dateStr } = info.event;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.checked = this.selectedDates.has(dateStr);
    checkbox.addEventListener("change", () => this.handleCheckboxChange(dateStr));
    dayCell.appendChild(checkbox);

    checkbox.addEventListener("click", () => {
      if (checkbox.checked) {
        const eventNameSpan = document.createElement("span");
        eventNameSpan.textContent = "user";
        dayCell.appendChild(eventNameSpan);
      } else {
        const eventNameSpan = dayCell.querySelector("span");
        if (eventNameSpan) {
          dayCell.removeChild(eventNameSpan);
        }
      }
    });
  }

  handleCheckboxChange(dateStr: string) {
    if (this.selectedDates.has(dateStr)) {
      this.selectedDates.delete(dateStr);
    } else {
      this.selectedDates.add(dateStr);
    }
  }

  generateEvents() {
    const events: any[] = [];
    const currentDate = new Date();
    const eventLimit = 365;

    for (let i = 0; i < eventLimit; i++) {
      const date = new Date(currentDate.getTime());
      const dateStr = date.toISOString().split("T")[0];

      events.push({ title: '', date: dateStr });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return events;
  }
}
