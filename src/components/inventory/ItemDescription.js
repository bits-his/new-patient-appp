import React, { Component } from "react";
import { connect } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import { Form, FormGroup, Card, CardHeader, CardBody } from "reactstrap";
import {
  getItemHeads,
  createItemDes,
  getItemChart,
} from "../../redux/actions/transactions";
import Tree from "../comp/components/sortable-tree";
import { apiURL } from "../../redux/actions";
import { _fetchApi } from "../../redux/actions/api";

class ItemDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      head: "",
      subHead: "",
      description: "",
      accountCharFormAlert: "",
      deletable: false,
      item_code: "",
      prefix: "",
      group_code: "",
    };

    this.headRef = React.createRef();
  }

  getNextCode = (subhead) => {
    _fetchApi(
      `${apiURL()}/account/item/next-code/${subhead}`,
      (data) => {
        this.setState({ description: data.results });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  setHead = (head) => this.setState({ head });
  setSubHead = (subHead) => this.setState({ subHead });
  setDescription = (description) => this.setState({ description });
  setAlert = (accountCharFormAlert) => this.setState({ accountCharFormAlert });
  setItemCode = (item_code) => this.setState({ item_code });
  setPrefix = (prefix) => this.setState({ prefix });
  setGroupCode = (group_code) => this.setState({ group_code });

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      props: { createItemDes },
      state: { head, subHead, description, item_code, prefix, group_code },
      setAlert,
    } = this;
    if (head === "") {
      setAlert("Please provide Account Head");
    } else {
      const data = {
        head,
        subHead,
        description,
        item_code,
        prefix,
        group_code,
      };
      createItemDes(data, this.resetForm);
    }
  };

  handleDelete = () => {};

  componentDidMount() {
    this.props.getItemHeads();
    this.props.getItemChart();
  }

  resetForm = () =>
    this.setState({
      head: "",
      description: "",
      item_code: "",
      prefix: "",
      group_code: "",
    });

  handleChartClick = (node) => {
    console.log(node.prefix);
    this.setState({ subHead: node.title, group_code: node.prefix });
    this.setState({ group_code: node.prefix });
    this.headRef.current.setState({
      text: `${node.description} (${node.title})`,
      deletable: !node.children.length,
    });
    // console.log(node.children.length);
    this.getNextCode(node.title);
  };

  render() {
    const {
      setHead,
      setSubHead,
      setDescription,
      handleChartClick,
      handleSubmit,
      handleDelete,
      setItemCode,
      setPrefix,
      // setGroupCode,
    } = this;
    const { accHeads } = this.props;
    const {
      head,
      description,
      accountCharFormAlert,
      deletable,
      item_code,
      group_code,
    } = this.state;

    return (
      <Card>
        <CardHeader>
          <h5>Item Setup</h5>
        </CardHeader>
        <CardBody>
          <div className="row">
            <Form className="col-md-4 col-lg-4">
              <FormGroup>
                <label>Select Item Head</label>
                <Typeahead
                  id="head"
                  align="justify"
                  labelKey={(item) => `${item.description} (${item.head})`}
                  options={accHeads}
                  onChange={(val) => {
                    if (val.length) {
                      let selected = val[0];
                      setSubHead(selected["head"]);
                      this.getNextCode(selected.head);
                      console.log(selected);
                    }
                  }}
                  // onInputChange={head => setSubHead(head)}
                  // allowNew
                  ref={this.headRef}
                />
              </FormGroup>
              <FormGroup>
                <label>Item Subhead Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  onChange={({ target: { value } }) => setDescription(value)}
                  value={description}
                />
              </FormGroup>
              <FormGroup>
                <label>Item Subhead Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="head"
                  onChange={({ target: { value } }) => {
                    setHead(value);
                    setPrefix(value.substring(0, 3));
                    setItemCode(
                      `${group_code}/${value.substring(0, 3)}/${description}`
                    );
                  }}
                  value={head}
                />
              </FormGroup>
              {/* <FormGroup>
                <label>Item Prefix</label>
                <input
                  type="text"
                  className="form-control"
                  name="prefix"
                  onChange={({ target: { value } }) => setPrefix(value)}
                  value={prefix}
                />
              </FormGroup> */}
              <FormGroup>
                <label>Item Code </label>
                <input
                  type="text"
                  className="form-control"
                  name="item_code"
                  disabled
                  onChange={({ target: { value } }) => {
                    setItemCode(value);
                  }}
                  value={item_code}
                />
              </FormGroup>
              {/* <FormGroup>
                <label>Group Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="group_code"
                  onChange={({ target: { value } }) => setGroupCode(value)}
                  value={group_code}
                />
              </FormGroup> */}
              <center>
                <span style={{ color: "red" }}>
                  {accountCharFormAlert.length ? accountCharFormAlert : null}
                </span>
              </center>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Create
              </button>
              {deletable && (
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              )}
              {/* {JSON.stringify(this.props.accChartTree)} */}
            </Form>
            <div className="col-md-8 col-lg-8">
              {/* {} */}
              {/* <ChartTree tree={this.props.accChartTree} /> */}
              <Tree
                treeInfo={this.props.itemChartTree}
                // getNodeKey={({ node }) => node.id}
                generateNodeProps={({ node, path }) => ({
                  // title: `${node.title} - ${node.description}`,
                  title: `${node.description}`,
                  buttons: [
                    <button
                      className="btn btn-outline"
                      onClick={() => handleChartClick(node)}
                    >
                      Edit
                    </button>,
                    //   !node.children.length &&<button
                    //   className="btn btn-outline"
                    //   onClick={() => handleChartClick(node)}
                    // >
                    //   Edit
                    // </button>,
                  ],
                  // style: { backgroundColor:'red'}
                })}
                treeLoading={false}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = ({
  transactions: { accHeads, loadingAccHead },
  account: { accountChart, itemChartTree },
}) => ({
  accHeads,
  loadingAccHead,
  accountChart,
  itemChartTree,
});

const mapDispatchToProps = (dispatch) => ({
  getItemHeads: () => dispatch(getItemHeads()),
  createItemDes: (data, callback) => dispatch(createItemDes(data, callback)),
  getItemChart: () => dispatch(getItemChart()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemDescription);
