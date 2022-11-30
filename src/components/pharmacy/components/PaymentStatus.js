import React, { useState } from 'react';
import SelectInput from '../../comp/components/SelectInput';
import InputGroup from '../../comp/components/InputGroup';
import { Row } from 'reactstrap';
import AutoComplete from '../../comp/components/AutoComplete';
import { _fetchApi } from '../../../redux/actions/api';
import { apiURL } from '../../../redux/actions';
import { useEffect } from 'react';

function PaymentStatus({
  handleChange,
  handleCustomerInfoChange,
  paymentStatus,
  customerInfo,
  serviceDetails,
  paymentMedium,
  handleServiceDetailsInputChange,
  setServiceDetails = (f) => f,
  setPaymentMedium,
}) {
  const [accounts, setAccounts] = useState([]);
  const [, setLoading] = useState(false);

  const getAccounts = () => {
    setLoading(true);
    _fetchApi(
      `${apiURL()}/accounts/approved/list`,
      (data) => {
        setLoading(false);
        if (data.success) {
          setAccounts(data.results);
        }
      },
      (err) => {
        setLoading(true);
        console.log(err);
      },
    );
  };

  useEffect(() => getAccounts(), []);

  return (
    <>
      {/* {JSON.stringify(customerInfo)} */}
      <Row>
        <SelectInput
          name="paymentStatus"
          label="Payment Status"
          labelClass="font-weight-normal"
          container="col-md-4 col-lg-4"
          options={['Full Payment', 'Part Payment', 'Pay Later']}
          onChange={(e) => {
            handleChange(e);
            let value = e.target.value;
            if (value === 'Full Payment') {
              setServiceDetails('mode', 'cash');
            } else {
              setServiceDetails('mode', 'Deposit');
              setPaymentMedium('deposit');
            }
          }}
          value={paymentStatus}
        />
        {/* {JSON.stringify(accounts)} */}
        {paymentStatus === 'Part Payment' || paymentStatus === 'Pay Later' ? (
          <>
            {/* <InputGroup
            label="Customer Name"
            name="customerName"
            value={customerName}
            onChange={handleChange}
          /> */}

            <AutoComplete
              options={accounts}
              label="Customer Name"
              // name="name"
              labelKey={(item) => `${item.account_name} (${item.account_no})`}
              // value={customerInfo.name}
              onChange={(val) => {
                // let cInfo = getPatientInfo(val[0]);
                // console.log(cInfo);
                if (val.length) {
                  // const { name, accNo, patientId } = cInfo;
                  let item = val[0];
                  handleCustomerInfoChange('name', item.account_name);
                  handleCustomerInfoChange('accNo', item.account_no);
                  handleCustomerInfoChange('phone', item.contactPhone);
                  // handleCustomerInfoChange('patientId', patientId);
                }
              }}
              onInputChange={(val) => handleCustomerInfoChange('name', val)}
            />
            <InputGroup
              label="Customer Phone"
              name="phone"
              value={customerInfo.phone}
              onChange={(e) =>
                handleCustomerInfoChange('phone', e.target.value)
              }
            />
          </>
        ) : null}

        {paymentStatus === 'Part Payment' ? (
          <InputGroup
            label="Amount Paid"
            name="amountPaid"
            onFocus={() => {
              if (
                customerInfo.amountPaid === '0' ||
                customerInfo.amountPaid === 0
              ) {
                handleCustomerInfoChange('amountPaid', '');
              }
            }}
            onBlur={() => {
              if (customerInfo.amountPaid === '') {
                handleCustomerInfoChange('amountPaid', '0');
              }
            }}
            value={customerInfo.amountPaid}
            onChange={(e) =>
              handleCustomerInfoChange('amountPaid', e.target.value)
            }
          />
        ) : null}

        <div className="col-md-4 col-lg-4">
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
      </Row>
    </>
  );
}

export default PaymentStatus;