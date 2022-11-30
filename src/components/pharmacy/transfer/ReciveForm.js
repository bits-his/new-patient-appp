import React, { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { Button, CardBody, Row, Table, Container } from "reactstrap";
import CustomButton from "../../../app/components/Button";
import SearchBar from "../../../app/components/SearchBar";
import { formatNumber } from "../../../app/utilities";
import CustomCard from "../../../components/CustomCard";
import CustomTable from "../../../components/CustomTable";
import {
  getPendingItems,
  updatePendingItems,
} from "../../../redux/actions/sales";

function ReciveForm() {
  const store = useSelector((state) => state.auth.user.store);
  const sales = useSelector((state) => state.sales.pendingItems);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPendingItems(store));
  }, [dispatch, store]);
  const fields = [
    { title: "Item Name", value: "item_name" },
    {
      title: "Qty",
      custom: true,
      component: (item) => (
        <div className="text-center">{formatNumber(item.qty_in)}</div>
      ),
    },
    {
      title: "Price",
      custom: true,
      component: (item) => (
        <div className="text-center">{formatNumber(item.selling_price)}</div>
      ),
    },
    { title: "Transfer From", value: "location_from" },
    {
      title: "Receive",
      custom: true,
      component: (item) => (
        <div className="text-center">
          <CustomButton
            color="success"
            size="sm"
            className="m-1"
            handleSubmit={() => {
              let query_type = "accept";
              dispatch(
                updatePendingItems(item.trn_number, item.id, store, query_type)
              );
            }}
          >
            <FaCheck size="20" />{" "}
          </CustomButton>
          <Button
            color="danger"
            size="sm"
            outline
            onClick={() => {
              let query_type = "reject";
              dispatch(
                updatePendingItems(item.trn_number, item.id, store, query_type)
              );
            }}
          >
            <GiCancel size="20" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <Container>
      <CustomCard header="Receive Form">
        <SearchBar placeholder="Search for Recieved item" />
        <CustomTable fields={fields} data={sales} />
        {/* <Button color="success">Recive All</Button>
        <Button color="danger" className="float-right" outline>
          Reject All
        </Button> */}
      </CustomCard>
    </Container>
  );
}

export default ReciveForm;
