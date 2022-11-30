import React, { useState } from "react";
import SearchBar from "../record/SearchBar";
import { Button, CardTitle, Table } from "reactstrap";
import { FaEdit } from "react-icons/fa";
import Loading from "../comp/components/Loading";
import Scrollbars from "react-custom-scrollbars";
import { MdDelete } from "react-icons/md";

const iconButtonStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
};

export default function SurgeonsListTable({
  surgeonsList,
  loading,
  handleDelete,
  handleEdit,
}) {
  const [filterText, setFilterText] = useState("");

  const rows = [];
  surgeonsList &&
    surgeonsList.forEach((item, index) => {
      if (item.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1)
        return;

      rows.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.name}</td>
          <td>{item.type}</td>
          <td className="d-flex">
            <Button
              color="primary"
              size={"sm"}
              style={iconButtonStyle}
              onClick={() => handleEdit(item.name, item.type,item.id, "edit")}
              className="mr-2"
            >
              <FaEdit style={{ margin: "0 3px" }} />
              Edit
            </Button>
            <Button
              color="danger"
              size={"sm"}
              style={iconButtonStyle}
              onClick={() => handleDelete(item.id)}
            >
              <MdDelete size="16" style={{ margin: "0 3px" }} />
            </Button>
          </td>
        </tr>
      );
      // }
    });
  return (
    <>
      <SearchBar
        placeholder="Search Surgeons"
        onFilterTextChange={(filterText) => setFilterText(filterText)}
        filterText={filterText}
      />

      <React.Fragment>
        <CardTitle tag="h5" className="text-center">
          Surgeon/Anesthetists/Scrub Nurse List
        </CardTitle>
        {/* {JSON.stringify(surgeonsList)} */}
        {loading && <Loading />}
        <Scrollbars style={{ height: 350 }}>
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Scrollbars>
      </React.Fragment>
    </>
  );
}
