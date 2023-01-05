import { PromptObject } from 'prompts';
import symbols from 'log-symbols';

export const startUpQuestins: Array<PromptObject> = [
  {
    type: 'select',
    name: 'option',
    message: 'What would you like to do?',
    choices: [
      {
        title: 'Start from scratch',
        description: 'Create a new project with 4db',
        value: 'new',
      },
      {
        title: 'Init Your DB',
        description: 'Add to existing project',
        value: 'init',
      },
    ],
  },
];

export const selectProvider: Array<PromptObject> = [
  {
    type: 'select',
    name: 'provider',
    message: 'What would you like to use?',
    choices: [
      {
        title: 'PostgreSQL',
        value: 'PostgreSQL',
      },
    ],
  },
];

export const databaseUrl: Array<PromptObject> = [
  {
    type: 'text',
    name: 'database_url',
    message: 'Enter database url',
    validate: (value: string) =>
      value.length === 0 ? `${symbols.warning} Database url cannot be empty!` : true,
  },
];
