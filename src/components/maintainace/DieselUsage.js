import React, { Component } from 'react';
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
  Label,
  Input,
} from 'reactstrap';
import { newDieselUsage } from '../../redux/actions/maintenance';

class DieSelUsage extends Component {
  state = {
    date: moment().format('YYYY-MM-DD'),
    gen: '',
    time_started: moment().format('HH:MM'),
    time_stopped: moment().format('HH:MM'),
    diesel: [],
    today: new Date(),
    error: '',
  };

  // componentDidMount() {
  //   console.log(moment().format('DD-MM-YYYY'));
  // }

  onChange = ({ target }) => {
    
    this.setState({
      error:'',
      [target.name]: target.value,
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { date, gen, time_started, time_stopped } = this.state;
    if (
      date === '' ||
      gen==='' ||
      time_started === '' ||
      time_stopped === ''
    ) {
      this.setState({ error: 'Please complete the form' });
    } else {
      const formData = {date, gen, time_started, time_stopped}
      this.props.newDieselUsage(formData)
      // this.setState(prevState => ({
      //   diesel: prevState.diesel.concat({
      //     date: this.state.date,
      //     gen: this.state.gen,
      //     time_started: this.state.time_started,
      //     time_stopped: this.state.time_stopped,
      //   }),
      // }));
    }
  };

  render() {
    const {
      onChange,
      onSubmit,
      state: {error, date, time_started, time_stopped },
    } = this;
    return (
      <Form onSubmit={onSubmit}>
        <Card>
          <CardHeader tag="h6">
            Diesel Usage
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
                      onChange={onChange}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6 col-lg-12">
                  <hr />
                </div>

                <div className="col-md-6 col-lg-12">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="gen"
                        value="Gen1"
                        onChange={onChange}
                      />{' '}
                      Gen1
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="gen"
                        value="Gen2"
                        onChange={onChange}
                      />{' '}
                      Gen2
                    </Label>
                  </FormGroup>
                  <hr />
                </div>

                <div className="col-md-6 col-lg-6">
                  <FormGroup>
                    <label>Time Started</label>
                    <input
                      className="form-control"
                      type="time"
                      name="time_started"
                      value={time_started}
                      onChange={this.onChange}
                    />
                  </FormGroup>
                </div>

                <div className="col-md-6 col-lg-6">
                  <FormGroup>
                    <label>Time Stopped</label>
                    <input
                      className="form-control"
                      type="time"
                      name="time_stopped"
                      value={time_stopped}
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
    newDieselUsage: (data) => dispatch(newDieselUsage(data))
  }
}

export default connect(null, mapDispatchToProps)(DieSelUsage);