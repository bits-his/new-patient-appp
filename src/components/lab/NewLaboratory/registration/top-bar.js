import moment from "moment";
import React from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaCalendar, FaUser } from "react-icons/fa";
import { useHistory } from "react-router";
import { Card } from "reactstrap";
import {
  LabReceptionDashShortcuts,
  // LabRegShortcuts,
} from "../../../account/Forms/ServiceCardHeader";
import CustomButton from "../../../comp/components/Button";

function RegistrationTopBar({ count }) {
  const history = useHistory();
  return (
    <div className="d-flex flex-row  align-items-stretch mb-1">
      <div>
        <CustomButton
          color="primary"
          className="mb-1"
          //   outline
          onClick={() => {
            history.push("/me/lab/patients/new");
          }}
        >
          <AiOutlineFileDone size={24} className="mr-2" />
          New Registration
        </CustomButton>
        {/* <CustomButton
          color="warning"
          className="mb-1 ml-1"
          //   outline
          onClick={() => {
            history.push("/me/lab/patients/pending-payments");
          }}
        >
          <AiOutlineFileDone size={24} className="mr-2" />
          Part Payment Transactions
        </CustomButton>
        <CustomButton
          color="info"
          className="mb-1 ml-1"
          //   outline
          disabled
          onClick={() => {
            history.push("/me/lab/patients/raise-a-refund");
          }}
        >
          <AiOutlineFileDone size={24} className="mr-2" />
          Refunds
        </CustomButton> */}
        
      </div>

      <div className="d-flex flex-row  align-items-stretch justify-content-between">
        <Card
          outline
          color="success"
          className="px-1 ml-2 flex-row justify-content-center align-items-center"
        >
          <LabReceptionDashShortcuts />
        </Card>

        <div className="d-flex flex-direction-row justify-content-end">
          <Card
            outline
            color="success"
            // style={{background: 'warning'}}
            className="bg-warning px-3 ml-2 d-flex flex-row justify-content-center align-items-center"
          >
            <FaUser className="mr-1" />
            <span className="font-weight-bold">Patients Count: {count}</span>
          </Card>
           <Card
            outline
            color="success"
            className="bg-warning px-3 ml-2 d-flex flex-row justify-content-center align-items-center"
          >
            <FaCalendar className="mr-1" />
            <span className="font-weight-bold">
              {moment().format("DD-MM-YYYY")}
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RegistrationTopBar;
