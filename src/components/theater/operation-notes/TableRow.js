import React from "react";

const TableRow = ({
  list,
  filterText,
  onReviewButtonClick,
  onPrintButtonClick,
  handleDelete = (f) => f,
  userIsAdmin = false,
}) => {
  const rows = [];

  list.length &&
    list.forEach((item, i) => {
      if (
        item.id
          .toString()
          .toLowerCase()
          .indexOf(filterText.toLowerCase()) === -1 &&
        `${item.name.toLowerCase()}`.indexOf(filterText.toLowerCase()) === -1 &&
        item.diagnosis
          .toString()
          .toLowerCase()
          .indexOf(filterText.toLowerCase()) === -1 &&
        item.surgery
          .toString()
          .toLowerCase()
          .indexOf(filterText.toLowerCase()) === -1
      ) {
        return;
      }

      rows.push(
        <tr key={i}>
          <td>{item.id}</td>
          <td>{item.date}</td>
          <td>{item.name}</td>
          <td>{item.diagnosis}</td>
          <td>{item.surgery}</td>
          <td className="moveToCenter">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onReviewButtonClick(item)}
            >
              Review
            </button>
          </td>
          <td className="moveToCenter">
            <button
              className="btn btn-success btn-sm"
              onClick={() => onPrintButtonClick(item)}
            >
              Print Note
            </button>
          </td>
          {userIsAdmin ? (
            <td className="moveToCenter">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </td>
          ) : null}
        </tr>
      );
    });

  return rows;
};
export default TableRow;
