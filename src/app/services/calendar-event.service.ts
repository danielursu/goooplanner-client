import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarEvent, EventType, EVENT_COLORS } from '../types/calendar.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private events = new BehaviorSubject<CalendarEvent[]>([]);
  public events$ = this.events.asObservable();

  constructor(private http: HttpClient) {}

  loadEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${environment.apiUrl}/events`).pipe(
      map(events => {
        events.forEach(event => {
          event.color = EVENT_COLORS[event.type];
        });
        this.events.next(events);
        return events;
      })
    );
  }

  addEvent(event: Partial<CalendarEvent>): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(`${environment.apiUrl}/events`, event).pipe(
      map(newEvent => {
        newEvent.color = EVENT_COLORS[newEvent.type];
        const currentEvents = this.events.value;
        this.events.next([...currentEvents, newEvent]);
        return newEvent;
      })
    );
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(`${environment.apiUrl}/events/${event.id}`, event).pipe(
      map(updatedEvent => {
        updatedEvent.color = EVENT_COLORS[updatedEvent.type];
        const currentEvents = this.events.value;
        const index = currentEvents.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
          currentEvents[index] = updatedEvent;
          this.events.next([...currentEvents]);
        }
        return updatedEvent;
      })
    );
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/events/${eventId}`).pipe(
      map(() => {
        const currentEvents = this.events.value;
        this.events.next(currentEvents.filter(event => event.id !== eventId));
      })
    );
  }
}
