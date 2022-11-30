import React from "react";
// import SearchBar from '../../SearchBar';
import { CardBody, CardHeader, Card, Table, Col, Row } from "reactstrap";
import Scrollbars from "react-custom-scrollbars";
import SearchBar from "../record/SearchBar";
import moment from "moment";
import { apiURL } from "../../redux/actions";
import { _fetchApi } from "../../redux/actions/api";
// import { _fetchApi, apiURL } from '../../redux/actions/api';
// import { formatNumber } from '../utilities';

class LabInventory extends React.Component {
  state = {
    getList: [],
    filterText: "",
    totalamount: [],
  };
  componentDidMount() {
    this.getInventoryList();
  }
  getInventoryList = () => {
    _fetchApi(
      `${apiURL()}/diagnosis/inventory/list`,
      (res) => {
        if (res.results && res.results.length) {
          this.setState({ getList: res.results });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };
  handleFilterTextChange = (filterText) => this.setState({ filterText });

  render() {
    // const rows = [];
    // this.state.getItemList.length &&
    //   this.state.getItemList.forEach((item, i) => {
    //     if (
    //       item.item_type
    //         .toLowerCase()
    //         .indexOf(this.state.filterText.toLowerCase()) === -1 &&
    //       item.quantity
    //         .toLowerCase()
    //         .indexOf(this.state.filterText.toLowerCase()) === -1 &&
    //       item.quantityInPack
    //         .toLowerCase()
    //         .indexOf(this.state.filterText.toLowerCase()) === -1
    //     ) {
    //       return;
    //     }

    //     rows.push(
    //       <tr
    //         key={i}
    //         className={parseInt(item.quantity) === 0 ? 'bg-danger' : ''}
    //       >
    //         <td>{item.date}</td>
    //         <td>{item.item_type}</td>
    //         <td className="text-center">{item.quantityInPack}</td>
    //         <td className="text-right">
    //           {item.amountbought || 0}
    //         </td>
    //         <td className="text-center">{item.quantity}</td>
    //         <td className="text-right">{item.balance || 0}</td>
    //       </tr>,
    //     );
    //   });

    return (
      <div>
        {/* {this.state.filterText} */}
        <Card>
          <CardHeader>
            <h5 align="center">Items Inventory</h5>
          </CardHeader>

          <CardBody>
            {/* {JSON.stringify(this.state.getItemList)} */}
            <Row>
              <Col md={6}>
                <SearchBar
                  filterText={this.state.filterText}
                  onFilterTextChange={(filterText) =>
                    this.setState({ filterText: filterText })
                  }
                  placeholder="Search"
                />
              </Col>
              {/* <Col md={6}>

             <div>
            <select
              className="form-control"
            >
              <option value="choose">....Choose Lab....</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Hematology">Hematology</option>
              <option value="Radiology">Radiology</option>
              <option value="Pathology">Pathology</option>
            </select>
          </div>
            </Col> */}
            </Row>

            <Scrollbars style={{ height: 400 }}>
              <Table bordered striped>
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">
                      Items
                    </th>
                    <th colSpan={2} className="text-center">
                      Bought
                    </th>
                    <th colSpan={2} className="text-center">
                      Store Balance
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center">Date</th>
                    <th className="text-center">Items List</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Amount</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {rows} */}
                  {this.state.getList.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {moment().format("DD/MM/YYYY")}
                      </td>
                      <td className="text-center">{item.item_name}</td>
                      <td className="text-center">{item.supplier}</td>
                      <td className="text-center">{item.price}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{item.invoice_no}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Scrollbars>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default LabInventory;
