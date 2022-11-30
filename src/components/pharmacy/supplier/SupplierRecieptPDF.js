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
import moment from "moment";
import customRobotoNormal from "../../../fonts/Roboto-Regular.ttf";
import customRobotoBold from "../../../fonts/Roboto-Bold.ttf";
import { formatNumber } from "../../utils/helpers";
// import { formatNumber } from '../../utilities';
// import Logo from "../../../assets/images/loogo.png";
const SupplierRecieptPDF = ({
  data = [],
  name = "",
  client = {},
  type = "",
}) => {
  let remedix = {
    title: "Remedix Pharmacy Ltd.",
    sub1: "Sheikh Jafar road, Opposite Brains College,",
    sub2: "Dorayi, Kano",
    acronym: "RPL",
  };
  const total = data
    .map(
      (item) => parseFloat(item.quantity) * parseFloat(item.cr ? item.cr : 1)
    ).reduce((sum, init = 0) => sum + init);
    
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View>
          <View style={styles.headerContainer}>
            {/* <Image style={styles.image} alt="logo" src={Logo} /> */}
            <Text style={styles.title}>{remedix.title}</Text>
            <Text style={styles.subtitle}>{remedix.sub1}</Text>
            <Text style={styles.subtitle}>{remedix.sub2}</Text>
          </View>
          <View style={styles.name}>
            <Text>Name: {name}</Text>
            <Text>Date: {moment().format("YYYY-MM-DD")}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text>from: {client.from}</Text>
            <Text>To: {client.to}</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCol1Header, width: 30 }}>
                <Text style={{ ...styles.tableCellHeader, width: 30 }}>SN</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Description</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={[styles.tableCellHeader, styles.textCenter]}>
                  Qty
                </Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={[styles.tableCellHeader, styles.text_right]}>
                  Cost Of Items (₦)
                </Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={[styles.tableCellHeader, styles.text_right]}>
                  Amount paid (₦)
                </Text>
              </View>
            </View>
            {type !== "supplier"
              ? data.map((item, i) => (
                  <View style={styles.tableRow}>
                    <View style={{ ...styles.tableCol1Header, width: 30 }}>
                      <Text style={{ ...styles.tableCellHeader, width: 30 }}>
                        {i + 1}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCellHeader}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={[styles.tableCellHeader, styles.textCenter]}>
                        {item.quantity ? item.quantity : "-"}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={[styles.tableCellHeader, styles.text_right]}>
                        {item.dr ? formatNumber(item.dr) : "-"}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={[styles.tableCellHeader, styles.text_right]}>
                        {item.cr ? formatNumber(item.cr) : "-"}
                      </Text>
                    </View>
                  </View>
                ))
              : data.map((item, i) => (
                  <View style={styles.tableRow}>
                    <View style={{ ...styles.tableCol1Header, width: 30 }}>
                      <Text style={{ ...styles.tableCellHeader, width: 30 }}>
                        {i + 1}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={styles.tableCellHeader}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={[styles.tableCellHeader, styles.textCenter]}>
                        {item.quantity ? item.quantity : "-"}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={[styles.tableCellHeader, styles.text_right]}>
                        {item.cr ? formatNumber(item.cr) : "-"}
                      </Text>
                    </View>
                    <View style={styles.tableColHeader}>
                      <Text style={[styles.tableCellHeader, styles.text_right]}>
                        {item.dr ? formatNumber(item.dr) : "-"}
                      </Text>
                    </View>
                  </View>
                ))}
          </View>
        </View>
        <View style={styles.brainstorm}>
          <View style={styles.goodbyeTextContainer}>
            <Text style={styles.goodbyeText}>Thanks for patronizing us !</Text>
          </View>
          <View style={styles.goodbyeTextContainer}>
            <Text style={styles.goodbyeText}>Powered by: brainstormng.com</Text>
          </View>
        </View>
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
  ],
});

const COL1_WIDTH = 40;
const COLN_WIDTH = (100 - COL1_WIDTH) / 3;

const styles = StyleSheet.create({
  body: {
    paddingVertical: 5,
    fontSize: 10,
    paddingHorizontal: 5,
    fontFamily: "CustomRoboto",
  },
  image: {
    height: 50,
    width: 50,
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
  brainstorm: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  title: {
    fontSize: 11,
    // textAlign: 'center',
    fontFamily: "CustomRoboto",
    marginVertical: 2,
  },
  title1: {
    fontSize: 12,
    alignItems: "left",
    // textAlign: 'center',
    fontFamily: "CustomRoboto",
  },
  subtitle: {
    fontSize: 10,
    fontFamily: "CustomRoboto",
  },
  receipt: {
    fontSize: 6,
    fontFamily: "CustomRoboto",
    marginLeft: 10,
  },
  address: {
    fontSize: 6,
    fontFamily: "CustomRoboto",
  },
  table: {
    display: "table",
    width: "100%",
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  name: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingHorizontal: 20,
  },
  tableColHeader: {
    width: COLN_WIDTH + "%",
  },
  tableCol1: {
    width: COL1_WIDTH + "%",
  },
  tableCol: {
    width: COLN_WIDTH + "%",
  },
  tableColTotal: {
    width: 2 * COLN_WIDTH + "%",
  },
  tableCellHeader: {
    marginRight: 5,
    fontWeight: "bold",
  },
  tableCell: {
    marginVertical: 1,
    marginRight: 4,
    display: "flex",
  },
  goodbyeText: {
    fontSize: 6,
    textTransform: "capitalize",
    textAlign: "center",
  },
  goodbyeTextContainer: { marginTop: 2 },
  docTitle: {
    marginVertical: 6,
    fontSize: 11,
    fontWeight: "bold",
  },
  textRight: { textAlign: "right" },
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
  text_right: { textAlign: "right" },
});

export default SupplierRecieptPDF;
