import React, { useEffect } from 'react';
// import TextInput from '../../comp/components/InputGroup';
import { FormGroup, Row, Col, Card } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import moment from 'moment';
// import SearchDrug from '../../pharmacy/components/SearchDrug';
import SearchDispensaryDrug from '../../pharmacy/components/SearchDispensaryDrug';
import { primaryColor } from '../../utils/constants';
import { useParams } from 'react-router';

const AccountForm = ({
  price,
  serviceDetails,
  names,
  paymentMedium,
  handleNamesChange,
  servicesForm,
  handleQttyChange,
  accountNo,
  drugs,
  handleChange,
  handleDrugTypeAhead,
  handleServiceDetailsInputChange,
  handlePaymentMediumChange,
  _services_typeahead,
  _names_typeahead,
  drug_code,
  handleDrugCodeChange,
  drugInfo = {},
  quantityRef = null,
  drugCodeRef = null,
  paymentStatus,
  getBalance=f=>f
}) => {
  const {acctNo} = useParams()

  useEffect(() => {
    getBalance(acctNo)
  }, [acctNo])

return (
    <div>
      {/* {JSON.stringify(acctNo)} */}
      <div className="d-flex flex-row justify-content-end">
        {moment(serviceDetails.date).format('Do MMM, YYYY')}
      </div>
      <FormGroup row>
        <div className="col-md-4 col-lg-4">
          <div>
            <input
              type="radio"
              name="paymentMedium"
              className="col-md-1"
              id="insta"
              value="insta"
              checked={paymentMedium === 'insta'}
              onChange={(e) => handlePaymentMediumChange('insta')}
            />
            <label htmlFor="insta">Walk-In Patient</label>
          </div>
          <div>
            <input
              type="radio"
              name="paymentMedium"
              className="col-md-1"
              value="deposit"
              id="deposit"
              checked={paymentMedium === 'deposit'}
              onChange={() => handlePaymentMediumChange('deposit')}
            />
            <label htmlFor="deposit">Registered Patient</label>
          </div>
        </div>

        {/* <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <label>Account Head </label>
          <input
            type="text"
            className="form-control"
            disabled
            name="accHead"
            value={serviceDetails.accHead ? serviceDetails.accHead : ''}
          />
        </div> */}
        {/* {JSON.stringify(serviceDetails)} */}

        <div className="col-xs-12 col-sm-12 offset-md-4 offset-lg-4 col-md-4 col-lg-4">
          <label className="">Mode Of Payment</label>
          <select
            className="form-control"
            name="mode"
            value={serviceDetails.mode ? serviceDetails.mode : ''}
            onChange={handleServiceDetailsInputChange}
          >
            {paymentMedium === 'deposit' && (
              <option value="Deposit">Deposit</option>
            )}
            <option value="cash">Cash</option>
            <option value="POS">POS</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        {/* <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <label className="">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            disabled
            // onChange={({ target }) =>
            //   this.setState((prev) => ({
            //     serviceDetails: {
            //       ...prev.serviceDetails,
            //       date: target.value,
            //     },
            //   }))
            // }
            value={serviceDetails.date ? serviceDetails.date : ''}
          />
        </div> */}
      </FormGroup>
      {paymentMedium === 'deposit' ? (
        <FormGroup row>
          <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
            <label className="">Select Patient Account</label>
            <Typeahead
              align="justify"
              labelKey="names"
              id="names"
              ref={_services_typeahead}
              options={names.length ? names : ['']}
              onChange={(val) => {
                if (val.length) {
                  handleNamesChange(val[0]);
                }
              }}
            />
          </div>

          <div className=" col-md-4 col-lg-4">
            <label style={{ fontWeight: 'bold' }}>Account No: </label>
            <span> {accountNo}</span>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <div>
              <label>Balance</label>
              <input
                className="form-control"
                disabled
                value={serviceDetails.balance}
              />
            </div>
          </div>
        </FormGroup>
      ) : null}
      {/* {JSON.stringify(drugInfo)} */}
      <FormGroup row>
        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
          <label>Drug</label>
          <SearchDispensaryDrug
            autoFocus={true}
            drugCodeRef={drugCodeRef}
            handleResult={handleDrugCodeChange}
          />
        </div>

        <div className="col-xs-12 col-sm-12 offset-md-1 offset-lg-1 col-md-6 col-lg-6">
          <div className="row">
            <div className="col-md-6 col-lg-6">
              <label>Quantity:</label>
              <input
                type="text"
                className="form-control"
                name="qtty"
                ref={quantityRef}
                onChange={({ target }) => handleQttyChange(target)}
                value={servicesForm.qtty ? servicesForm.qtty : ''}
              />
            </div>
            <div className="col-md-6 col-lg-6">
              <label>Price</label>
              <input
                type="text"
                className="form-control"
                disabled
                name="price"
                onChange={handleChange}
                value={drugInfo.selling_price}
              />
            </div>
          </div>
        </div>
      </FormGroup>
      <Card className="p-2" style={{ borderLeft: `3px solid ${primaryColor}` }}>
        <Row>
          <Col>
            <label htmlFor="drugName" className="mr-1">
              Name:
            </label>
            <label htmlFor="">{drugInfo.drugName}</label>
          </Col>

          <Col>
            <label htmlFor="qtty" className="mr-1">
              Quantity Available:
            </label>
            <label htmlFor="">{drugInfo.quantityAvailable}</label>
          </Col>
          <Col>
            <label htmlFor="price" className="mr-1">
              Expiry:
            </label>
            <label htmlFor="">{drugInfo.expiryDate}</label>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default (AccountForm);
