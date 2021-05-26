import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Shopify from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import { LocalStorage } from "node-localstorage";

import { getSubscriptionUrl } from "./getSubscriptionUrl";
import { changeSubscription } from "./changeSubscription";
import { receiveWebhook, registerWebhook } from "@shopify/koa-shopify-webhooks";
import { PAYMENT_PERCENT } from "../constants/constants";

const koaBody = require("koa-body");
const localStorage = new LocalStorage("./storage");

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.SHOP.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const {
  SHOPIFY_API_SECRET,
  SHOPIFY_API_KEY,
  HOST,
  SCOPES,
  APP_NAME,
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );

  server.keys = [SHOPIFY_API_SECRET];

  // Sets up shopify auth
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, { httpOnly: false });

        const registration = await registerWebhook({
          address: `${HOST}/webhooks/orders/create`,
          topic: "ORDERS_CREATE",
          accessToken,
          shop,
          apiVersion: ApiVersion.October20,
        });

        localStorage.setItem("Token", accessToken);
        localStorage.setItem("Shop", shop);
        if (registration.success) {
          console.log("Successfully registered webhook!");
        } else {
          console.log(
            "Failed to register webhook",
            JSON.stringify(registration.result, null, 4)
          );
        }
        // console.log('\n Shopify context is : ', JSON.stringify(Shopify, null, 4));
        // console.log('Shop is : ', shop);
        const returnUrl = `https://${shop}/admin/apps/${APP_NAME}`;
        // const returnUrl = `https://${shop}/?shop=${shop}`;
        // console.log('Return url is : ', returnUrl);
        const subscriptionUrl = await getSubscriptionUrl(
          accessToken,
          shop,
          returnUrl
        );

        ctx.redirect(subscriptionUrl);
      },
    })
  );

  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET });

  router.post("/webhooks/orders/create", webhook, async (ctx) => {
    const token = localStorage.getItem("Token");
    const url = localStorage.getItem("Shop");

    const order = ctx.state.webhook.payload.line_items.find((item) =>
      item.title.includes("OrderDefense")
    );

    if (order) {
      const amountPrice = ctx.state.webhook.payload.line_items.find((item) =>
        item.name.includes("OrderDefense")
      );
      const price = amountPrice.price * PAYMENT_PERCENT;

      if (token) {
        await changeSubscription(price, token, url);
      }
    }
  });

  router.post("/customer_data_reuest", koaBody(), async (ctx) => {
    ctx.body = { mssage: "no data stored ever" };
  });

  router.post("/customer_data_erasure", koaBody(), async (ctx) => {
    ctx.body = { mssage: "no data stored ever" };
  });

  router.post("/shop_data_erasure", koaBody(), async (ctx) => {
    ctx.body = { mssage: "no data stored ever" };
  });

  server.use(graphQLProxy({ version: ApiVersion.October20 }));

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
