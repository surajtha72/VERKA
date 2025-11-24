import React, { useState } from "react";
import "./ProSideNavStyles.scss";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import Logo from "./../../../logo.png";
import CsiLogo from "../../../assets/images/csi_logo_white.png"
import { FaBars, FaHome, FaBuilding, FaUser, FaTruck, FaMoneyBillAlt, FaChartBar, FaFlask, FaBalanceScale } from "react-icons/fa";

const ProSideNavComponent = () => {
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  let roleId = userAuthData?.userDetails.roleId;
  const [showNestedSubMenu, setShowNestedSubMenu] = useState(false);
  const handleNestedSubMenuToggle = () => {
    setShowNestedSubMenu(!showNestedSubMenu);
  };

  return (
    <div className="sidebar-container">
      {roleId == 33 ? (

        <Sidebar>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "1vw 1vw",
            }}
          >
            <img
              src={Logo}
              className="img-thumbnail"
              alt="Ganga Milk Daily"
              style={{ width: "60%" }}
            />
          </div>
          <Menu
            iconShape="square"
            menuItemStyles={{
              button: {
                [`&.active`]: {
                  backgroundColor: "#13395e",
                  color: "#b6c8d9",
                },
              },
            }}
          >
            <SubMenu icon={<FaBalanceScale />} label="Weigh Bridge">
              <MenuItem component={<Link to="weigh-bridge" />}>
                Weighbridge Entry
              </MenuItem>
              <MenuItem component={<Link to="sample" />}>
                Composite Sample Test
              </MenuItem>
            </SubMenu>
          </Menu>
        </Sidebar>
      ) : (
        <Sidebar className="sidebar">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "1vw 1vw",
            }}
          >
            <img
              src={Logo}
              className="img-thumbnail"
              alt="Ganga Milk Daily"
              style={{ width: "60%" }}
            />
          </div>
          <Menu
            iconShape="square"
            menuItemStyles={{
              button: {
                [`&.active`]: {
                  backgroundColor: "#13395e",
                  color: "black",
                },
                [`&:hover`]: {
                  backgroundColor: "#dcdcec",
                  color: "black",
                },
              },
            }}
          >
            <MenuItem icon={<FaHome />} component={<Link to="dashboard" />}>Dashboard</MenuItem>

            <SubMenu icon={<FaUser />} label="UAM">
              <MenuItem component={<Link to="organization-list" />}>
                Define Organization
              </MenuItem>
              <MenuItem component={<Link to="roles-list" />}>Role</MenuItem>
              <MenuItem component={<Link to="user" />}>User</MenuItem>
              <MenuItem component={<Link to="agent-master" />}>Pooling Point</MenuItem>
              <MenuItem component={<Link to="farmer-master" />}>Farmer/Member Master</MenuItem>
            </SubMenu>

            <SubMenu icon={<FaBuilding />} label="Master Data" onClick={handleNestedSubMenuToggle}>
              <MenuItem component={<Link to="routes-list" />}>Route</MenuItem>
              <MenuItem  component={<Link to="transporters" />}>
                Transporters
              </MenuItem>
              <MenuItem component={<Link to="financial-year" />}>
                Financial Year
              </MenuItem>
              <MenuItem component={<Link to="cycle-list" />}>
                Billing Cycle
              </MenuItem>
              <MenuItem component={<Link to="bank" />}>Bank</MenuItem>
              <MenuItem component={<Link to="states" />}>
                State/District/Taluka
              </MenuItem>
              <MenuItem component={<Link to="manual-entry" />}>Manual Unlock Request</MenuItem>
              <MenuItem component={<Link to="collection-entry" />}>Collection Unlock Request</MenuItem>
              <MenuItem component={<Link to="complaint-cycle" />}>Complaint Form</MenuItem>
            </SubMenu>

            <SubMenu icon={<FaTruck />} label="Product">
              <MenuItem component={<Link to="product" />}>Product Master</MenuItem>
              <MenuItem component={<Link to="product-supply" />}>Product Supply</MenuItem>
              <MenuItem component={<Link to="product-sales-billing-cycle" />}>Product Sales</MenuItem>
              <MenuItem component={<Link to="product-stocks" />}>Product Stocks</MenuItem>
            </SubMenu>

            <SubMenu icon={<FaMoneyBillAlt />} label="Rate Chart">
              <MenuItem component={<Link to="rate" />}>Rate</MenuItem>
              <MenuItem component={<Link to="rate-incentive" />}>
                Incentive
              </MenuItem>
              <MenuItem component={<Link to="rate-chart" />}>Rate Chart</MenuItem>
            </SubMenu>

            <SubMenu icon={<FaChartBar />} label="Reports">
              <MenuItem component={<Link to="bmc-cycle-list" />}>
                BMC Wise Milk Payroll Generation
              </MenuItem>
              <MenuItem component={<Link to="route-cycle-list" />}>
                Route Wise Milk Payroll Generation
              </MenuItem>
              <MenuItem component={<Link to="transit-loss" />}>
                Transit Loss/Gain
              </MenuItem>
              <MenuItem component={<Link to="tanker_milk_reconcillation_reports" />}>
                Tanker Milk Reconcillation
              </MenuItem>
              <MenuItem component={<Link to="weighbridge-report" />}>
                Weighbridge Report
              </MenuItem>

              <SubMenu label="Bank Advices" className="innersubmenu">
                <MenuItem component={<Link to="bmc-cycle-list-bank-advice" />}>
                  Bank Advice without IFSC
                </MenuItem>
                <MenuItem component={<Link to="bmc-cycle-list-bank-advice-ifsc" />}>
                  Bank Advice with IFSC
                </MenuItem>
                <MenuItem component={<Link to="bmc-cycle-list-bank-advice-routes" />}>
                  Bank Advice with Routes
                </MenuItem>
                <MenuItem component={<Link to="cycle-list-bank-letter" />}>
                  Bank Letter
                </MenuItem>
              </SubMenu>
              <MenuItem component={<Link to="lock-milk-collection-details" />}>Finalize Milk Payroll</MenuItem>
              <SubMenu label="Reconcillation Reports" className="innersubmenu">
                <MenuItem component={<Link to="bmc-cycle-list-reconcillation" />}>
                  BMC-Wise
                </MenuItem>
                <MenuItem component={<Link to="datewise-cycle-list-reconcillation" />}>
                  Date-Wise
                </MenuItem>
                <MenuItem component={<Link to="agent-cycle-list-reconcillation" />}>
                  Agent-Wise
                </MenuItem>
              </SubMenu>

              <SubMenu label="Milk Collection Reports" className="innersubmenu">
                <MenuItem component={<Link to="bmc-collection-cycle-list" />}>
                  BMC-Wise
                </MenuItem>
                <MenuItem component={<Link to="agent-cycle-list-collection" />}>
                  Agent-Wise
                </MenuItem>
                <MenuItem component={<Link to="route-collection-cycle-list" />}>
                  Route-Wise
                </MenuItem>
              </SubMenu>

              <MenuItem component={<Link to="payment-checklist-cycle-list" />}>
                Payout Check List
              </MenuItem>
              <MenuItem component={<Link to="agent-ledger-cycle-list" />}>
                Agent Ledger
              </MenuItem>
              <MenuItem component={<Link to="inward-transportation-form" />}>
                Inward Transportation
              </MenuItem>
              <MenuItem component={<Link to="vehicle-attendance-form" />}>
                Vehicle Attendance Sheet
              </MenuItem>

            </SubMenu>

            <MenuItem icon={<FaFlask />} component={<Link to="milk-collections" />}>
              Milk Collections
            </MenuItem>

            <SubMenu icon={<FaBalanceScale />} label="Weigh Bridge">
              <MenuItem component={<Link to="weigh-bridge" />}>
                Weighbridge Entry
              </MenuItem>
              <MenuItem component={<Link to="sample" />}>
                Composite Sample Test
              </MenuItem>
            </SubMenu>

          </Menu>
          <div className="sidebar-footer">
            <span className="mr-1">Powered by </span>
            <a href="http://csinc.in" target="_blank" rel="noopener noreferrer">
              <img
                src={CsiLogo}
                // className="img-thumbnail"
                alt="Csi Logo"
                style={{ width: "20%", marginBottom: "5px" }}
              /></a>
          </div>
        </Sidebar>
      )}
    </div>
  );
};

export default ProSideNavComponent;