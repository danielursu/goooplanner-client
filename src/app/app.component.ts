import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { EventDialogComponent } from './components/event-dialog/event-dialog.component';
import { CalendarEventService } from './services/calendar-event.service';
import { CalendarEvent, EventType } from './types/calendar.types';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { JwtService } from './services/jwt.service';
import { UserData } from './types/jwt.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    FullCalendarModule,
    ConfirmDialogModule,
    ToastModule,
    SidebarComponent
  ],
  providers: [
    DialogService,
    ConfirmationService,
    MessageService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  calendarVisible = signal(true);
  currentEvents = signal<EventApi[]>([]);
  isSidebarExpanded = signal(false);

  userData: UserData | null = null;
  profileColor = '#4CAF50';

  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    firstDay: 1, // Set Monday as the first day of the week
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this)
  });

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private eventService: CalendarEventService,
    private jwtService: JwtService
  ) {
    this.userData = this.jwtService.getUserData();
  }

  ngOnInit() {
    this.loadEvents();
  }

  toggleSidebar() {
    this.isSidebarExpanded.update(value => !value);
  }

  private loadEvents(): void {
    this.eventService.loadEvents().subscribe({
      next: (events) => {
        this.calendarOptions.update(options => ({
          ...options,
          events: events as EventInput[]
        }));
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load events'
        });
      }
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    if (!this.userData) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please log in to create events'
      });
      return;
    }

    const ref = this.dialogService.open(EventDialogComponent, {
      header: 'New Event',
      width: '500px',
      data: {
        start: selectInfo.start,
        end: selectInfo.end
      }
    });

    ref.onClose.subscribe(result => {
      if (result) {
        this.eventService.addEvent(result).subscribe({
          next: (newEvent) => {
            selectInfo.view.calendar.addEvent(newEvent);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Event created successfully'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create event'
            });
          }
        });
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (!this.userData) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please log in to edit events'
      });
      return;
    }

    const ref = this.dialogService.open(EventDialogComponent, {
      header: 'Edit Event',
      width: '500px',
      data: {
        event: clickInfo.event.toPlainObject() as CalendarEvent
      }
    });

    ref.onClose.subscribe(result => {
      if (result) {
        if (result.delete) {
          this.confirmationService.confirm({
            message: 'Are you sure you want to delete this event?',
            accept: () => {
              this.eventService.deleteEvent(clickInfo.event.id).subscribe({
                next: () => {
                  clickInfo.event.remove();
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Event deleted successfully'
                  });
                },
                error: (error) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete event'
                  });
                }
              });
            }
          });
        } else {
          this.eventService.updateEvent(result as CalendarEvent).subscribe({
            next: (updatedEvent) => {
              clickInfo.event.setProp('title', updatedEvent.title);
              clickInfo.event.setDates(
                new Date(updatedEvent.start),
                updatedEvent.end ? new Date(updatedEvent.end) : null
              );
              clickInfo.event.setExtendedProp('type', updatedEvent.type);
              clickInfo.event.setExtendedProp('description', updatedEvent.description);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Event updated successfully'
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update event'
              });
            }
          });
        }
      }
    });
  }

  handleEventDrop(eventDropInfo: any) {
    if (!this.userData) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please log in to move events'
      });
      eventDropInfo.revert();
      return;
    }

    const event = eventDropInfo.event;
    const updatedEvent: CalendarEvent = {
      ...event.toPlainObject(),
      start: event.start?.toISOString(),
      end: event.end?.toISOString()
    };

    this.eventService.updateEvent(updatedEvent).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event moved successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to move event'
        });
        eventDropInfo.revert();
      }
    });
  }

  handleEventResize(eventResizeInfo: any) {
    if (!this.userData) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please log in to resize events'
      });
      eventResizeInfo.revert();
      return;
    }

    const event = eventResizeInfo.event;
    const updatedEvent: CalendarEvent = {
      ...event.toPlainObject(),
      start: event.start?.toISOString(),
      end: event.end?.toISOString()
    };

    this.eventService.updateEvent(updatedEvent).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event duration updated successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update event duration'
        });
        eventResizeInfo.revert();
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  getEventIcon(event: EventApi): string {
    const type = event.extendedProps?.['type'] as EventType;
    switch (type) {
      case EventType.VACATION:
        return 'pi pi-calendar';
      case EventType.SICK_LEAVE:
        return 'pi pi-heart';
      case EventType.REMOTE_WORK:
        return 'pi pi-home';
      default:
        return 'pi pi-calendar-times';
    }
  }
}
