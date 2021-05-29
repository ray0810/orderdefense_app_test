import { Shopify } from "@shopify/shopify-api";

export const getSubscriptionUrl = async (accessToken, shop, returnUrl) => {
  const query = `mutation {
    appSubscriptionCreate(
      name: "Plan for OrderDefense"
      returnUrl: "${returnUrl}"
      test: true
      lineItems: [
        {
          plan: {
            appUsagePricingDetails: {
              cappedAmount: { amount: 1000, currencyCode: USD }
              terms: "Charge once per month automatically if any orders include the product OrderDefense"
            }
          }
        }
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: 0, currencyCode: USD }
            }
          }
        }
      ]
    )
    {
      userErrors {
        field
        message
      }
      confirmationUrl
      appSubscription {
        id
      }
    }
  }`;

  const client = new Shopify.Clients.Graphql(shop, accessToken);
  const response = await client.query({
    data: query,
  });

  return response.body.data.appSubscriptionCreate.confirmationUrl;
};
