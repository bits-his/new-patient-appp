import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { FaPrint, FaWindowClose } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, FormGroup,Table } from "reactstrap";
import { apiURL } from "../../redux/actions";
import { _fetchApi } from "../../redux/actions/api";
import SearchBar from "../record/SearchBar";
// import {  _customNotify } from "../utils/helpers";
import { DispensaryInventoryPDF } from "./DispensaryInventoryPDF";

export default function InventoryItemTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryItem, setInventoryItem] = useState([]);
  const [prewiew, setPreview] = useState(true);
  const branch = useSelector((state) => state.auth.user.branch_name);

  const handlePrint = () => {
    setPreview((d) => !d);
  };
  const getInventory = () => {
    _fetchApi(`${apiURL()}/account/get/inventory`, (data) => {
      if (data.results) {
        let finalData = data.results.map((i) => ({
          ...i,
          new_price: i.unit_price,
          editMode: false,
        }));
        setInventoryItem(finalData);
      }
      // console.log(data);
    });
  };

  // const handleEditClick = (item) => {
  //   let editting = inventoryItem.map((i) =>
  //     i.item_name === item.item_name &&
  //     i.unit_price === item.unit_price &&
  //     i.expiring_date === item.expiring_date
  //       ? { ...i, editMode: !i.editMode }
  //       : i
  //   );

  //   setInventoryItem(editting);
  // };

  // const handlePriceChange = (item, val) => {
  //   let editted = inventoryItem.map((i) =>
  //     i.item_name === item.item_name &&
  //     i.unit_price === item.unit_price &&
  //     i.expiring_date === item.expiring_date
  //       ? { ...i, new_price: val }
  //       : i
  //   );
  //   setInventoryItem(editted);
  // };

  // const updateRow = (item) => {
  //   _postApi(
  //     `${apiURL()}/procurement/update-intentory-price`,
  //     item,
  //     (resp) => {
  //       console.log(resp);
  //       _customNotify("Price Updated");
  //       getInventory();
  //     },
  //     (err) => console.log(err)
  //   );

  //   handleEditClick(item);
  // };

  useEffect(() => {
    getInventory();
  }, []);

  const rows = [];

  inventoryItem &&
    inventoryItem.forEach((purchase, i) => {
      if (
        purchase.item_name
          .toString()
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase()) === -1
      ) {
        return;
      }
      rows.push(
        <tr key={i} className="bg-info">
          <>
            {/* <td className="text-center">
              <Button
                size="sm"
                color="success"
                onClick={() => handleEditClick(purchase)}
              >
                Edit
              </Button>
            </td> */}
            <td className="text-center">{purchase.po_no}</td>
          </>
          <td className="">{purchase.item_name || ""}</td>
          {/* <td className="text-right">
            {purchase.editMode ? (
              <Input
                size="sm"
                value={purchase.new_price}
                onChange={({ target: { value } }) =>
                  handlePriceChange(purchase, value)
                }
                onBlur={() => updateRow(purchase)}
              />
            ) : (
              formatNumber(purchase.new_price)
            )}
          </td> */}
          <td className="text-center">{purchase.balance || ""}</td>
          {/* {!moreItems && (
          <td className="text-center">{purchase.expiring_date || ""}</td>
          )} */}
          <td className="text-center">{purchase.store_type}</td>
        </tr>
      );
    });
  return (
    <>
      <Card>
        <CardBody>
          {/* {JSON.stringify(branch)} */}
          <div className="d-flex justify-content-center">
            {prewiew ? (
              <>
                <h5>ITEM LIST</h5>
                <Button
                  onClick={handlePrint}
                  className="px-4 ml-auto"
                  color="warning">
                  <FaPrint size="16" className="mr-1" /> Print
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Button
                    color="danger"
                    className="p-3 float-right mb-3"
                    onClick={handlePrint}
                  >
                    <FaWindowClose size="20" /> Close
                  </Button>
                </div>
                <center>
                  <PDFViewer height="900" width="600">
                    <DispensaryInventoryPDF
                      list={inventoryItem}
                      branch={branch}
                      type="Main Store"
                    />
                  </PDFViewer>
                </center>
              </>
            )}
          </div>
          <FormGroup className="m-3">
            <SearchBar
              filterText={searchTerm}
              onFilterTextChange={(value) => setSearchTerm(value)}
              placeholder="Search item name"
            />
          </FormGroup>
          {prewiew ? (
            <Scrollbars style={{ height: 400 }}>
              <Table bordered striped size="sm">
                <thead>
                  <tr>
                    {/* <th className="text-center">Action</th> */}
                    <th className="text-center">Po.No </th>
                    <th className="text-center">Item Name</th>
                    {/* <th className="text-center">Selling Price</th> */}
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Item Category</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </Scrollbars>
          ) : null}
        </CardBody>
      </Card>
    </>
  );
}
