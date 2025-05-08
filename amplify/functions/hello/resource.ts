import { defineFunction } from '@aws-amplify/backend';

export const hello1 = defineFunction({
  name: 'hello1',
  entry: './handler.ts'
});