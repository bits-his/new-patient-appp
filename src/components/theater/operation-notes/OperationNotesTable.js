import React, { useState } from "react";
import { Table } from "reactstrap";
import { Spinner } from "evergreen-ui/commonjs/spinner";
import SearchBar from "../../record/SearchBar";
import { Scrollbars } from "react-custom-scrollbars";
import TableRow from "./TableRow";
import { useSelector } from "react-redux";

export default function OpNotesTable({
  list,
  loading,
  onReviewButtonClick,
  onPrintButtonClick,
  handleDelete = (f) => f,
}) {
  const user = useSelector((state) => state.auth.user);
  const userIsAdmin = user.userType === "admin";
  const [filterText, changeFilterText] = useState("");
  return (
    <div style={{ height: 700 }}>
      <div style={{ margin: 10 }}>
        <SearchBar
          filterText={filterText}
          onFilterTextChange={(val) => changeFilterText(val)}
        />
      </div>
      <Scrollbars style={{ height: 600 }} autohide>
        {loading ? (
          <center style={{ marginTop: 200 }}>
            <Spinner />
          </center>
        ) : (
          <Table bordered striped hover>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Date</th>
                <th>Full Name</th>
                <th>Diagnosis</th>
                <th>Procedure</th>
                <th className="moveToCenter">Review</th>
                <th>Print</th>
                {userIsAdmin ? <th>Delete</th> : null}
              </tr>
            </thead>
            <tbody>
              <TableRow
                list={list}
                filterText={filterText}
                onReviewButtonClick={onReviewButtonClick}
                onPrintButtonClick={onPrintButtonClick}
                handleDelete={handleDelete}
                userIsAdmin={userIsAdmin}
              />
            </tbody>
          </Table>
        )}
      </Scrollbars>
    </div>
  );
}
