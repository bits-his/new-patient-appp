import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import PendingPayments from '../lab/NewLaboratory/registration/PendingPayments'
import PendingPaymentsDetail from '../lab/NewLaboratory/registration/PendingPaymentsDetail'
import DoctorFees from './reports/DoctorFees'
// import { useSelector } from 'react-redux'
// import { _fetchApi2 } from '../../redux/actions/api'
// import { apiURL } from '../../redux/actions'
import DiscountSetup from './Forms/DiscountSetup'
import DiscountApproval from './DiscountApproval'
import DoctorFeesDetails from './reports/DoctorFeesDetails'
import OpeningBalance from './OpeningBalance'

// import AccountReport from './AccountReport';
// import AssetRegister from "./AssetScheduleRegister";
// import { FiSettings } from 'react-icons/fi';
// import ServicesTxnSetup from './transactions-setup/Services';

import AddClient from './AddClient'
import ClientStatementAccount from './ClientStatementAccount'
import ServicesSetupForm from './ServicesSetup'
import ReportsContainer from './reports/ReportsContainer'
import PatientDeposit from './PatientDeposit'
import Services from './Services'
import Expenditure from './Expenditure'
import Review from './Review'
import AccountChart from './AccountChart'
import Transfers from './Transfers'
import TransactionSetup from './TransactionSetup'
import CreateAsset from './CreateAsset'
import RentRegister from './RentRegister'
import MoveMoney from './MoveMoney'
import RevenueDetails from './reports/RevenueDetails'
import ExpenseDetails from './reports/ExpenseDetails'
import RecordPurchase from './RecordPurchase'

function AccountDashboard() {
  // const user = useSelector((state) => state.auth.user);
  // const history = useHistory()

  // useEffect(
  //   () => {
  //     // if(user.role.toLowerCase())
  //     _fetchApi2(
  //       `${apiURL()}/navigation/get-homepage?facilityId=${
  //         user.facilityId
  //       }&role=${user.role}`,
  //       data => {
  //         if(data.results) {
  //           let url = data.results.length ? data.results[0].home_page : '/me/account'
  //           history.push(url)
  //         }
  //       }
  //     )
  //   },
  //   [user.role]
  // );

  return (
    <div>
      <Switch>
        <Route path="/me/account/deposit" component={PatientDeposit} />
        <Route path="/me/account/new-client" component={AddClient} />
        <Route
          path="/me/account/client-statement"
          component={ClientStatementAccount}
        />
        <Route
          path="/me/account/setup-services"
          component={ServicesSetupForm}
        />
        <Route path="/me/account/report" component={ReportsContainer} />
        <Route
          path="/me/account/generate-doctors-report-fees"
          component={DoctorFees}
        />
        <Route
          path="/me/account/generate-doctors-report-fees-details/:docId"
          component={DoctorFeesDetails}
        />
        <Route path="/me/account/opening-balance" component={OpeningBalance} />
        {/* <Route path="/me/account/report" component={AccountReport} /> */}
        <Route path="/me/account/services" component={Services} />
        <Route path="/me/account/expenditure" component={Expenditure} />
        <Route path="/me/account/review" component={Review} />
        <Route path="/me/account/discount-setup" component={DiscountSetup} />
        <Route
          path="/me/account/discount-approval"
          component={DiscountApproval}
        />
        <Route
          path="/me/account/pending-payments"
          component={PendingPayments}
        />
        <Route
          path="/me/account/pending-payments-details"
          component={PendingPaymentsDetail}
        />
        <Route path="/me/account/chart" component={AccountChart} />
        <Route path="/me/account/asset-register" component={CreateAsset} />
        <Route path="/me/account/rent-register" component={RentRegister} />
        <Route
          path="/me/account/transactions-setup"
          component={TransactionSetup}
        />
        <Route path="/me/account/cash-movement" component={MoveMoney} />
        <Route path="/me/account/handover" component={Transfers} />
        {/* <Route
          exact
          path="/me/account/details/:type/:receiptDateSN/:description"
          component={RevenueDetails}
        /> */}
        <Route exact path="/me/account/details" component={RevenueDetails} />
        <Route
          exact
          path="/me/account/details-expenses"
          component={ExpenseDetails}
        />
        <Route path="/me/account/purchase/record" component={RecordPurchase} />
        <Redirect from="/me/account" to="/me/account/services" />
      </Switch>
    </div>
  );
}

export default AccountDashboard
