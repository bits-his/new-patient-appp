import React from "react";
import { Card, CardHeader, CardBody } from "reactstrap";
import { ResultViewer } from "../../CompletedLabTests";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

function ReportMainView() {
  const history = useHistory();
  const facility = useSelector((state) => state.facility.info);
  const isHospital = facility.type === "hospital";

  const printOut = useSelector((state) => state.lab.labPrintOut);

  const _closePrint = () => {
    history.push("/me/lab/patients");
  };

  return (
    <Card>
      <CardHeader>Print Report</CardHeader>
      <CardBody>
        <ResultViewer
          close={() => _closePrint(printOut)}
          printOut={printOut}
          isHospital={isHospital}
        />
      </CardBody>
    </Card>
  );
}

export default ReportMainView;
