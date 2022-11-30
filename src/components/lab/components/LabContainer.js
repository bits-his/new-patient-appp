import React from "react";
import { FaTimes } from "react-icons/fa";
import { useHistory } from "react-router";
import { Card, CardBody, CardHeader } from "reactstrap";
import CustomButton from "../../comp/components/Button";

function LabContainer(props) {
  const history = useHistory();
  return (
    <Card>
      <CardHeader className="d-flex flex-row justify-content-between align-items-center">
        <h5>{props.title}</h5>
        <CustomButton color="danger" size="sm" onClick={() => history.goBack()}>
          <FaTimes color="#fff" size="16" className="mr-1" />
          Close
        </CustomButton>
      </CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  );
}

export default LabContainer;
