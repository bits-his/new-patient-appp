import React from "react";
import { Card, Col, Row } from "reactstrap";
import LabArchive from "../LabArchive";

function LabRecordsArchive() {
  return (
    <Row>
      <Col md={4}>
        <Card>
          <p>Query:</p>
        </Card>
      </Col>
      <Col>
        <LabArchive />
      </Col>
    </Row>
  );
}

export default LabRecordsArchive;
