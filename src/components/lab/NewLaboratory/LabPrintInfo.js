import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import customRobotoNormal from "../../../fonts/Roboto-Regular.ttf";
import customRobotoBold from "../../../fonts/Roboto-Bold.ttf";
import customRobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import CreditFooter from "../../comp/pdf-templates/credit-footer";
import { LabReceiptHeader } from "../../comp/pdf-templates/lab/receipts/lab-receipt-header";
import { formatNumber, getAgeFromDOB } from "../../utils/helpers";
import generalStyles from "../../comp/pdf-templates/styles";

const bordered = {
  borderTopColor: "#000",
  borderTopWidth: 1,
  borderRightColor: "#000",
  borderRightWidth: 1,
  borderBottomColor: "#000",
  borderBottomWidth: 1,
  borderLeftColor: "#000",
  borderLeftWidth: 1,
};

const LabPrintInfo = ({
  data = [],
  modeOfPayment = "Cash",
  cashier = "",
  discount = 0,
  transactionInfo = {},
  patientInfo = {},
  grandTotal = 0,
  user,
  facilityInfo,
  type,

  logo = "",
  data1 = [],
  name = "",
  receiptNo = "",
  labels = [],
  age = "",
}) => {
  let total = data.reduce((a, b) => a + parseFloat(b.price), 0) || 0;
  const isLater = type === "Later";

  let ss = [];
  labels.forEach((i) => {
    if (!ss.includes(i.specimen)) {
      ss.push(i.specimen);
    }
  });
  const sample = ss.join(", ");

  return (
    <Document>
      <Page style={styles.body}>
        <View>
          <LabReceiptHeader
            title=""
            showPatient={true}
            name={patientInfo.name}
            patientId={isLater ? patientInfo.id : patientInfo.patientId}
            dob={patientInfo.dob}
            age={
              patientInfo.ageY
                ? `${patientInfo.ageY} Y`
                : patientInfo.ageM
                ? `${patientInfo.ageM} M`
                : patientInfo.ageD
                ? `${patientInfo.ageD} D`
                : getAgeFromDOB(patientInfo.dob, "Y")
            }
            gender={patientInfo.gender}
            facilityInfo={facilityInfo}
          />

          <View style={[generalStyles.mv5, styles.receiptContainer]}>
            <Text style={[styles.title, styles.receipt]}>Receipt</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.headerBg]}>
              <View
                style={[
                  styles.tableColHeader,
                  styles.borderBottom,
                  styles.borderRight,
                ]}
              >
                <Text style={styles.tableCellHeader}>S/N</Text>
              </View>
              <View style={[styles.tableCol1Header, styles.borderBottom]}>
                <Text style={styles.tableCellHeader}>Test Name</Text>
              </View>
              <View style={[styles.tableColHeader, styles.borderBottom]}>
                <Text style={[styles.tableCellHeader]}>Amount (₦)</Text>
              </View>
            </View>
            {data.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View
                  style={[
                    styles.tableCol,
                    styles.borderBottom,
                    styles.borderRight,
                  ]}
                >
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View
                  style={[
                    styles.tableCol1,
                    styles.borderBottom,
                    styles.borderRight,
                  ]}
                >
                  <Text style={styles.tableCell}>{item.description}</Text>
                </View>

                <View style={[styles.tableCol, styles.borderBottom]}>
                  <Text style={[styles.tableCell, styles.textRight]}>
                    {formatNumber(item.price)}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.tableRow}>
              <View
                style={[
                  styles.tableCol,
                  styles.borderBottom,
                  styles.borderRight,
                ]}
              >
                <Text style={styles.tableCell} />
              </View>
              <View
                style={[
                  styles.tableCol1,
                  styles.borderBottom,
                  styles.borderRight,
                ]}
              >
                <Text style={styles.tableCell}>Total</Text>
              </View>

              <View style={[styles.tableCol, styles.borderBottom]}>
                <Text style={[styles.tableCell, styles.textRight]}>
                  {/* {`₦ ${formatNumber(total) || 0}`} */}
                  {isLater
                    ? `₦ ${formatNumber(total) || 0}`
                    : `₦ ${formatNumber(transactionInfo.totalAmount) || 0}`}
                </Text>
              </View>
            </View>
            {transactionInfo.discount !== "0" || transactionInfo !== 0 ? (
              <View style={styles.tableRow}>
                <View
                  style={[
                    styles.tableCol,
                    styles.borderBottom,
                    styles.borderRight,
                  ]}
                >
                  <Text style={styles.tableCell} />
                </View>
                <View
                  style={[
                    styles.tableCol1,
                    styles.borderBottom,
                    styles.borderRight,
                  ]}
                >
                  <Text style={styles.tableCell}>Discount</Text>
                </View>

                <View style={[styles.tableCol, styles.borderBottom]}>
                  <Text style={[styles.tableCell, styles.textRight]}>
                    {`₦ ${formatNumber(transactionInfo.discount) || 0}`}
                  </Text>
                </View>
              </View>
            ) : null}
            {transactionInfo.discount !== "0" || transactionInfo !== 0 ? (
              <View style={styles.tableRow}>
                <View
                  style={[
                    styles.tableCol,
                    styles.borderBottom,
                    styles.borderRight,
                  ]}
                >
                  <Text style={styles.tableCell} />
                </View>
                <View
                  style={[
                    styles.tableCol1,
                    styles.borderBottom,
                    styles.borderRight,
                  ]}
                >
                  <Text style={styles.tableCell}>Grand Total</Text>
                </View>

                <View style={[styles.tableCol, styles.borderBottom]}>
                  <Text style={[styles.tableCell, styles.textRight]}>
                    {`₦ ${formatNumber(transactionInfo.finalTotal) || 0}`}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
          <View style={styles.paymentRow}>
            <View style={styles.item}>
              <Text style={styles.mr5}>Mode of payment:</Text>
              <Text>{modeOfPayment}</Text>
            </View>
          </View>
          <View style={styles.paymentRow}>
            <View style={styles.item}>
              <Text style={styles.mr5}>Cashier:</Text>
              <Text>{isLater ? data[0].enteredBy : cashier}</Text>
            </View>
          </View>
        </View>
        <CreditFooter />
      </Page>


      <Page style={styles.body}>
        <View>
          <LabReceiptHeader
            title=""
            showPatient={true}
            name={patientInfo.name}
            patientId={isLater ? patientInfo.id : patientInfo.patientId}
            dob={patientInfo.dob}
            age={
              patientInfo.ageY
                ? `${patientInfo.ageY} Y`
                : patientInfo.ageM
                ? `${patientInfo.ageM} M`
                : patientInfo.ageD
                ? `${patientInfo.ageD} D`
                : getAgeFromDOB(patientInfo.dob, "Y")
            }
            gender={patientInfo.gender}
            facilityInfo={facilityInfo}
          />

          <View style={[generalStyles.mv5, styles.samplingDetails]}>
            <Text
              style={[
                styles.title,
                styles.textCenter,
                styles.samplingDetailsText,
              ]}
            >
              Sampling Details
            </Text>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.headerBg]}>
              <View
                style={[
                  styles.tableColHeader,
                  { borderBottomWidth: 1, borderBottomColor: "#000" },
                ]}
              >
                <Text style={[styles.tableCellHeader, styles.textCenter]}>
                  Test Name
                </Text>
              </View>

              <View style={styles.tableColHeader}>
                <Text style={[styles.tableCellHeader, styles.textCenter]}>
                  Samples
                </Text>
              </View>
            </View>

            {data1.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View
                  style={[
                    styles.tableCol,
                    index === data.length - 1
                      ? null
                      : { borderBottomWidth: 1, borderBottomColor: "#000" },
                  ]}
                >
                  <Text style={styles.tableCell}>
                    {isLater ? item.test : item.description}
                  </Text>
                </View>

                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.textCenter]}>
                    {index === 0 ? sample : isLater ? item.specimen : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <CreditFooter />
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
// const COL_AMT_WIDTH = 40;
const COLN_WIDTH = (100 - COL1_WIDTH) / 2;

const styles = StyleSheet.create({
  body: {
    padding: 20,
    fontSize: 12,
    paddingHorizontal: 40,
    fontFamily: "CustomRoboto",
  },
  headerBg: {
    backgroundColor: "#aaa",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: 'space-between'
  },
  leftInfo: {
    display: "flex",
    flexDirection: "row",
    width: "50%",
  },
  details: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  infoItem: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 1,
  },
  infoKey: {
    marginRight: 10,
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
    fontSize: 16,
    // textAlign: 'center',
    fontFamily: "CustomRoboto",
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "CustomRoboto",
  },
  table: {
    display: "table",
    width: "100%",
    marginVertical: 6,
    ...bordered,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowTotal: {
    flexDDirection: "row",
  },
  tableCol1Header: {
    width: COL1_WIDTH + "%",
    paddingHorizontal: 5,
  },
  tableColHeader: {
    width: COLN_WIDTH + "%",
    paddingHorizontal: 5,
  },
  // tableColAmtHeader: {
  //   width: COL_AMT_WIDTH + '%',
  // },
  tableCol1: {
    width: COL1_WIDTH + "%",
    paddingHorizontal: 5,
  },
  // tableColAmt: {
  //   width: COL_AMT_WIDTH + '%',
  // },
  tableCol: {
    width: COLN_WIDTH + "%",
    paddingHorizontal: 5,
  },
  tableColTotal: {
    width: COLN_WIDTH + "%",
    marginTop: 3,
    paddingHorizontal: 5,
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
    fontSize: 12,
    textTransform: "capitalize",
    textAlign: "center",
  },
  goodbyeTextContainer: {
    marginTop: 2,
  },
  docTitle: {
    marginVertical: 6,
    fontSize: 12,
    fontWeight: "bold",
  },
  textRight: { textAlign: "right" },
  snter: { textAlign: "center" },
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
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  poweredBy: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
    fontFamily: "CustomRoboto",
    fontStyle: "italic",
  },
  amtCol: {},
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  receipt: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  receiptContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LabPrintInfo;
