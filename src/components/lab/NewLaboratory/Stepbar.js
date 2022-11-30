import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

let itemStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
};

function Stepbar() {
  return (
    <div className="mother" data-aos="flip-left">
      <div className="motherwrapper">
        <div className="arrow-steps clfix">
          <NavItem path="patients/new" title="Patient Registration" />
          <NavItem path="deparment" title=" Department" />
          <NavItem path="payment" title=" Payment" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ path, title }) {
  const location = useLocation();
  const history = useHistory();
  return (
    <div
      onClick={() => history.push(`/me/lab/patients/new/${path}`)}
      style={itemStyle}
      className={`step ${
        location.pathname === `/me/lab/patients/new/${path}` ? 'current' : ''
      }`}
    >
      {title}
    </div>
  );
}

export default Stepbar;
