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
  Button,
} from "@shopify/polaris";
import gql from "graphql-tag";

// const QUERY_ORDERS = gql`
//   query($orderNum: Int!) {
//     orders(first: $orderNum) {
//       pageInfo {
//         hasNextPage
//         hasPreviousPage
//       }
//       edges {
//         cursor
//         node {
//           id
//           name
//           createdAt
//           displayFulfillmentStatus
//           tags
//           presentmentCurrencyCode
//           lineItems(first: 5) {
//             edges {
//               node {
//                 id
//                 name
//                 originalUnitPriceSet {
//                   shopMoney {
//                     amount
//                   }
//                 }
//               }
//             }
//           }
//           totalPriceSet {
//             presentmentMoney {
//               amount
//             }
//           }
//         }
//       }
//     }
//   }
// `;

const QUERY_ORDERS = gql`
  query($orderNum: Int!) {
    orders(first: $orderNum) {
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
  const [page, setPage] = useState(50);

  const { loading, error, data } = useQuery(QUERY_ORDERS, {
    variables: { orderNum: page },
  });

  const handleSelectChange = useCallback(
    (value) => {
      setSelected(value);
      sortCurrency(value);
      if (value === "All") {
        totalOrder();
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
          // totalPriceSet: { presentmentMoney },
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
          `$${price[0] && price[0].toString()}`,
          // `$${presentmentMoney.amount}`,
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
          // totalPriceSet: { presentmentMoney },
          lineItems: { edges },
        } = order.node;

        const productName = edges.filter((item) =>
          item.node.name.includes("OrderDefense")
        );

        const price = productName.map(
          (item) => item.node.originalUnitPriceSet.shopMoney.amount
        );

        // const money = parseFloat(presentmentMoney.amount);
        // return money;
        return price && price.length ? price[0] : 0;
      });
      const totalSum = orderPrice
        .reduce((a, b) => Number(a) + Number(b))
        .toFixed(2);
      setTotal(totalSum);
    }
  };

  const rows = sortedRows ? sortedRows : orders;

  const sortCurrency = (value) => {
    let total = 0;
    if (value) {
      const arr = filteredData.filter((order) => {
        const month = new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(new Date(order.node.createdAt));
        return month == value;
      });
      const arrFiltered = arr.map((order) => {
        const {
          // totalPriceSet: { presentmentMoney },
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
        if (price && price[0]) {
          total = total + Number(price[0]);
        }
        const rowsItems = [
          name,
          `$${price[0] && price[0].toString()}`,
          // `$${presentmentMoney.amount}`,
        ];
        return rowsItems;
      });
      setSortedRows(arrFiltered);
      setTotal(total.toFixed(2));
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
            <>
              <Card>
                <DataTable
                  columnContentTypes={["text", "numeric"]}
                  headings={["Orders", "Price"]}
                  rows={rows}
                  totals={["", `$${total}`]}
                />
              </Card>
              {filteredData.length >= 50 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <Button primary onClick={() => setPage(page + 50)}>
                    Load More...
                  </Button>
                </div>
              )}
            </>
          )}
          {loading && <SkeletonBodyText />}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default OrderList;
