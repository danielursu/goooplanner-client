import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CalendarEvent, EventType, EVENT_COLORS } from '../types/calendar.types';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private events = new BehaviorSubject<CalendarEvent[]>([]);
  public events$ = this.events.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    if (!token) {
      return null;
    }
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('An error occurred while processing your request.'));
  }

  loadEvents(): Observable<CalendarEvent[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of([]);
    }

    return this.http.get<CalendarEvent[]>(`${environment.apiUrl}/events`, {
      headers
    }).pipe(
      map(events => {
        const processedEvents = events.map(event => ({
          ...event,
          color: EVENT_COLORS[event.type],
          id: event.id.toString()
        }));
        this.events.next(processedEvents);
        return processedEvents;
      }),
      catchError(this.handleError)
    );
  }

  addEvent(event: Partial<CalendarEvent>): Observable<CalendarEvent> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Not authenticated'));
    }

    return this.http.post<CalendarEvent>(`${environment.apiUrl}/events`, event, {
      headers
    }).pipe(
      map(newEvent => {
        const processedEvent = {
          ...newEvent,
          color: EVENT_COLORS[newEvent.type],
          id: newEvent.id.toString()
        };
        this.events.next([...this.events.value, processedEvent]);
        return processedEvent;
      }),
      catchError(this.handleError)
    );
  }

  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Not authenticated'));
    }

    return this.http.put<CalendarEvent>(`${environment.apiUrl}/events/${event.id}`, event, {
      headers
    }).pipe(
      map(updatedEvent => {
        const processedEvent = {
          ...updatedEvent,
          color: EVENT_COLORS[updatedEvent.type],
          id: updatedEvent.id.toString()
        };
        const currentEvents = this.events.value.map(e => 
          e.id === processedEvent.id ? processedEvent : e
        );
        this.events.next(currentEvents);
        return processedEvent;
      }),
      catchError(this.handleError)
    );
  }

  deleteEvent(eventId: string): Observable<void> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Not authenticated'));
    }

    return this.http.delete<void>(`${environment.apiUrl}/events/${eventId}`, {
      headers
    }).pipe(
      map(() => {
        this.events.next(this.events.value.filter(event => event.id !== eventId));
      }),
      catchError(this.handleError)
    );
  }
}
