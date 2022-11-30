import React from "react";
import { useDispatch } from "react-redux";
import { Button, CardFooter, Col, InputGroup, Row } from "reactstrap";
import { addCart, updateCart } from "../../../redux/actions/shop";
import Scrollbar from "../../comp/components/Scrollbar";
import { formatNumber } from "../../utils/helpers";
import ItemAvatar from "./ItemAvatar";
import "./itemListStyle.css";
function ItemsList({
  list = [],
  selectItem = (f) => f,
  filterText = "",
  form = {},
}) {
  // const drugs = list.filter(
  //   (row) =>
  //     row.drug_name.toLowerCase().includes(filterText.toLowerCase()) ||
  //     row.drug_code&&row.drug_code.includes(filterText.toLowerCase())
  // );

  return (
    <div>
      <Scrollbar style={{ height: "76.5vh" }}>
        <Row className="">
          {/* {JSON.stringify(drugs)} */}
          {list &&
            list.length &&
            list.map((item, i) => (
              <Col key={i} md={3} className="mb-1">
                <Item
                  item={item}
                  selectItem={selectItem}
                  form={form}
                  list={list}
                />
              </Col>
            ))}
        </Row>
      </Scrollbar>
    </div>
  );
}

function Item({ item = {}, selectItem = (f) => f, form = {}, list = [] }) {
  const selected = item === form.selectedItem;
  const dispatch = useDispatch();

  const addToCart = (it) => {
    dispatch(addCart({ ...it, qty: 1 }));
  };

  const deleteCart = (it) => {
    dispatch(updateCart({ item_code: it.item_code, qty: it.qty - 1 }));
  };

  const addCartItem = (it) => {
    dispatch(updateCart({ item_code: it.item_code, qty: it.qty + 1 }));
  };

  // const getList = useCallback(() => {
  //   if (stocks.length < 1) {
  //     dispatch(getStockList(setLoading));
  //   }
  // }, [stocks.length, dispatch]);

  // useEffect(() => {
  //   getList();
  // });
  return (
    <>
      <div
        className="card card-body p-0 m-0 "
        style={{
          cursor: "pointer",
          borderWidth: selected ? 1 : 0,
          borderColor: selected ? "blue" : null,
        }}
        onClick={() => selectItem(item)}
      >
        <div className="p-1 border border-bottom-primary">
          <ItemAvatar item={item} value={item.drug_name} />
        </div>
        <div className="p-1">
          <div className="font-weight-bold text-center">
            <span style={{ fontSize: 10 }}>{item.drug_name}</span>{" "}
            <span style={{ fontSize: 10 }}>{item.drug_category}</span>{" "}
            <span style={{ fontSize: 10 }}>{item.generic_name}</span>{" "}
            <span style={{ fontSize: 10 }}>{item.uom}</span>
          </div>
          <div
            className="font-weight-bold text-center"
            style={{ fontSize: 13 }}
          >
            ₦ {formatNumber(item.selling_price)}
          </div>

          <div className=" text-center" style={{ fontSize: 10 }}>
            {item.balance} {item.uom} available
          </div>
        </div>
       
      </div>
    </>
  );
}

export default ItemsList;
