import { onRequest as __oauth_exchange_ts_onRequest } from "/home/goblinpapa/Documents/GitHub/interview-tool/functions/oauth/exchange.ts"

export const routes = [
    {
      routePath: "/oauth/exchange",
      mountPath: "/oauth",
      method: "",
      middlewares: [],
      modules: [__oauth_exchange_ts_onRequest],
    },
  ]