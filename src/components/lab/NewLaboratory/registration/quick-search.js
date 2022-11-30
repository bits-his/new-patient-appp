import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import CustomTable from "../../../comp/components/CustomTable";
import { useSelector } from "react-redux";
import { apiURL } from "../../../../redux/actions";
import { formatNumber } from "../../../utils/helpers";

const fields = [
  { title: "Test", value: "description" },
  {
    title: "Price",
    custom: true,
    component: (item) => `₦${formatNumber(item.price)}`,
  },
];

function QuickSearch({ quickSearchOpen = false, toggle = (f) => f }) {
  const [searchTerm, setSearchTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  const facilityId = useSelector((state) => state.auth.user.facilityId);

  const search = (query) => {
    setIsLoading(true);
    setSearchTerm(query);

    // fetch(`${apiURL()}/lab/search/${facilityId}?lab=${query}`)
    fetch(`${apiURL()}/lab/search/${facilityId}?lab=${query}`)
      .then((resp) => resp.json())
      .then(({ labInfo }) => {
        // if (labInfo.length === 1) {
        //   props.handleResult(searchTerm, labInfo[0]);
        //   props._ref.current.setState({ text: labInfo[0].drug });
        // } else {
        setList(labInfo || []);
        // }

        setIsLoading(false);
      });
  };

  useEffect(() => {
    search(searchTerm);
  }, [searchTerm]);

  return (
    <Modal isOpen={quickSearchOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Quick Search</ModalHeader>
      <ModalBody>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <CustomTable data={list} fields={fields} /> */}
      </ModalBody>
    </Modal>
  );
}

export default QuickSearch;
