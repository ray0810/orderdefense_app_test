import {
  Heading,
  Page,
  Button,
  Card,
  Layout,
  FormLayout,
  Spinner,
  Banner,
  TextContainer,
  SettingToggle,
  TextStyle,
  SkeletonBodyText,
} from "@shopify/polaris";
import { Query } from "react-apollo";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState, useCallback, useEffect } from "react";

const INJECT_SCRIPT = gql`
  mutation scriptTagCreate($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_SCRIPT = gql`
  mutation scriptTagDelete($id: ID!) {
    scriptTagDelete(id: $id) {
      deletedScriptTagId
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
      }
      shop {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const Index = () => {
  const [
    deleteScripts,
    { loading: deleteScriptLoading, data: deleteScriptData },
  ] = useMutation(DELETE_SCRIPT);
  const [
    injectScript,
    { loading: injectScriptLoading, data: injectScriptFile },
  ] = useMutation(INJECT_SCRIPT);
  const [
    createProduct,
    { loading: createProductLoading, data: createProductData },
  ] = useMutation(CREATE_PRODUCT);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [active, setActive] = useState(true);
  const handleToggle = useCallback(() => setActive((active) => !active), []);
  const contentStatus = active ? "Disable" : "Enable";
  const textStatus = active ? "enabled" : "disabled";
  const onSubmitDelete = useCallback(async () => {
    deleteScripts({
      variables: {
        id: "gid://shopify/ScriptTag/162015641774",
      },
    });

    console.log("script deleted");
    //setShowSuccessBanner(false);
  }, []);

  const changeStatus = useCallback(() => {
    handleToggle();
    if (!active) {
      onSubmitMutation();
      onSubmitInject();
    }
    if (active) {
      setShowSuccessBanner(false);
      onSubmitDelete();
    }
  });
  const onSubmitInject = useCallback(async () => {
    await injectScript({
      variables: {
        input: {
          displayScope: "ONLINE_STORE",
          src: "https://orderdefense.com/appscript.js",
        },
      },
    });
    await injectScript({
      variables: {
        input: {
          displayScope: "ONLINE_STORE",
          src:
            "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
        },
      },
    });

    console.log("script installed");
    setShowSuccessBanner(true);
  }, []);
  const onSubmitMutation = useCallback(async () => {
    await createProduct({
      variables: {
        input: {
          title: "OrderDefense",
          productType: "OrderDefense",
          vendor: "OrderDefense",
          images: [
            {
              src:
                "https://orderdefense.com/wp-content/uploads/2021/02/orderdefense-icon.jpg",
            },
          ],
          options: ["Price"],
          variants: [
            {
              price: "0.95",
              sku: "OD01",
              options: ["$0.95"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "1.05",
              sku: "OD02",
              options: ["$1.05"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "1.16",
              sku: "OD03",
              options: ["$1.16"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "1.27",
              sku: "OD04",
              options: ["$1.27"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "1.38",
              sku: "OD05",
              options: ["$1.38"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "1.50",
              sku: "OD06",
              options: ["$1.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "1.63",
              sku: "OD07",
              options: ["$1.63"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "1.76",
              sku: "OD08",
              options: ["$1.76"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "1.89",
              sku: "OD09",
              options: ["$1.89"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "2.03",
              sku: "OD10",
              options: ["$2.03"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "2.18",
              sku: "OD11",
              options: ["$2.18"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "2.33",
              sku: "OD12",
              options: ["$2.33"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "2.48",
              sku: "OD13",
              options: ["$2.48"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "2.64",
              sku: "OD14",
              options: ["$2.64"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "2.81",
              sku: "OD15",
              options: ["$2.81"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "2.98",
              sku: "OD16",
              options: ["$2.98"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "3.15",
              sku: "OD17",
              options: ["$3.15"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "3.33",
              sku: "OD18",
              options: ["$3.33"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "3.52",
              sku: "OD19",
              options: ["$3.52"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "3.71",
              sku: "OD20",
              options: ["$3.71"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "3.90",
              sku: "OD21",
              options: ["$3.90"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "4.10",
              sku: "OD22",
              options: ["$4.10"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "4.31",
              sku: "OD23",
              options: ["$4.31"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "4.52",
              sku: "OD24",
              options: ["$4.52"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "4.73",
              sku: "OD25",
              options: ["$4.73"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "4.95",
              sku: "OD26",
              options: ["$4.95"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "5.18",
              sku: "OD27",
              options: ["$5.18"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "5.41",
              sku: "OD28",
              options: ["$5.41"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "5.64",
              sku: "OD29",
              options: ["$5.64"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "5.88",
              sku: "OD30",
              options: ["$5.88"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "6.13",
              sku: "OD31",
              options: ["$6.13"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "6.38",
              sku: "OD32",
              options: ["$6.38"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "6.63",
              sku: "OD33",
              options: ["$6.63"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "6.89",
              sku: "OD34",
              options: ["$6.89"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "7.16",
              sku: "OD35",
              options: ["$7.16"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "7.43",
              sku: "OD36",
              options: ["$7.43"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "7.70",
              sku: "OD37",
              options: ["$7.70"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "7.98",
              sku: "OD38",
              options: ["$7.98"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "8.27",
              sku: "OD39",
              options: ["$8.27"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "8.56",
              sku: "OD40",
              options: ["$8.56"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "8.85",
              sku: "OD41",
              options: ["$8.85"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "9.15",
              sku: "OD42",
              options: ["$9.15"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "9.61",
              sku: "OD43",
              options: ["$9.61"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "10.08",
              sku: "OD44",
              options: ["$10.08"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "10.56",
              sku: "OD45",
              options: ["$10.56"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "11.05",
              sku: "OD46",
              options: ["$11.05"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "11.55",
              sku: "OD47",
              options: ["$11.55"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "12.06",
              sku: "OD48",
              options: ["$12.06"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "12.58",
              sku: "OD49",
              options: ["$12.58"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "13.11",
              sku: "OD50",
              options: ["$13.11"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "13.65",
              sku: "OD51",
              options: ["$13.65"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "14.20",
              sku: "OD52",
              options: ["$14.20"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "14.76",
              sku: "OD53",
              options: ["$14.76"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "15.33",
              sku: "OD54",
              options: ["$15.33"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "15.91",
              sku: "OD55",
              options: ["$15.91"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "16.50",
              sku: "OD56",
              options: ["$16.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "17.10",
              sku: "OD57",
              options: ["$17.10"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "17.71",
              sku: "OD58",
              options: ["$17.71"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "18.33",
              sku: "OD59",
              options: ["$18.33"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "18.96",
              sku: "OD60",
              options: ["$18.96"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "19.60",
              sku: "OD61",
              options: ["$19.60"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "20.25",
              sku: "OD62",
              options: ["$20.25"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "21.53",
              sku: "OD63",
              options: ["$21.53"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "22.83",
              sku: "OD64",
              options: ["$22.83"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "24.15",
              sku: "OD65",
              options: ["$24.15"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "25.50",
              sku: "OD66",
              options: ["$25.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "26.88",
              sku: "OD67",
              options: ["$26.88"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "28.28",
              sku: "OD68",
              options: ["$28.28"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "29.70",
              sku: "OD69",
              options: ["$29.70"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "31.15",
              sku: "OD70",
              options: ["$31.15"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "32.63",
              sku: "OD71",
              options: ["$32.63"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "34.13",
              sku: "OD72",
              options: ["$34.13"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "35.65",
              sku: "OD73",
              options: ["$35.65"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "37.20",
              sku: "OD74",
              options: ["$37.20"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "39.95",
              sku: "OD75",
              options: ["$39.95"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "42.75",
              sku: "OD76",
              options: ["$42.75"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "45.60",
              sku: "OD77",
              options: ["$45.60"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "48.50",
              sku: "OD78",
              options: ["$48.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "51.45",
              sku: "OD79",
              options: ["$51.45"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "54.45",
              sku: "OD80",
              options: ["$54.45"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "57.50",
              sku: "OD81",
              options: ["$57.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "60.60",
              sku: "OD82",
              options: ["$60.60"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "63.75",
              sku: "OD83",
              options: ["$63.75"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "66.95",
              sku: "OD84",
              options: ["$66.95"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "70.20",
              sku: "OD85",
              options: ["$70.20"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "73.50",
              sku: "OD86",
              options: ["$73.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "76.85",
              sku: "OD87",
              options: ["$76.85"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "82.50",
              sku: "OD88",
              options: ["$82.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "96.00",
              sku: "OD89",
              options: ["$96.00"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "110.50",
              sku: "OD90",
              options: ["$110.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "126.00",
              sku: "OD91",
              options: ["$126.00"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "142.50",
              sku: "OD92",
              options: ["$142.50"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "160.00",
              sku: "OD93",
              options: ["$160.00"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "225.00",
              sku: "OD94",
              options: ["$225.00"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "300.00",
              sku: "OD95",
              options: ["$300.00"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "385.00",
              sku: "OD96",
              options: ["$385.00"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "480.00",
              sku: "OD97",
              options: ["$480.00"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "585.00",
              sku: "OD98",
              options: ["$585.00"],
              requiresShipping: false,
              taxable: false,
            },
            {
              price: "700.00",
              sku: "OD99",
              options: ["$700.00"],
              requiresShipping: false,
              taxable: false,
            },
          ],
          published: true,
        },
      },
    });
    setShowSuccessBanner(true);
  }, []);

  useEffect(() => {
    onSubmitMutation();
    onSubmitInject();
    setShowSuccessBanner(true);
  }, []);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <SettingToggle
              action={{
                content: contentStatus,
                onAction: changeStatus,
              }}
              enabled={active}
            >
              OrderDefense is{" "}
              <TextStyle variation="strong">{textStatus}</TextStyle>
            </SettingToggle>
          </Card>
          <Card sectioned>
            <FormLayout>
              <Heading>OrderDefense Product Installation</Heading>
              {createProductData && showSuccessBanner && (
                <Banner
                  title={`OrderDefense successfully created.`}
                  status="success"
                />
              )}
              {!showSuccessBanner && !createProductLoading && (
                <Banner
                  title={`OrderDefense is not installed.`}
                  status="info"
                />
              )}
              {createProductLoading && <SkeletonBodyText />}
            </FormLayout>
          </Card>
          <Card sectioned>
            <FormLayout>
              <Heading>OrderDefense Script Installation</Heading>
              {injectScriptFile && showSuccessBanner && (
                <Banner title={`Script installed`} status="success" />
              )}
              {!showSuccessBanner && !injectScriptLoading && (
                <Banner
                  title={`OrderDefense Script is not installed.`}
                  status="info"
                />
              )}
              {injectScriptLoading && <SkeletonBodyText />}
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
