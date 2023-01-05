import prompts from 'prompts';
import { Action, IPrompter, ProviderType } from './utils/index';
import { startUpQuestins, selectProvider, databaseUrl } from './utils/index';

export default class Prompter implements IPrompter {
  private static instance: Prompter;

  async provider(): Promise<ProviderType> {
    const { provider } = await prompts(selectProvider);
    return provider;
  }

  async databaseUrl(): Promise<string> {
    const { database_url } = await prompts(databaseUrl);
    return database_url;
  }

  async getStartUpQuestion(): Promise<Action> {
    const { option } = await prompts(startUpQuestins);
    return option;
  }

  static getPrompter(): Prompter {
    if (!Prompter.instance) {
      Prompter.instance = new Prompter();
    }
    return Prompter.instance;
  }
}

// (async () => {
//   const onSubmit = (prompt, answer) => console.log(answer);
//   const onCancel = (prompt) => {
//     console.log('Never stop prompting!');
//     return true;
//   };

//   const response = await prompts(startUpQuestins, { onSubmit, onCancel });

//   AdvancedLogger.getLogger().debug(response);
// })();
