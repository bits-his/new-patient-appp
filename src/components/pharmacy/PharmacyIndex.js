import React from 'react'
import { Col, Row } from "reactstrap";
import useQuery from "../../hooks/useQuery";
import DrugAlerts, { ReOderLevel } from "./drug/DrugAlerts";
import DrugSale from "./drug/DrugSales";
import PharmacyMenu from "./PharmacyMenu";
import PostSalePage from "./drug/PostSalePage";
import ReturnItem from "./return-drug/ReturnItem";
import ManageStore from "./ManageStore";
import PharmacyRoute from "./PharmacyRoute";
import DrugCount from './DrugCount';
import DrugSalesPage from './drug/DrugSalesPage';

export default function PharmacyIndex() {
  const query = useQuery();
  const type = query.get("type");
  return (
    <div className="mt-0">
    <center>
      <PharmacyMenu />
    </center>
  {/* {type === "with-alert" ? (
    <Row className="m-0">
      <Col md={2} className="px-1">
        <ReOderLevel />
      </Col>
      <Col md={8} className="px-1">
        <DrugCount />
      </Col>
      <Col className="px-1" md={2}>
        {/* <DispatchedDrugRequests /> 
        <DrugAlerts />
      </Col>
    </Row>
  ) : type === "sales" ? (
    <DrugSalesPage />
  ) : type === "salesPage" ? (
    <PostSalePage />
  ) : type === "return" ? (
    <ReturnItem />
  ) : ( */}
    {/* <Row className="m-0"> */}
      {/* <Col md={1} className="px-1"></Col> */}
      {/* <Col md={10} className="px-1"> */}
        <PharmacyRoute />
      {/* </Col> */}
      {/* <Col md={1} className="px-1"></Col> */}
    {/* </Row> */}
  {/* )} */}
</div>
  );
}
