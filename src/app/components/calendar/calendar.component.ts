import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventChangeArg, EventInput as FullCalendarEventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { EventType, CalendarEvent, EventInput } from '../../types/event.types';
import { UserData } from '../../types/jwt.types';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    ReactiveFormsModule,
    ToastModule,
    SidebarComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [MessageService, EventService]
})
export class CalendarComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: any;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventChange: this.handleEventChange.bind(this),
    height: '100%'
  };

  eventForm: FormGroup;
  showEventDialog = false;
  dialogMode: 'create' | 'edit' = 'create';
  selectedEvent: EventApi | null = null;
  userSubscription?: Subscription;
  userId: number | null = null;
  userData: UserData | null = null;
  isSidebarExpanded = true;

  eventTypes = [
    { label: 'Vacation', value: 'vacation' as EventType },
    { label: 'Sick Leave', value: 'sick_leave' as EventType }
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.eventForm = this.createEventForm();
  }

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe((user: UserData | null) => {
      if (user) {
        this.userId = user.userId;
        this.userData = user;
        this.loadEvents();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  private createEventForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      start: [null, Validators.required],
      end: [null, Validators.required],
      allDay: [false],
      type: ['vacation', Validators.required],
      description: ['']
    });
  }

  onSubmitEvent(): void {
    if (this.eventForm.invalid || !this.userId) return;

    const formValue = this.eventForm.value;
    const eventData: EventInput = {
      title: formValue.title,
      start: formValue.start.toISOString(),
      end: formValue.end.toISOString(),
      allDay: formValue.allDay,
      type: formValue.type,
      description: formValue.description
    };

    if (this.dialogMode === 'create') {
      this.createEvent(eventData);
    } else if (this.selectedEvent?.id) {
      this.updateEvent(this.selectedEvent.id, eventData);
    }
  }

  onDeleteEvent(): void {
    if (this.selectedEvent && this.selectedEvent.id) {
      this.deleteEvent(this.selectedEvent.id);
    }
  }

  private createEvent(eventData: EventInput): void {
    this.eventService.createEvent(eventData).subscribe({
      next: (event) => {
        this.calendarComponent.getApi().addEvent(this.mapEventToCalendar(event));
        this.showEventDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event created successfully'
        });
      },
      error: (error) => {
        console.error('Error creating event:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create event'
        });
      }
    });
  }

  private updateEvent(eventId: string, eventData: EventInput): void {
    this.eventService.updateEvent(eventId, eventData).subscribe({
      next: (event) => {
        this.selectedEvent?.remove();
        this.calendarComponent.getApi().addEvent(this.mapEventToCalendar(event));
        this.showEventDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event updated successfully'
        });
      },
      error: (error) => {
        console.error('Error updating event:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update event'
        });
      }
    });
  }

  private deleteEvent(eventId: string): void {
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.selectedEvent?.remove();
        this.showEventDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event deleted successfully'
        });
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete event'
        });
      }
    });
  }

  private loadEvents(): void {
    if (!this.userId) return;

    this.eventService.getEvents().subscribe({
      next: (events: CalendarEvent[]) => {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(events.map(this.mapEventToCalendar.bind(this)));
      },
      error: (error: Error) => {
        console.error('Error loading events:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load events'
        });
      }
    });
  }

  private mapEventToCalendar(event: CalendarEvent): FullCalendarEventInput {
    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: {
        type: event.type,
        description: event.description
      },
      backgroundColor: this.getEventColor(event.type),
      borderColor: this.getEventColor(event.type)
    };
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.dialogMode = 'create';
    this.selectedEvent = null;
    this.eventForm.reset({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
      type: 'vacation'
    });
    this.showEventDialog = true;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.dialogMode = 'edit';
    this.selectedEvent = clickInfo.event;
    
    const eventData = {
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay,
      type: clickInfo.event.extendedProps['type'],
      description: clickInfo.event.extendedProps['description'] || ''
    };

    this.eventForm.patchValue(eventData);
    this.showEventDialog = true;
  }

  handleEventChange(changeInfo: EventChangeArg) {
    if (!this.userId || !changeInfo.event.id) return;

    const eventData: EventInput = {
      title: changeInfo.event.title,
      start: changeInfo.event.start?.toISOString() || '',
      end: changeInfo.event.end?.toISOString() || '',
      allDay: changeInfo.event.allDay,
      type: changeInfo.event.extendedProps['type'],
      description: changeInfo.event.extendedProps['description']
    };

    this.eventService.updateEvent(changeInfo.event.id, eventData).subscribe({
      error: (error) => {
        console.error('Error updating event:', error);
        changeInfo.revert();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update event'
        });
      }
    });
  }

  private getEventColor(type: EventType): string {
    switch (type) {
      case 'vacation':
        return '#4CAF50';
      case 'sick_leave':
        return '#F44336';
      default:
        return '#2196F3';
    }
  }
}
