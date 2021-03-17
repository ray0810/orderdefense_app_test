import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import {
  Card,
  DataTable,
  Page,
  Spinner,
  Select,
  DisplayText,
  SkeletonBodyText,
  Layout,
  SkeletonDisplayText,
} from "@shopify/polaris";
import gql from "graphql-tag";

const QUERY_ORDERS = gql`
  query($orderNum: Int!, $cursor: String) {
    orders(first: $orderNum, after: $cursor) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          name
          displayFulfillmentStatus
          tags
          presentmentCurrencyCode
          lineItems(first: 5) {
            edges {
              node {
                id
                originalUnitPriceSet {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
          totalPriceSet {
            presentmentMoney {
              amount
            }
          }
        }
      }
    }
  }
`;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState("");
  const { loading, error, data } = useQuery(QUERY_ORDERS, {
    variables: { orderNum: 2 },
  });

  const [selected, setSelected] = useState("newestUpdate");

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [{ label: "March", value: "March" }];

  const dataOrder = () => {
    if (data) {
      const arr = data.orders.edges.map((order) => {
        const {
          totalPriceSet: { presentmentMoney },
          name,
          lineItems: { edges },
        } = order.node;
        const price = edges.map(
          (item) => item.node.originalUnitPriceSet.shopMoney.amount
        );
        const rowsItems = [
          name,
          `$${price.toString()}`,
          `$${presentmentMoney.amount}`,
        ];
        return rowsItems;
      });
      setOrders(arr);
    }
  };

  const totalOrder = () => {
    let orderPrice = [];
    if (data) {
      data.orders.edges.forEach((order) => {
        const {
          totalPriceSet: { presentmentMoney },
        } = order.node;
        orderPrice.push(parseFloat(presentmentMoney.amount));
      });
      const totalSum = orderPrice.reduce((a, b) => a + b);
      setTotal(totalSum);
    }
  };

  useEffect(() => {
    dataOrder();
    totalOrder();
  }, [data]);

  if (error) return <div>{error.message}</div>;

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "20px",
            }}
          >
            <DisplayText size="medium" element="h6">
              Orders
            </DisplayText>
            <Select
              label="Sort by"
              labelInline
              options={options}
              onChange={handleSelectChange}
              value={selected}
            />
          </div>
          {!loading && orders.length && (
            <Card>
              <DataTable
                columnContentTypes={["text", "numeric", "numeric"]}
                headings={["Orders", "Price", "Net sales"]}
                rows={orders}
                totals={["", "", `$${total}`]}
              />
            </Card>
          )}
          {loading && <SkeletonBodyText />}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default OrderList;
