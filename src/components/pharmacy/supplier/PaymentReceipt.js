import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";
import { toCamelCase } from "../../utils/helpers";
export function DepositReceipt({
  facilityDetails = {},
  depositDetails = {},
  receiptSN,
  user,
}) {
  return (
    <Document>
      <Page size={{ width: 200 }} style={styles.body}>
        <View>
          <View style={styles.headerContainer}>
            {/* <Image style={styles.image}
            source={{ uri: facilityDetails.logo }}
             /> */}
            <Text style={styles.title}>{facilityDetails.printTitle}</Text>
            <Text style={styles.subtitle}>{facilityDetails.printSubtitle1}</Text>
            <Text style={styles.subtitle}>{facilityDetails.printSubtitle2}</Text>
          </View>
          <View style={styles.item}>
            <Text style={{ marginRight: 5 }}>Date:</Text>
            <Text>{moment(depositDetails.date).format("LL")}</Text>
          </View>
          <View style={styles.item}>
            <Text style={{ marginRight: 5 }}>Name:</Text>
            <View>
              <Text>{depositDetails.name}</Text>
              {/* <Text>{`RPL/${depositDetails.accountNo}`}</Text> */}
            </View>
          </View>

          <View style={styles.item}>
            <Text style={{ marginRight: 5 }}>Description:</Text>
            <Text>
              {depositDetails.narration || depositDetails.description}
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={{ marginRight: 5 }}>Amount:</Text>
            <Text>{depositDetails.amount}</Text>
          </View>

          <View style={styles.item}>
            <Text style={{ marginRight: 5 }}>Mode of payment:</Text>
            <Text>{toCamelCase(depositDetails.modeOfPayment)}</Text>
          </View>

          <View style={styles.item}>
            <Text style={{ marginRight: 5 }}>Receipt Number:</Text>
            <Text>{receiptSN}</Text>
          </View>
          <View style={styles.item}>
            <Text style={{ marginRight: 5 }}>Cashier:</Text>
            <Text>{user}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingVertical: 3,
    fontSize: 8,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: "CustomRoboto",
  },
  subtitle: {
    fontSize: 10,
    fontFamily: "CustomRoboto",
    textAlign:"center"
  },
  author: {
    fontSize: 12,
    marginBottom: 20,
  },
  subtitle2: {
    fontSize: 18,
    // marginBottom: 30,
  },
  image: {
    height: 60,
    width: 50,
  },
  headerContainer: {
    // flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
  },
  item: {
    flexDirection: "row",
    marginVertical: 3,
  },
});
