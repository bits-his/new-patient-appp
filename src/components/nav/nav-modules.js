import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  FaCoins,
  FaBook,
  FaNotesMedical,
  FaUserAlt,
  FaRegClipboard,
  FaFileInvoiceDollar,
  FaUserSecret,
  FaUserNurse,
  FaCalendar,
} from "react-icons/fa";
import { Nav, NavItem } from "reactstrap";
import { MdLocalPharmacy } from "react-icons/md";
import { GiStethoscope, GiTransparentTubes } from "react-icons/gi";
import { hasAccess } from "../auth";

const NavModules = ({ user, toggle, userAccess }) => {
  return (
    <Nav className="ml-auto" navbar>
      {/* {user.accessTo
        ? hasAccess(user, ["Records"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/records" className="nav">
                <FaBook size={16} style={{ marginRight: 3 }} />
                Records
              </NavLink>
            </NavItem>
          )
        : null} */}
      {user.accessTo
        ? hasAccess(user, ["Doctors"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/doctor" className="nav">
                <GiStethoscope
                  size={userAccess.length === 1 ? 30 : 22}
                  style={{ marginRight: 3 }}
                />
                {userAccess.length === 1 ? null : "Doctors"}
              </NavLink>
            </NavItem>
          )
        : null}

<NavItem onClick={toggle}>
              <NavLink to="/me/patient/home" className="nav">
                <GiStethoscope
                  size={userAccess.length === 1 ? 30 : 22}
                  style={{ marginRight: 3 }}
                />
              Patient
              </NavLink>
            </NavItem>
{/* 
      {user.accessTo
        ? hasAccess(user, ["Nurse"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/nurse" className="nav">
                <FaUserNurse
                  size={userAccess.length === 1 ? 30 : 22}
                  style={{ marginRight: 3 }}
                />
                Nursing
              </NavLink>
            </NavItem>
          )
        : null} */}

      {/* {user.accessTo
        ? hasAccess(user, ["Pharmacy"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/pharmacy" className="nav">
                <MdLocalPharmacy size={16} style={{ marginRight: 3 }} />
                Pharmacy
              </NavLink>
            </NavItem>
          )
        : null} */}
      {/* {user.accessTo
        ? hasAccess(user, ["Laboratory"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/lab" className="nav">
                <GiTransparentTubes size={16} style={{ marginRight: 3 }} />
                Laboratories
              </NavLink>
            </NavItem>
          )
        : null} */}

      {/* {user.accessTo
        ? hasAccess(user, ["Inventory"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/inventory" className="nav">
                <FaFileInvoiceDollar size={16} style={{ marginRight: 3 }} />
                Inventory
              </NavLink>
            </NavItem>
          )
        : null} */}

      {/* {user.accessTo
        ? hasAccess(user, ["Accounts"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/account" className="nav">
                <span style={{ marginRight: 3 }}>
                  <FaCoins size={16} style={{ marginLeft: 5 }} />
                </span>
                Accounts
              </NavLink>
            </NavItem>
          )
        : null} */}

      {/* {user.accessTo
        ? hasAccess(user, ["Theater"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/theater" className="nav">
                <span style={{ marginRight: 3 }}>
                  <FaNotesMedical size={16} style={{ marginLeft: 5 }} />
                </span>
                Theater
              </NavLink>
            </NavItem>
          )
        : null} */}
      {/* {user.accessTo
        ? hasAccess(user, ["Reports"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/report" className="nav">
                <span style={{ marginRight: 3 }}>
                  <FaRegClipboard size={16} style={{ marginLeft: 5 }} />
                </span>
                Reports
              </NavLink>
            </NavItem>
          )
        : null}

      {user.accessTo
        ? hasAccess(user, ["Human Resource"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/hr" className="nav">
                <span style={{ marginRight: 3 }}>
                  <FaUserSecret size={16} style={{ marginLeft: 5 }} />
                </span>
                Human Resource
              </NavLink>
            </NavItem>
          )
        : null} */}
      {/* {user.accessTo
        ? hasAccess(user, ["Inventory"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/new_inventory" className="nav">
                <span style={{ marginRight: 3 }}>
                  <FaFileInvoiceDollar size={16} style={{ marginLeft: 5 }} />
                </span>
                Inventory
              </NavLink>
            </NavItem>
          )
        : null} */}

      {/* {user.accessTo
        ? hasAccess(user, ["Appointments"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/appointments" className="nav">
                <span style={{ marginRight: 3 }}>
                  <FaCalendar size={16} style={{ marginLeft: 5 }} />
                </span>
                Appointments
              </NavLink>
            </NavItem>
          )
        : null} */}

      {/* {user.accessTo
        ? hasAccess(user, ["Admin"]) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/admin" className="nav">
                <span style={{ marginRight: 3 }}>
                  <FaUserAlt size={16} style={{ marginLeft: 5 }} />
                </span>
                Admin
              </NavLink>
            </NavItem>
          )
        : null} */}
      {/* 
      {user.accessTo
        ? hasAccess(user, ['Maintenance']) && (
            <NavItem onClick={toggle}>
              <NavLink to="/me/maintenance" className="nav">
                <span style={{ marginRight: 3, }}>
                  <GiAutoRepair size={16} style={{ marginLeft: 5 }} />
                </span>
                Maintenance
              </NavLink>
            </NavItem>
          )
        : null} */}
    </Nav>
  );
};

function mapStateToProps(state) {
  return {
    userAccess: state.auth.user.accessTo,
  };
}

export default connect(mapStateToProps)(NavModules);
