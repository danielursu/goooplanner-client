import { EventInput } from '@fullcalendar/core';

export interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  userId?: string;
  type: EventType;
  description?: string;
  color?: string;
}

export enum EventType {
  VACATION = 'vacation',
  SICK_LEAVE = 'sick_leave',
  REMOTE_WORK = 'remote_work',
  OTHER = 'other'
}

export const EVENT_COLORS = {
  [EventType.VACATION]: '#4CAF50',
  [EventType.SICK_LEAVE]: '#F44336',
  [EventType.REMOTE_WORK]: '#2196F3',
  [EventType.OTHER]: '#9E9E9E'
};
