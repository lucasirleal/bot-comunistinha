import { EventBinder } from './EventBinder';

export interface Event {
  name: string;
  run: EventBinder;
}
