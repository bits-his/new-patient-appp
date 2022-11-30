import React from 'react';
import { Table } from 'reactstrap';
import Loading from '../../loading';
import moment from 'moment';
import { _fetchApi } from '../../../redux/actions/api';
import { apiURL } from '../../../redux/actions';

class DailyIncome extends React.Component {
  constructor(props) {
    super();

    this.state = {
      dailyIncome: [],
      loading: false,
    };
  }

  fetchData = (from, to) => {
    this.setState({ loading: true });
    _fetchApi(
      `${apiURL()}/transactions/reports/${from}/${to}`,
      ({ results }) => {
        // console.log(results);
        this.setState({ loading: false });
        if (results.length) {
          this.setState({ dailyIncome: results });
        }
      },
      (err) => console.log(err),
    );
  };

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.from, nextProps.to);
  }
  componentDidMount() {
    this.fetchData(this.props.from, this.props.to);
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <center>
            <p>
              <Loading />{' '}
            </p>
          </center>
        ) : (
          <div>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Particular</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {this.state.dailyIncome.length
                  ? this.state.dailyIncome.map((item, index) => (
                      <tr key={index}>
                        <td>{moment(item.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          {item.transaction_source !== 'Expenditure'
                            ? item.modeOfPayment
                            : item.description}
                        </td>
                        {/* <td>
                          {item.modeOfPayment === "POS" ||
                          item.modeOfPayment === "deposit"
                            ? item.credited
                            : null}
                        </td> */}
                        <td>
                          {item.modeOfPayment === 'cash' ? item.credited : null}
                        </td>
                        <td>
                          {item.transaction_source === 'Expenditure'
                            ? item.debited
                            : null}
                        </td>
                        <td>{item.description}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </div>
        )}
        {!this.state.loading ? (
          <div className="text-center">
            <h5>No data found</h5>
          </div>
        ) : null}
      </div>
    );
  }
}

export default DailyIncome;
