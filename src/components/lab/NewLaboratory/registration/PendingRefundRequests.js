import React, { useState } from "react";
import { Alert, Card, CardBody, CardHeader } from "reactstrap";
import CustomButton from "../../../comp/components/Button";
import CustomTable from "../../../comp/components/CustomTable";
import BackButton from "../../../comp/components/BackButton";

const fields = [{ title: "Date" }, { title: "Patient" }, { title: "Status" }];

function PendingRefundRequests({ history }) {
  const [list, setList] = useState([]);

  const raiseRefund = () => {
    history.push("raise-a-refund");
  };

  return (
    <>
    <BackButton />
    <Card>
      <CardHeader className="d-flex flex-direction-row justify-content-between align-items-center py-1">
        <span className="h6">Pending Refund</span>{" "}
        <CustomButton size="sm" className="my-1" onClick={raiseRefund}>
          Raise New Refund Request
        </CustomButton>
      </CardHeader>
      <CardBody className="py-2 px-0">
        {!list.length ? (
          <Alert className="text-center mx-2">Nothing to display.</Alert>
        ) : null}
        {list.length ? (
          <CustomTable size="sm" className="mx-0" fields={fields} data={list} />
        ) : null}
      </CardBody>
    </Card>
    </>
  );
}

export default PendingRefundRequests;
