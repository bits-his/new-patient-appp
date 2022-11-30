import React from 'react';
import { CardFooter } from 'reactstrap';
import { LoadingSM } from '../../loading';
import { FaSave } from 'react-icons/fa';

const ServiceFooter = ({
  servicesList,
  // prepareBilling,
  saveCosting,
  saveCostingLoading,
}) => {
  return (
    <>
      <CardFooter>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {servicesList.length ? (
            <>
              {/* <button className="btn btn-warning" onClick={prepareBilling} title='Prepare Bill'>
                Prepare bill
              </button> */}
              {/* <button className="btn btn-success" onClick={() => {}}>
                Generate Invoice
              </button> */}
            </>
          ) : null}
          {servicesList.length ? (
            <button
              className="btn btn-primary col-xs-12 col-sm-12 offset-md-4 offset-lg-4 col-md-4 col-lg-4"
              onClick={saveCosting}
            >
              {saveCostingLoading ? (
                <LoadingSM />
              ) : (
                <>
                  <FaSave size={18} style={{ marginRight: 5 }} />
                  Pay now
                </>
              )}
            </button>
          ) : null}
        </div>
      </CardFooter>
    </>
  );
};
export default ServiceFooter;
