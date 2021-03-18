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
          createdAt
          displayFulfillmentStatus
          tags
          presentmentCurrencyCode
          lineItems(first: 5) {
            edges {
              node {
                id
                name
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
  const [options, setOptions] = useState([]);
  const [sortedRows, setSortedRows] = useState(null);
  const [selected, setSelected] = useState("All");
  const [filteredData, setFilteredData] = useState([]);

  const { loading, error, data } = useQuery(QUERY_ORDERS, {
    variables: { orderNum: 50 },
  });

  const handleSelectChange = useCallback(
    (value) => {
      setSelected(value);
      sortCurrency(value);
      if (value === "All") {
        setSortedRows(orders);
      }
    },
    [filteredData]
  );

  const dataOrder = () => {
    if (data) {
      const arr = data.orders.edges.filter((edge) => {
        const {
          lineItems: { edges },
        } = edge.node;
        const productName = edges.find((item) =>
          item.node.name.includes("OrderDefense")
        );
        return productName;
      });
      setFilteredData(arr);
      const newArr = arr.map((order) => {
        const {
          totalPriceSet: { presentmentMoney },
          name,
          createdAt,
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
      setOrders(newArr);
    }
  };

  const optionsData = () => {
    if (filteredData.length) {
      const arr = filteredData.map((order) => {
        const { createdAt } = order.node;
        const formatter = new Intl.DateTimeFormat("en-US", { month: "long" });
        const month = formatter.format(new Date(createdAt));
        const option = { label: month, value: month };
        return option;
      });
      const filteredOptions = arr.filter(
        (option, index, self) =>
          index ===
          self.findIndex(
            (obj) => obj.label === option.label && obj.value === option.value
          )
      );
      setOptions([{ label: "All", value: "All" }, ...filteredOptions]);
    }
  };

  const totalOrder = () => {
    if (filteredData.length) {
      const orderPrice = filteredData.map((order) => {
        const {
          totalPriceSet: { presentmentMoney },
        } = order.node;
        const money = parseFloat(presentmentMoney.amount);
        return money;
      });
      const totalSum = orderPrice.reduce((a, b) => a + b);
      setTotal(totalSum);
    }
  };

  const rows = sortedRows ? sortedRows : orders;

  const sortCurrency = (value) => {
    if (value) {
      const arr = filteredData.filter((order) => {
        const month = new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(new Date(order.node.createdAt));
        return month == value;
      });

      const arrFiltered = arr.map((order) => {
        const {
          totalPriceSet: { presentmentMoney },
          name,
          createdAt,
          lineItems: { edges },
        } = order.node;
        const productName = edges.filter((item) =>
          item.node.name.includes("OrderDefense")
        );
        const price = productName.map(
          (item) => item.node.originalUnitPriceSet.shopMoney.amount
        );
        const rowsItems = [
          name,
          `$${price.toString()}`,
          `$${presentmentMoney.amount}`,
        ];
        return rowsItems;
      });

      setSortedRows(arrFiltered);
    }
  };

  useEffect(() => {
    dataOrder();
  }, [data]);

  useEffect(() => {
    optionsData();
    totalOrder();
  }, [filteredData]);

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
          {!loading && (
            <Card>
              <DataTable
                columnContentTypes={["text", "numeric", "numeric"]}
                headings={["Orders", "Price", "Net sales"]}
                rows={rows}
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
