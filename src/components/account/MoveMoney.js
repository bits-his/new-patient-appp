import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import { Form, FormGroup, Card, CardHeader, CardBody } from "reactstrap";
import {
  generateReceiptNo,
  today,
  _customNotify,
  _warningNotify,
} from "../utils/helpers";
import { transfer, getAccHeads } from "../../redux/actions/transactions";
import { getUsers } from "../../redux/actions/auth";
import { _postApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import CustomButton from "../comp/components/Button";
import { IoMdMove } from "react-icons/io";

class MoveMoney extends PureComponent {
  state = {
    from: "",
    from_name:'',
    to: "",
    to_name:'',
    amount: "",
    comment: "",
    date: today,
    transfersErrorAert: "",
    loading:false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({loading:true})
    const { from,from_name, to, to_name, amount, date, comment } = this.state;
    if (from === "" || to === "" || amount === "") {
      this.setState({ transfersErrorAert: "Please fill all textboxes" });
    } else {
      generateReceiptNo((receiptno, receiptsn) => {
        const data = {
          amount,
          transaction_date: date,
          descr: comment,
          receiptno,
          receiptsn,
          from,
          from_name,
          to,
          to_name
        };
        //   this.props.transfer(data, this.resetForm);
        _postApi(
          `${apiURL()}/account/move-money`,
          data,
          (resp) => {
            // console.log(resp);
            _customNotify("Success");
            this.setState({
              from: "",
              from_name:'',
              to_name:'',
              to: "",
              amount: "",
              comment: "",
              date: today,
            });
            this._from.clear();
            this._to.clear();
            this.setState({loading:false})
          },
          (err) => {
            console.log(err);
            _warningNotify("Failed!");
            this.setState({loading:false})
          }
        );
      });
    }
  };

  componentDidMount() {
    this.props.getAccHeads();
    this.props.getUsers();
  }

  resetForm = () =>
    this.setState({ from: "", to: "", amount: "", comment: "" });

  render() {
    const { handleSubmit } = this;
    const { accHeads } = this.props;
    const { amount, date, transfersErrorAert, comment, loading } = this.state;

    return (
      <Card>
        <CardHeader>
          <h5>Move Money</h5>
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup row>
              <div className="offset-md-6 offset-lg-6 col-md-6 col-lg-6">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  // disabled
                  onChange={({ target: { value } }) =>
                    this.setState({ date: value })
                  }
                  value={date}
                />
              </div>
              {/* {JSON.stringify(this.state)} */}
            </FormGroup>
            <FormGroup row>
              <div className="col-md-6 col-lg-6">
                <label>From</label>
                <Typeahead
                  align="justify"
                  labelKey={(item) => `${item.head} - ${item.description}`}
                  id="description-1"
                  ref={(ref) => (this._from = ref)}
                  options={accHeads.length ? accHeads : [{ head: "" }]}
                  onChange={(val) => {
                    if (val.length) this.setState({ from: val[0]["head"],from_name: val[0]["description"] });
                  }}
                  // onInputChange={head => this.setState({from:head})}
                />
              </div>
              <div className="col-md-6 col-lg-6">
                <label>To</label>
                <Typeahead
                  align="justify"
                  labelKey={(item) => `${item.head} - ${item.description}`}
                  id="description-2"
                  ref={(ref) => (this._to = ref)}
                  options={accHeads.length ? accHeads : [{ head: "" }]}
                  onChange={(val) => {
                    if (val.length) this.setState({ to: val[0]["head"], to_name: val[0]["description"]});
                  }}
                  // onInputChange={head => this.setState({to:head})}
                />
              </div>
            </FormGroup>

            <FormGroup row>
              <div className="col-md-6 col-lg-6">
                <label>Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  onChange={({ target: { value } }) =>
                    this.setState({ amount: value })
                  }
                  value={amount}
                />
              </div>
              <div className="col-md-6 col-lg-6">
                <label>Comment (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  name="comment"
                  onChange={({ target: { value } }) =>
                    this.setState({ comment: value })
                  }
                  value={comment}
                />
              </div>
            </FormGroup>
            <center>
              <span style={{ color: "red" }}>
                {transfersErrorAert.length ? transfersErrorAert : null}
              </span>
            </center>
          </Form>
          <center>
            <CustomButton loading={loading} className="btn btn-primary px-3" onClick={handleSubmit}>
             <IoMdMove /> Move money now
            </CustomButton>

          </center>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = ({
  auth,
  transactions: { accHeads, loadingAccHead },
}) => ({
  accHeads,
  loadingAccHead,
  users: auth.users,
});

const mapDispatchToProps = (dispatch) => ({
  getAccHeads: () => dispatch(getAccHeads()),
  getUsers: () => dispatch(getUsers()),
  transfer: (data, callback) => dispatch(transfer(data, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoveMoney);
