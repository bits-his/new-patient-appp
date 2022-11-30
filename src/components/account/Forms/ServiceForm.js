import React from 'react';
import { formatNumber } from '../../utils/helpers';

const ServiceForm = ({ balance, total, paymentMedium,discountValue }) => {
  return (
    <>
      <p className="text-right">
        Discount :{formatNumber(discountValue) || 0}
        <br />
        Grand Total: {Math.round(formatNumber(total)) || 0} <br />
        {/* Balance:{formatNumber(serviceDetails.balance)} <br/> */}
        {/* {paymentMedium === 'insta' ? null : (
          <span>New Account Balance :{formatNumber(balance) || 0}</span>
        )} */}
        {/* {formatNumber(this.state.total - this.state.discount_value) || */}
      </p>
    </>
  );
};
export default ServiceForm;
