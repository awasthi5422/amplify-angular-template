import { defineFunction } from '@aws-amplify/backend';

export const hello2 = defineFunction({
  name: 'hello2',
  entry: './handler.ts',
});
