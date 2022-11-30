import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Col, Row } from "reactstrap";

function FallbackLayout() {
  return (
    <SkeletonTheme color="#fff" highlightColor="#eee">
      <Skeleton duration={1.5} height={50} />
      <Row className='p-0 m-0'>
        <Col>
          <Skeleton duration={1.5} height={"70vh"} />
        </Col>
        <Col md={6}>
          <Skeleton duration={1.5} height={"70vh"} />
        </Col>
        <Col>
          <Skeleton duration={1.5} height={"70vh"} />
        </Col>
      </Row>
    </SkeletonTheme>
  );
}

export default FallbackLayout;
