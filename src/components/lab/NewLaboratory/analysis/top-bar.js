import React from "react";
import { Card } from "reactstrap";
import { LabAnalysisDashShortcuts } from "../../../account/Forms/ServiceCardHeader";

function AnalysisTopBar() {
  return (
    <Card outline className="py-1 mb-1 ">
      <LabAnalysisDashShortcuts />
    </Card>
  );
}

export default AnalysisTopBar;
