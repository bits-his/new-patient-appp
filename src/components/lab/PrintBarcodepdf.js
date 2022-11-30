import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
// import { toCamelCase } from '../../utils/helpers';
import customRobotoNormal from "./../../fonts/Roboto-Regular.ttf";
import customRobotoBold from "./../../fonts/Roboto-Bold.ttf";
import customRobotoItalic from "./../../fonts/Roboto-Italic.ttf";
import { useBarcode } from "react-barcodes";

function BarCodes({ value }) {
  const { inpuViewef } = useBarcode({
    value: value,
    options: {
      height: 60,
      fontSize: 10,
    },
  });

  return <Image ref={inpuViewef} alt="_barcode" />;
}
const PrintBarcodePdf = ({ labels }) => {
  return (
    <Document>
      <Page size={{ width: 200 }} style={styles.body}>
        {labels.map((item, index) => {
          if (item.type === "info") {
            return (
              <View key={index} className="m-0 p-0">
                <View>
                  <View>
                    <Text>{item.name}</Text>
                  </View>
                  <View>
                    <Text>
                      <BarCodes
                        value={item.code && item.code.split("-").join("")}
                      />
                    </Text>
                  </View>
                </View>
              </View>
            );
          } else {
            let disp = [];
            for (let i = 0; i < item.noOfLabels; i++) {
              disp.push(
                <View key={index} className="m-0 p-0">
                  <View>
                    <View>
                      <Text>{item.timestamp}</Text>
                    </View>
                    <View>
                      <Text>{item.sample}</Text>
                    </View>
                    <View>
                      <Text>
                        <Text className="acc-no">{item.accNo}</Text>
                        <Text>\{item.patientName}</Text>
                      </Text>
                    </View>
                    <View>
                      <Text>{item.tests}</Text>
                      <Text>
                        <BarCodes
                          value={item.code && item.code.split("-").join("")}
                        />
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }
            return disp;
          }
        })}
      </Page>
    </Document>
  );
};

Font.register({
  family: "CustomRoboto",
  fonts: [
    { src: customRobotoNormal },
    {
      src: customRobotoBold,
      fontStyle: "normal",
      fontWeight: "bold",
    },
    {
      src: customRobotoItalic,
      fontStyle: "italic",
    },
  ],
});

const COL1_WIDTH = 40;
const COL_AMT_WIDTH = 20;
const COLN_WIDTH = (100 - (COL1_WIDTH + COL_AMT_WIDTH)) / 2;

const styles = StyleSheet.create({
  body: {
    paddingVertical: 5,
    fontSize: 8,
    paddingHorizontal: 10,
    fontFamily: "CustomRoboto",
  },
  image: {
    height: 40,
    width: 40,
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    marginVertical: 3,
  },
  title: {
    fontSize: 12,
    // textAlign: 'center',
    fontFamily: "CustomRoboto",
  },
  subtitle: {
    fontSize: 8,
    fontFamily: "CustomRoboto",
  },
  table: {
    display: "table",
    width: "100%",
    marginVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowTotal: {
    flexDDirection: "row",
  },
  tableCol1Header: {
    width: COL1_WIDTH + "%",
  },
  tableColHeader: {
    width: COLN_WIDTH + "%",
  },
  tableColAmtHeader: {
    width: COL_AMT_WIDTH + "%",
  },
  tableCol1: {
    width: COL1_WIDTH + "%",
  },
  tableColAmt: {
    width: COL_AMT_WIDTH + "%",
  },
  tableCol: {
    width: COLN_WIDTH + "%",
  },
  tableColTotal: {
    width: 2 * COLN_WIDTH + "%",
  },
  tableCellHeader: {
    // marginRight: 5,
    fontWeight: "bold",
  },
  tableCell: {
    marginVertical: 1,
    // marginRight: 4,
  },
  goodbyeText: {
    fontSize: 8,
    textViewansform: "capitalize",
    textAlign: "center",
  },
  goodbyeTextContainer: {
    marginTop: 2,
  },
  docTitle: {
    marginVertical: 6,
    fontSize: 10,
    fontWeight: "bold",
  },
  texViewight: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  mr5: { marginRight: 5 },
  fontWeightBold: { fontWeight: "bold" },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    paddingTop: 3,
  },
  mt1: {
    marginTop: 2,
  },
  receiptNo: {
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  paymenViewow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  poweredBy: {
    fontSize: 8,
    marginTop: 6,
    textAlign: "center",
    fontFamily: "CustomRoboto",
    fontStyle: "italic",
  },
  amtCol: {},
});

export default PrintBarcodePdf;
