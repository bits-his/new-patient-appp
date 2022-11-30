import React, { useEffect } from "react";
import VerticalMenu from "../comp/components/vertical-menu/VerticalMenu";
import ListMenuItem from "../comp/components/vertical-menu/ListMenuItem";
import {
  FaAmazonPay,
  FaUserPlus,
  FaRegistered,
  FaAddressCard,
} from "react-icons/fa";
import {
  GiPayMoney,
  GiShakingHands,
  GiChart,
  GiOpenBook,
} from "react-icons/gi";
import { IoIosPaper, IoMdMedical } from "react-icons/io";
import { GoNote } from "react-icons/go";
import {
  AiOutlineEdit,
  AiOutlineBranches,
  AiOutlineFileDone,
} from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { canUseThis } from "../auth";
import { MdVideogameAsset, MdLocalLaundryService } from "react-icons/md";
import {
  getPendingDiscount,
  getPendingPartPayments,
} from "../../redux/actions/account";
import { Badge } from "reactstrap";
import { BsWallet } from "react-icons/bs";

const AccountMenu = () => {
  // const facility = useSelector((state) => state.facility.info);
  const user = useSelector((state) => state.auth.user);

  // const facilityText = facility.type==='hospital'?'Hospi'
  const pendingList = useSelector(
    (state) => state.account.pendingDiscountRequests
  );
  const pendingPartPayment = useSelector(
    (state) => state.account.pendingPartPayment
  );
  const dispatch = useDispatch();

  const pendingDiscountCount = pendingList.length;
  const pendingPartPaymentCount = pendingPartPayment.length;

  useEffect(() => {
    dispatch(getPendingDiscount());
    dispatch(getPendingPartPayments());

    let refresh = setInterval(() => {
      dispatch(getPendingDiscount());
      dispatch(getPendingPartPayments());
    }, 20000);

    return () => {
      clearInterval(refresh);
    };
  }, [dispatch]);

  return (
    <VerticalMenu title="What would you like to do?">
      {user.accessTo
        ? canUseThis(user, ["Other Incomes"]) && (
            <ListMenuItem route="/me/account/services">
              <FaAmazonPay
                size={26}
                fontWeight="bold"
                style={{ marginRight: 10 }}
              />
              Other Incomes
            </ListMenuItem>
          )
        : null}

      {user.accessTo
        ? canUseThis(user, ["Record Expenses"]) && (
            <ListMenuItem route="/me/account/expenditure">
              <GiChart size={26} style={{ marginRight: 10 }} />
              Record Expenses
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Make Deposit"]) && (
            <ListMenuItem route="/me/account/deposit">
              <GiPayMoney size={26} style={{ marginRight: 10 }} />
              Make Deposit
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Create a Client Account"]) && (
            <ListMenuItem route="/me/account/new-client">
              <FaUserPlus size={26} style={{ marginRight: 10 }} />
              Create a Client Account
            </ListMenuItem>
          )
        : null}

      {user.accessTo
        ? canUseThis(user, ["Cash Handover"]) && (
            <ListMenuItem route="/me/account/cash-movement">
              <GiShakingHands size={26} style={{ marginRight: 10 }} /> Click for
              Cash Movement
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Generate Account Report"]) && (
            <ListMenuItem route="/me/account/report">
              <IoIosPaper size={26} style={{ marginRight: 10 }} />
              Generate Account Report
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Opening Balance"]) && (
            <ListMenuItem route="/me/account/opening-balance">
              <GiOpenBook size={26} style={{ marginRight: 10 }} />
              Opening Balance
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Generate Account Report"]) && (
            <ListMenuItem route="/me/account/generate-doctors-report-fees">
              <IoMdMedical size={26} style={{ marginRight: 10 }} />
              Doctors Report Fees
            </ListMenuItem>
          )
        : null}
      {/* 
      {user.accessTo
        ? canUseThis(user, ['Generate Account Report']) && (
            <ListMenuItem route="/me/account/report">
              <IoIosPaper size={26} style={{ marginRight: 10 }} />
              Generate Balance Sheet
            </ListMenuItem>
          )
        : null} */}
      {user.accessTo
        ? canUseThis(user, ["Account Statement"]) && (
            <ListMenuItem route="/me/account/client-statement">
              <GoNote size={26} style={{ marginRight: 10 }} />
              Account Statement
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Create/Edit Services"]) && (
            <ListMenuItem route="/me/account/setup-services">
              <AiOutlineEdit size={26} style={{ marginRight: 10 }} /> Click to
              Create/Edit Services
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Setup Account Chart"]) && (
            <ListMenuItem route="/me/account/chart">
              <AiOutlineBranches size={26} style={{ marginRight: 10 }} />
              Setup Account Chart
            </ListMenuItem>
          )
        : null}

      {user.accessTo
        ? canUseThis(user, ["Asset Register"]) && (
            <ListMenuItem route="/me/account/asset-register">
              <MdVideogameAsset size={26} style={{ marginRight: 10 }} />
              Asset Register
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Rent Register"]) && (
            <ListMenuItem route="/me/account/rent-register">
              <FaRegistered size={26} style={{ marginRight: 10 }} />
              Rent Register
            </ListMenuItem>
          )
        : null}

      {user.accessTo
        ? canUseThis(user, ["Click to setup Transactions"]) && (
            <ListMenuItem route="/me/account/transactions-setup">
              <FiSettings size={26} style={{ marginRight: 10 }} />
              Click to setup Transactions
            </ListMenuItem>
          )
        : null}
      {/* {user.accessTo
        ? canUseThis(user, ['Cash Handover']) && (
            <ListMenuItem route="/me/account/handover">
              <GiShakingHands size={26} style={{ marginRight: 10 }} /> Click for
              Cash Handover
            </ListMenuItem>
          )
        : null} */}
      {user.accessTo
        ? canUseThis(user, ["Pending Discount Requests"]) && (
            <ListMenuItem route="/me/account/discount-approval">
              <MdLocalLaundryService size={26} style={{ marginRight: 10 }} />{" "}
              Pending Discount Requests{" "}
              {pendingDiscountCount > 0 ? (
                <Badge color="warning" size="lg">
                  {pendingDiscountCount}
                </Badge>
              ) : null}
            </ListMenuItem>
          )
        : null}
      {user.accessTo
        ? canUseThis(user, ["Account Review"]) && (
            <ListMenuItem route="/me/account/review">
              <FaAddressCard size={26} style={{ marginRight: 10 }} /> Account
              Review
            </ListMenuItem>
          )
        : null}

      {user.accessTo
        ? canUseThis(user, ["Discount Setup"]) && (
            <ListMenuItem route="/me/account/discount-setup">
              <BsWallet size={26} style={{ marginRight: 10 }} /> Discount Setup
            </ListMenuItem>
          )
        : null}

      {user.accessTo
        ? canUseThis(user, ["Account Review"]) && (
            <ListMenuItem route="/me/account/pending-payments">
              <AiOutlineFileDone size={26} style={{ marginRight: 10 }} /> Part
              Payment Transactions{" "}
              {pendingPartPaymentCount > 0 ? (
                <Badge color="warning" size="lg">
                  {pendingPartPaymentCount}
                </Badge>
              ) : null}
            </ListMenuItem>
          )
        : null}

      {user.accessTo
        ? canUseThis(user, ["Purchase Record"]) && (
            <ListMenuItem route="/me/account/purchase/record/table">
              <FaAmazonPay
                size={26}
                fontWeight="bold"
                style={{ marginRight: 10 }}
              />
              Purchase Record
            </ListMenuItem>
          )
        : null}
    </VerticalMenu>
  );
};

export default AccountMenu;
