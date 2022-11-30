import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form, FormGroup, Card, CardHeader, CardBody } from 'reactstrap';
import { today } from '../utils/helpers';
import { transfer, getAccHeads } from '../../redux/actions/transactions';
import { getUsers } from '../../redux/actions/auth';

class Transfers extends PureComponent {
  state = {
    from: '',
    to: '',
    amount: '',
    comment: '',
    date: today,
    transfersErrorAert: '',
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { from, to, amount, date, comment } = this.state;
    if (from === '' || to === '' || amount === '') {
      this.setState({ transfersErrorAert: 'Please fill all textboxes' });
    } else {
      const data = { from, to, amount, date, comment };
      this.props.transfer(data, this.resetForm);
    }
  };

  componentDidMount() {
    this.props.getAccHeads();
    this.props.getUsers();
  }

  resetForm = () =>
    this.setState({ from: '', to: '', amount: '', comment: '' });

  render() {
    const { handleSubmit } = this;
    const { users } = this.props;
    const { amount, date, transfersErrorAert, comment } = this.state;

    return (
      <Card>
        <CardHeader>
          <h5>Transfer Money</h5>
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup row>
              <div className="offset-md-9 offset-lg-9 col-md-3 col-lg-3">
                <label>Date</label>
                <input
                  type="text"
                  className="form-control"
                  name="date"
                  disabled
                  onChange={({ target: { value } }) =>
                    this.setState({ date: value })
                  }
                  value={date}
                />
              </div>
            </FormGroup>
            <FormGroup row>
              <div className="col-md-6 col-lg-6">
                <label>From</label>
                <Typeahead
                  align="justify"
                  labelKey="username"
                  id="username"
                  options={users.length ? users : [{ username: '' }]}
                  onChange={(val) => {
                    if (val.length) this.setState({ from: val[0]['username'] });
                  }}
                  // onInputChange={head => this.setState({from:head})}
                />
              </div>
              <div className="col-md-6 col-lg-6">
                <label>To</label>
                <Typeahead
                  align="justify"
                  labelKey="username"
                  id="username"
                  options={users.length ? users : [{ username: '' }]}
                  onChange={(val) => {
                    if (val.length) this.setState({ to: val[0]['username'] });
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
              <span style={{ color: 'red' }}>
                {transfersErrorAert.length ? transfersErrorAert : null}
              </span>
            </center>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Transfer now
            </button>
          </Form>
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
)(Transfers);
