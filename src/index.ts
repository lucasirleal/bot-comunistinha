import dotenv from 'dotenv';
import { Bot } from './classes/Bot';

dotenv.config();

const application = new Bot();

application
  .logOn()
  .then(() => console.log('🟢 Bot logado com sucesso!'))
  .catch((error) => console.error(`🔴 Não foi possível logar o bot: ${error}`));
