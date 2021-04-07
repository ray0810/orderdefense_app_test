import { Shopify } from "@shopify/shopify-api";
import "isomorphic-fetch";
import { gql } from "apollo-boost";

export const changeSubscription = async (amountPrice, token, url) => {
  const client = new Shopify.Clients.Graphql(url, token);

  const response = await client.query({
    data: `{
            appInstallation {
              id
              activeSubscriptions{
                id
                name
                lineItems {
                  id
                }
              }
            }
        }`,
  });

  const subscription = response.body.data.appInstallation.activeSubscriptions.find(
    (item) => item.name.includes("Plan for OrderDefense")
  );
  const ID = subscription && subscription.lineItems[0].id;

  const charge = `mutation {
    appUsageRecordCreate(
        subscriptionLineItemId: "${ID}"
        price: { amount: "${amountPrice}", currencyCode: USD }
        description: "Take 50% of orders"
        ) {
            appUsageRecord {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
  `;
  const changedCharge = await client.query({
    data: charge,
  });
};
