export type EventType = 'vacation' | 'sick_leave';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  type: EventType;
  userId: number;
  description?: string;
}

export interface EventInput {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  type: EventType;
  description?: string;
}
