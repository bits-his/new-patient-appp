import Textarea from "evergreen-ui/commonjs/textarea/src/Textarea";
import React, { useState, useEffect } from "react";
import Button from "reactstrap/lib/Button";
import Label from "reactstrap/lib/Label";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import { apiURL } from "../../redux/actions";
import { _fetchApi, _postApi } from "../../redux/actions/api";
import { _customNotify, _warningNotify } from "../utils/helpers";
const Modelling = ({ modal, toggle, setInfo, info, getPurchaseRecord }) => {
  const [generalRemarks, setGeneralRemarks] = useState("");
  const [, setRemarksID] = useState("");

  const getNextRemarksID = () => {
    _fetchApi(
      `${apiURL()}/account/get/next-id/remarks`,
      (data) => {
        console.log(data);
        setRemarksID(data.results[0].remarks_id);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  useEffect(() => {
    getNextRemarksID();
  }, []);

  const handleSubmit = () => {
    const data = {
      status: info.status,
      po_no: info.po_no,
      generalRemarks: generalRemarks,
    };
    const callBack = () => {
      _customNotify(`Successfully Sended ${info.title}`);
      getPurchaseRecord();
      setInfo((prev) => ({
        ...prev,
        modal: !info.modal,
      }));
    };
    const error = () => {
      _warningNotify(" Error Occured ");
    };
    _postApi(`${apiURL()}/purchase/send/to`, data, callBack, error);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} modalTransition={{ timeout: 700 }}>
      <ModalHeader toggle={toggle}>Send it back to {info.title} </ModalHeader>
      <ModalBody>
        <Label>Reason </Label>
        <Textarea
          type="text"
          name="quantity"
          value={generalRemarks}
          onChange={(e) => setGeneralRemarks(e.target.value)}
          placeholder={info.placeholder}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Button>
        <Button
          color="danger"
          onClick={() =>
            setInfo((prev) => ({
              ...prev,
              modal: !info.modal,
            }))
          }
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
export default Modelling;
