// src/types/events.ts

import { ApiErrorType } from '../types/api';

export interface ConcertEvent {
  id: number;
  bandName: string;
  place: string;
  date: string;
  comment: string;
  rating: number;
  appUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
}

export interface CreateEventData {
  bandName: string;
  place: string;
  date: string;
  rating: number;
  comment: string;
}

export interface UpdateEventData {
  bandName?: string;
  place?: string;
  date?: string;
  rating?: number;
  comment?: string;
}