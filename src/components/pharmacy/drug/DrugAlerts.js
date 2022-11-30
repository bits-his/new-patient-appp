import React, { useEffect } from "react";
import moment from "moment";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody } from "reactstrap";
import {
  getExpiryAlert,
  getReorderLevel,
} from "../../../redux/actions/pharmacy";
import Scrollbar from "../../comp/components/Scrollbar";

function DrugAlerts() {
  const today = moment().format("YYYY-MM-DD");
  const expiryAlert = useSelector((state) => state.pharmacy.expiryAlert);
  const dispatch = useDispatch();
  const info = useCallback(() => {
    dispatch(getExpiryAlert());
  }, [dispatch]);
  useEffect(() => {
    info();
  }, [info]);
  return (
    <Card className="" style={{ border: "2px solid #ff3300", height: "84vh" }}>
      <Scrollbar autoHide>
        <CardBody>
          {/* {JSON.stringify(expiryAlert)} */}
          <h5 className="text-center mt-0">Expiry Alert</h5>
          {expiryAlert.map((state) => (
            <>
              {state.expiry_date === "1111-11-11" ? (
                ""
              ) : (
                <div className="m-0 p-0">
                  <div>{state.drug_name}</div>
                  (Expires in {moment(state.expiry_date).diff(today, "days")} days)
                </div>
              )}
            </>
          ))}
        </CardBody>
      </Scrollbar>
    </Card>
  );
}

export function ReOderLevel() {
  const reorderLevel = useSelector((state) => state.pharmacy.reorderLevel);

  const dispatch = useDispatch();
  const info = useCallback(() => {
    dispatch(getReorderLevel());
  }, [dispatch]);
  useEffect(() => {
    info();
  }, [info]);
  return (
    <Card
      className="border-primary"
      style={{ border: "2px solid ", height: "84vh" }}
    >
      <Scrollbar autoHide>
        <CardBody>
          <h5 className="text-center m-0">Reoder Level</h5>
          {reorderLevel&&reorderLevel.map((state) => (
            <div className="m-0 p-0">
              <div>{state.drug_name}</div>
              <div>
                <div>({state.balance} remaining)</div>
              </div>
            </div>
          ))}
        </CardBody>
      </Scrollbar>
    </Card>
  );
}

export default DrugAlerts;
