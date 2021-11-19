import { Bot } from '../classes/Bot';

export interface EventBinder {
  (bot: Bot, ...args: any[]): Promise<void>;
}
