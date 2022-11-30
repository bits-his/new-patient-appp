import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";
import { formatNumber } from "../utils/helpers";

const BORDER_COLOR = "#000";
const BORDER_STYLE = "solid";
const COL1_WIDTH = 9.99;
const COL2_WIDTH = 38;
const COL3_WIDTH = 10;
const COLN_WIDTH = (100 - COL2_WIDTH - COL3_WIDTH) / 3;

export function DispensaryInventoryPDF({ list = [], branch = "", type = "" }) {
  // const isSales = type === "sale department"

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View style={styles.new}>
          <Text>List Of Inventory For {branch} - {type} </Text>
        </View>
        <View style={styles.new2}>
          <Text> As Of : {moment().format("DD-MM-YYYY")}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol3Header}>
              <Text style={[styles.tableCellHeader, { textAlign: "center" }]}>
                S/N
              </Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={[styles.tableCellHeader, { textAlign: "center" }]}>
                Item Name
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={[styles.tableCellHeader, { textAlign: "center" }]}>
                Selling Price
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={[styles.tableCellHeader, { textAlign: "center" }]}>
                Quantity
              </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={[styles.tableCellHeader, { textAlign: "center" }]}>
                Expiry
              </Text>
            </View>
          </View>
          {list.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol3}>
                <Text style={[styles.tableCell, { textAlign: "center" }]}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{item.item_name}</Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  {formatNumber(item.unit_price)
                    ? formatNumber(item.unit_price)
                    : formatNumber(item.selling_price) || 0}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, { textAlign: "center" }]}>
                  {formatNumber(item.balance)
                    ? formatNumber(item.balance)
                    : formatNumber(item.quantity) || 0}
                </Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  {item.expiring_date}
                </Text>
              </View>
              {/* <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.location_from}</Text>
              </View> */}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  new: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 18,
    // textAlign: "center",
    margin: 5,
    fontWeight: 'bold'
  },
  new2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 18,
    // textAlign: "center",
    margin: 5,
    fontWeight: 'bold'
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol1Header: {
    width: COL1_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol2Header: {
    width: COL2_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol3Header: {
    width: COL3_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColHeader: {
    width: COLN_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol1: {
    width: COL1_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol2: {
    width: COL2_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderRadius: 2,
    paddingBottom: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol3: {
    width: COL3_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderRadius: 2,
    paddingBottom: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: COLN_WIDTH + "%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  tableCell1: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 10,
  },
});
