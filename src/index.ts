#!/usr/bin/env node
import Generator from './Generator';
import Prompter from './Prompter';
import AdvancedLogger from './Logger';
import { Action } from './utils/index';
import { checkActionType } from './utils';

const logger = AdvancedLogger.getLogger();

export async function main(generator: Generator, prompter: Prompter) {
  logger.logo();
  const answer = await prompter.getStartUpQuestion();
  return handleChoice(generator, answer);
}

export function handleChoice(generator: Generator, action: Action) {
  if (checkActionType(action)) {
    if (action === 'init') return generator.init();
    else if (action === 'new') return logger.error('This option is not ready to use.');
    throw new Error('Invalid Structure');
  } else throw new Error('Invalid Action');
}

main(new Generator(), new Prompter());
