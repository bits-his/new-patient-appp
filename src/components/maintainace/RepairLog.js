import React, { Component } from 'react';
// import { FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
} from 'reactstrap';
import { newErrorRepairLog } from '../../redux/actions/maintenance';

class RepairLog extends Component {
  state = {
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:MM'),
    repaired_by: '',
    nature: '',
    repairlog: [],
    error: '',
  };

  onChange = ({ target }) => {
    this.setState({
      error: '',
      [target.name]: target.value,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { date, time, repaired_by, nature } = this.state;
    if (date === '' || time === '' || repaired_by === '' || nature === '') {
      this.setState({ error: 'please complete the form' });
    } else {
      const formData = {date,time,repaired_by,nature}
      this.props.newErrorRepairLog(formData)
      // this.setState(
      //   prevState => ({
      //     error_repairlog: prevState.error_repairlog.concat({
      //       date: this.state.date,
      //       time: this.state.time,
      //       repaired_by: this.state.repaired_by,
      //       nature: this.state.nature,
      //     }),
      //   }),
      //   () => this.resetForm()
      // );
    }
  };
  resetForm = () => {
    this.setState({
      repaired_by: '',
      nature: '',
    });
  };

  render() {
    const {
      onChange,
      handleSubmit,
      state: { error, date, time, repaired_by, nature },
    } = this;
    return (
      <Form onSubmit={handleSubmit}>
        <Card>
          <CardHeader tag='h6'>
            Error/Repair Log
          </CardHeader>

          <CardBody>
            <div>
              <FormGroup row>
                <div className="col-md-6 col-lg-6">
                  <FormGroup>
                    <label>Date</label>
                    <input
                      className="form-control"
                      type="date"
                      name="date"
                      value={date}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6 col-lg-6">
                  <FormGroup>
                    <label>Time</label>
                    <input
                      className="form-control"
                      type="time"
                      name="time"
                      value={time}
                      onChange={onChange}
                    />
                  </FormGroup>
                </div>

                <div className="col-md-6 col-lg-6">
                  <FormGroup>
                    <label>Repaired By</label>
                    <input
                      className="form-control"
                      type="text"
                      name="repaired_by"
                      value={repaired_by}
                      onChange={onChange}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6 col-lg-6">
                  <FormGroup>
                    <label>Nature</label>
                    <input
                      className="form-control"
                      type="textarea"
                      name="nature"
                      value={nature}
                      onChange={onChange}
                    />
                  </FormGroup>
                </div>
              </FormGroup>
            </div>
          </CardBody>
          {error !== '' ? (
            <center>
              <p style={{ color: 'red' }}>{error}</p>
            </center>
          ) : null}
          <CardFooter>
            <center>
              <Button color="primary" outline size="sm">
                Submit
              </Button>
            </center>
          </CardFooter>
        </Card>
      </Form>
    );
  }
}
function mapDispatchToProps(dispatch){
  return {
    newErrorRepairLog: (data) => dispatch(newErrorRepairLog(data))
  }
}

export default connect(null, mapDispatchToProps)(RepairLog);
