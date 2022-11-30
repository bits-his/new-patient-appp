import React, { useEffect, useCallback, useState } from "react";
import { CardBody, CardHeader } from "reactstrap";
import CustomTable from "../../../comp/components/CustomTable";
import Card from "reactstrap/lib/Card";
import { useSelector } from "react-redux";
import moment from "moment";
import { apiURL } from "../../../../redux/actions";
import { formatNumber, generateReceiptNo } from "../../../utils/helpers";
import { useQuery } from "../../../../hooks";
import InputGroup from "../../../comp/components/InputGroup";
import CustomButton from "../../../comp/components/Button";
import { _postApi, _updateApi } from "../../../../redux/actions/api";
import { saveTransaction } from "../../../doc_dash/actions/helpers/processLabTransaction";
import SelectInput from "../../../comp/components/SelectInput";
import BackButton from "../../../comp/components/BackButton";
import { useHistory } from "react-router";

function PendingPaymentsDetail() {
  const query = useQuery();
  const user = useSelector((state) => state.auth.user);
  const history = useHistory();
  const today = moment().format("YYYY-MM-DD");
  // reference=17072123&account=12&patient_id=12-1
  let reference = query.get("reference");
  let account = query.get("account");
  let patient_id = query.get("patient_id");
  let name = query.get("name");

  const [submitting, setSubmitting] = useState(false);

  const fields = [
    {
      title: "Lab Test",
      value: "description",
    },
    {
      title: "Total",
      // value: "total",
      custom: true,
      component: (item) => (
        <div className="text-right">{formatNumber(item.total)}</div>
      ),
    },
    {
      title: "Paid",
      // value: "paid",
      custom: true,
      component: (item) => (
        <div className="text-right">{formatNumber(item.paid)}</div>
      ),
    },
    {
      title: "Balance",
      custom: true,
      component: (item) => (
        <div className="text-right">{formatNumber(item.balance)}</div>
      ),
    },
  ];

  //   const [grandTotal, setGrandTotal] = useState([]);
  const [list, setList] = useState([]);

  const [form, setForm] = useState({ modeOfPayment: "Cash" });

  const getList = useCallback(
    () => {
      fetch(
        `${apiURL()}/lab/lab-summary?type=detail_by_receipt&report_by=${reference}&patient_id=${patient_id}&facilityId=${
          user.facilityId
        }`
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success && data.results) {
            const totalAmount = data.results.reduce(
              (a, b) => a + parseInt(b.total),
              0
            );
            const totalPaid = data.results.reduce(
              (a, b) => a + parseInt(b.paid),
              0
            );
            const totalBalance = data.results.reduce(
              (a, b) => a + parseInt(b.balance),
              0
            );
            // let obj = {
            //   description: "Total",
            //   paid: totalPaid,
            //   balance: totalBalance,
            //   total: totalAmount,
            //   style: { fontWeight: "bold" },
            // };
            setForm((p) => ({ ...p, totalBalance, amountPaid: totalBalance }));
            // let final = [...data.results, obj];
            setList(data.results);
          }
        })
        .catch((err) => console.log(err));
    },
    [today, user]
  );

  useEffect(
    () => {
      getList();
    },
    [getList]
  );

  const formIsValid =
    form.amountPaid &&
    form.amountPaid !== "" &&
    form.amountPaid !== 0 &&
    false.amountPaid !== "";

  const handleChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = () => {
    if (formIsValid) {
      setSubmitting(true);

      // _postApi()
      // saveTransaction()
      // generateReceiptNo((rec, receiptNo) => {
      let transactionsList = [];
      let isPartment =
        parseFloat(form.amountPaid) < parseFloat(form.totalBalance);
      let totalAmount = form.totalBalance;
      let amountPaid = form.amountPaid;

      for (let h = 0; h < list.length; h++) {
        let item = list[h];

        // name = "",
        // accountType = "",
        // guarantor_name = "",
        // guarantor_address = "",
        // guarantor_phoneNo = "",
        // bankName = "",

        transactionsList.push({
          transactionType: "deposit",
          facilityId: user.facilityId,
          // department: item.department,
          amount: item.balance,
          serviceHead: item.account,
          modeOfPayment: form.modeOfPayment,
          source: item.account,
          destination: "Cash",
          description: item.description,
          receiptsn: reference,
          receiptno: "",
          userId: user.id,
          // credit: item.account,
          // debit: patient_id,
          patientId: patient_id,
          clientAccount: account,
          isPartment,
          totalAmount,
          depositAmount:item.balance,
          txn_status: isPartment ? "pending" : "completed",
        });
        // }
      }

      _postApi(
        `${apiURL()}/transactions/bulk-deposit`,
        { data: transactionsList },
        () => {
          console.log("success");

          if (!isPartment) {
            updateTxnStatus(reference, "completed");
          }
          setSubmitting(false);

          // setTimeout(() => history.push("/me/lab/patients/pending-payments"), 1000);
          history.push("/me/lab/patients/pending-payments")
        },
        (err) => {
          console.log(err);
          // setLoading(false);
        }
      );

      // transactionsList.forEach((trans) => {
      //   _postApi(
      //     `${apiURL()}/transactions/new-service/instant-payment`,
      //     { data },
      //     () => {
      //       console.log("success");
      //       // setLoading(false);
      //       // reset();
      //     },
      //     (err) => {
      //       console.log(err);
      //       // setLoading(false);
      //     }
      //   );
      // });
      // });

    }
  };

  const updateTxnStatus = (reference_no, status) => {
    _updateApi(
      `${apiURL()}/lab/update-account-state`,
      { reference_no, status },
      () => {
        console.log("status updated");
      },
      () => {
        console.log("error updating status");
      }
    );
  };

  return (
    <Card>
      <CardHeader className="h6">
        <BackButton size="sm" className="mr-1" />
        Process Pending Payments
      </CardHeader>
      <CardBody>
        <div className="pb-2">
          <div className="font-weight-bold">
            Patient: {name} ({patient_id})
          </div>
          <div>Transaction Reference: {reference}</div>
        </div>
        <div className="row">
          <SelectInput
            label="Mode of Payment"
            name="modeOfPayment"
            container="col-md-6"
            options={["Cash", "Bank Transfer", "POS"]}
            value={form.modeOfPayment}
            onChange={handleChange}
          />
          <InputGroup
            label="Balance Paid"
            name="amountPaid"
            container="col-md-6"
            value={form.amountPaid}
            onChange={handleChange}
          />
        </div>
        <CustomTable data={list} fields={fields} size="sm" bordered />
        <div className="text-right font-weight-bold">
          Total Balance Left: {formatNumber(form.totalBalance)}
        </div>
        {/* {JSON.stringify(list)} */}
        <div className="text-center">
          <CustomButton loading={submitting} onClick={handleSubmit}>
            Submit
          </CustomButton>
        </div>
      </CardBody>
    </Card>
  );
}

export default PendingPaymentsDetail;
