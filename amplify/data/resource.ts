import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { hello2 } from '../functions/hello2/resource';
import { hello1 } from '../functions/hello/resource';

const schema = a.schema({
  Todo1: a
    .model({
      id: a.id().required(),
      content: a.string().required(),
      createdAt: a.datetime(),
      isCompleted: a.boolean().default(false),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  hello1: a
    .query()
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function('hello1')),

  hello2: a
    .query()
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function('hello2')),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
  functions: {
    hello1: hello1,
    hello2: hello2,
  },
});
