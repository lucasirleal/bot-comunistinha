import { CommandBinder } from './CommandBinder';

export interface Command {
  name: string;
  description: string;
  action: CommandBinder;
}
