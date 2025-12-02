import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "../app/pages/login/Login";
import Dashboard from "../app/pages/dashboard/Dashboard";
import ChangePassword from "../app/pages/changepassword/ChangePassword";
import User from "../app/pages/uam/user/User";
import OrganizationList from "../app/pages/organization/organizationlist/OrganizationList";
import RolesList from "../app/pages/roles/roleslist/RolesList";
import RoutesList from "../app/pages/routes/routeslist/RoutesList";
import CycleList from "../app/pages/reports/cycle/cyclelist/CycleList";
import Transporters from "../app/pages/mdm/transporters/Transporters";
import Transporter from "../app/pages/mdm/transporters/Transporter";
import RouteMaster from "../app/pages/mdm/routes/Routes";
import AddRoute from "../app/pages/mdm/routes/AddRoute";
import Rate from "../app/pages/rate/RateList";
import Incentive from "../app/pages/rate/Incentive";
import Target from "../app/pages/rate/Target";
import State from "../app/pages/mdm/state/State";
import ProSideNavComponent from "../app/components/prosidenav/ProSideNavComponent";
import IncentiveSlabs from "../app/pages/rate/IncentiveSlabs";
import FinancialYear from "../app/pages/financialyear/FinancialYear";
import Bank from "../app/pages/mdm/bank/Bank";
import RateApplied from "../app/pages/rate/RateApplied";
import MilkCollection from "../app/pages/milkcollections/MilkCollection";
import MilkCollectionDetails from "../app/pages/milkcollections/MilkCollectionDetails";
import RouteStop from "../app/pages/routes/routeslist/RoutesStop";
import InvoiceBilling from "../app/pages/reports/cycle/cyclelist/InvoiceBilling";
import Product from "../app/pages/mdm/products/Product";
import ProductSupply from "../app/pages/mdm/products/ProductSupply";
import WeighBridge from "../app/pages/weighbridge/WeighBridge";
import BmcCycleList from "../app/pages/reports/bmc cycle list/BmcCycleList";
import RouteCycleList from "../app/pages/reports/route cycle list/RouteCycleList";
import BmcInvoiceBilling from "../app/pages/reports/bmc cycle list/BmcInvoiceBilling";
import RouteInvoiceBilling from "../app/pages/reports/route cycle list/RouteInvoiceBilling";
import BankBranches from "../app/pages/mdm/bank/BankBranches";
import CompositeSampleTest from "../app/pages/weighbridge/CompositeSampleTest";
import WeighbridgeReport from "../app/pages/reports/weighbridge report/WeighbridgeReport";
import IndentProducts from "../app/pages/mdm/products/IndentProducts";
import AgentMaster from "../app/pages/organization/organizationlist/AgentMaster";
import ManualEntry from "../app/pages/mdm/manualEntry/ManualEntry";
import RateChart from "../app/pages/rateChart/rateChart";
import TransitLossReport from "../app/pages/reports/transitloss/TransitLoss";
import BmcCycleListBankAdvice from "../app/pages/reports/bank advice/BmcCycleList";
import BmcBankAdvice from "../app/pages/reports/bank advice/BmcBankAdvice";
import BmcBankAdviceRoutes from "../app/pages/reports/bank advice routes/BmcBankAdviceRoutes"
import BmcCycleListBankAdviceRoutes from "../app/pages/reports/bank advice routes/BmcCycleListRoutes";
import BankLetter from "../app/pages/reports/bank letter/BankLetter";
import CycleListBankLetter from "../app/pages/reports/bank letter/BmcCycleList";
import BmcReconcillationReport from "../app/pages/reports/bmc reconcillation report/BmcReconcillationReport";
import BmcCycleListReconcillation from "../app/pages/reports/bmc reconcillation report/BmcReconcillationCycleList";
import AgentMilkCollectionCycleList from "../app/pages/reports/agentwise milk collection/AgentMilkCollectionCycleList";
import AgentMilkCollectionReport from "../app/pages/reports/agentwise milk collection/AgentMilkCollectionReport"
import BmcWiseCollectionReport from "../app/pages/reports/bmc wise collection details/BmcWiseCollectionReport";
import BmcWiseCollectionCycleList from "../app/pages/reports/bmc wise collection details/BmcWiseCollectionCycleList";
import DateWiseReconcillationReport from "../app/pages/reports/datewise reconcillation report/DateWiseReconcillationReport";
import DateWiseCycleListReconcillation from "../app/pages/reports/datewise reconcillation report/DateWiseReconcillationCycleList";
import AgentWiseReconcillationReport from "../app/pages/reports/agentwise reconcillation report/AgentWiseReconcillationReport";
import AgentWiseCycleListReconcillation from "../app/pages/reports/agentwise reconcillation report/AgentWiseReconcillationCycleList";
import RouteWiseCollectionReport from "../app/pages/reports/route wise collection details/RouteWiseCollectionReport";
import RouteWiseCollectionCycleList from "../app/pages/reports/route wise collection details/RouteWiseCollectionCycleList";
import PaymentCheckListReport from "../app/pages/reports/payout check list/PayoutCheckList";
import PaymentCheckListCycleList from "../app/pages/reports/payout check list/PayoutCycleList";
import AgentLedgerReport from "../app/pages/reports/agent ledger/AgentLedgerReport";
import AgentLedgerCycleList from "../app/pages/reports/agent ledger/AgentLedgerCycleList";
import InwardTransportation from "../app/pages/reports/inward transportation detail/InwardTransportation";
import InwardTransportationForm from "../app/pages/reports/inward transportation detail/InwardTransportationForm";
import KrishibazaReport from "../app/pages/reports/bmc cycle list/KrishibazarReport";
import IfscBmcCycleListBankAdvice from "../app/pages/reports/bank advice/withIFSC/WithIfscCycleList";
import IfscBmcBankAdvice from "../app/pages/reports/bank advice/withIFSC/WithIfscBankAdvice";
import ProductSalesToAgent from "../app/pages/mdm/products/ProductSalesToAgent";
import ProductSalesBillingCycle from "../app/pages/mdm/products/ProductSalesBillingCycle";
import CompaintResolutionForm from "../app/pages/mdm/complaint resolution/ComplaintResolutionForm";
import ComplaintCycle from "../app/pages/mdm/complaint resolution/ComplaintCycle";
import LockMilkCollectionDetails from "../app/pages/milkcollections/LockMilkCollectionDetails";
import ProductStocks from "../app/pages/mdm/products/ProductStocks";
import TransitLossGainReportS from "../app/pages/reports/transitloss/TransitLossgainReports";
import VehicleAttendance from "../app/pages/reports/vehicle attendance sheet/VehicleAttendance";
import VehicleAttendanceForm from "../app/pages/reports/vehicle attendance sheet/VehicleAttendanceForm";
import CollectionEntry from "../app/pages/mdm/collectionEntry/CollectionEntry";
import FarmerMaster from "../app/pages/organization/organizationlist/FarmerMaster";
import MilkDispatchTester from "../app/pages/test/MilkDispatchTester";
const HeaderWithCondition = () => {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/" || location.pathname === "/changepassword";
  return !hideHeader && <ProSideNavComponent />;
};

function RouterComponent() {
  const token = localStorage.getItem("token");

  const currentTime = Date.now();
  const expires = localStorage.getItem("expires");
  const expiryTime = currentTime + expires * 1000;

  if (expires && currentTime >= expiryTime) {
    localStorage.clear();
  }

  return (
    <Router>
      <HeaderWithCondition />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/user" element={<User />} />
        <Route path="/organization-list" element={<OrganizationList />} />
        <Route path="/organization-list" element={<OrganizationList />} />
        <Route path="/transporters" element={<Transporters />} />
        <Route path="/transporter" element={<Transporter />} />
        <Route path="/routes" element={<RouteMaster />} />
        <Route path="/routes/addRoute" element={<AddRoute />} />
        <Route path="/roles-list" element={<RolesList />} />
        <Route path="/routes-list" element={<RoutesList />} />
        <Route path="/rate" element={<Rate />} />
        <Route path="/rate-incentive" element={<Incentive />} />
        <Route path="/rate-incentive-slabs" element={<IncentiveSlabs />} />
        <Route path="/rate-target" element={<Target />} />
        <Route path="/states" element={<State />} />
        <Route path="/transport" element={<Transporter />} />
        <Route path="/financial-year" element={<FinancialYear />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/rate-applied" element={<RateApplied />} />
        <Route path="/milk-collections" element={<MilkCollection />} />
        <Route path="/route-stop" element={<RouteStop />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product-supply" element={<ProductSupply />} />
        <Route path="/product" element={<Product />} />
        <Route path="/weigh-bridge" element={<WeighBridge />} />
        <Route path="/sample" element={<CompositeSampleTest />} />
        <Route path="bank-branches" element={<BankBranches />} />
        <Route path="/cycle-list" element={<CycleList />} />
        <Route path="invoice-billing" element={<InvoiceBilling />} />
        <Route path="bmc-cycle-list" element={<BmcCycleList />} />
        <Route path="bmc-cycle-list-bank-advice" element={<BmcCycleListBankAdvice />} />
        <Route path="bmc-wise-bank-advice" element={<BmcBankAdvice />} />
        <Route path="bmc-cycle-list-bank-advice-routes" element={<BmcCycleListBankAdviceRoutes />} />
        <Route path="bmc-wise-bank-advice-routes" element={<BmcBankAdviceRoutes />} />
        <Route path="bmc-invoice-billing" element={<BmcInvoiceBilling />} />
        <Route path="route-cycle-list" element={<RouteCycleList />} />
        <Route path="route-invoice-billing" element={<RouteInvoiceBilling />} />
        <Route path="cycle-list-bank-letter" element={<CycleListBankLetter />} />
        <Route path="bank-letter" element={<BankLetter />} />
        <Route path="agent-cycle-list-collection" element={<AgentMilkCollectionCycleList />} />
        <Route path="agent-collection-report" element={<AgentMilkCollectionReport />} />
        <Route path="bmc-cycle-list-reconcillation" element={<BmcCycleListReconcillation />} />
        <Route path="bmc-reconcillation-report" element={<BmcReconcillationReport />} />
        <Route path="milk-collection-details" element={<MilkCollectionDetails />} />
        <Route path="weighbridge-report" element={<WeighbridgeReport/>}/>
        <Route path="/indent-products" element={<IndentProducts />} />
        <Route path="agent-master" element={<AgentMaster/>}/>
        <Route path="manual-entry" element={<ManualEntry/>}/>
        <Route path="rate-chart" element={<RateChart/>}/>
        <Route path="transit-loss" element={<TransitLossReport/>}/>
        <Route path="tanker_milk_reconcillation_reports" element={<TransitLossGainReportS/>}/>
        <Route path="bmc-collection-cycle-list" element={<BmcWiseCollectionCycleList />} />
        <Route path="bmc-collection-report" element={<BmcWiseCollectionReport />} />
        <Route path="datewise-cycle-list-reconcillation" element={<DateWiseCycleListReconcillation />} />
        <Route path="datewise-reconcillation-report" element={<DateWiseReconcillationReport />} />
        <Route path="agent-cycle-list-reconcillation" element={<AgentWiseCycleListReconcillation />} />
        <Route path="agent-reconcillation-report" element={<AgentWiseReconcillationReport />} />
        <Route path="route-collection-cycle-list" element={<RouteWiseCollectionCycleList />} />
        <Route path="route-collection-report" element={<RouteWiseCollectionReport />} />
        <Route path="payment-checklist-cycle-list" element={<PaymentCheckListCycleList />} />
        <Route path="payment-checklist-report" element={<PaymentCheckListReport />} />
        <Route path="agent-ledger-cycle-list" element={<AgentLedgerCycleList />} />
        <Route path="agent-ledger-report" element={<AgentLedgerReport />} />
        <Route path="inward-transportation-form" element={<InwardTransportationForm />} />
        <Route path="inward-transportation" element={<InwardTransportation />} />
        <Route path="krishibazar-report" element={<KrishibazaReport />} />
        <Route path="bmc-cycle-list-bank-advice-ifsc" element={<IfscBmcCycleListBankAdvice />} />
        <Route path="bmc-wise-bank-advice-ifsc" element={<IfscBmcBankAdvice />} />
        <Route path="product-sales-billing-cycle" element={<ProductSalesBillingCycle />} />
        <Route path="product-sales-to-agent" element={<ProductSalesToAgent />} />
        <Route path="complaint-form" element={<CompaintResolutionForm />} />
        <Route path="complaint-cycle" element={<ComplaintCycle />} />
        <Route path="lock-milk-collection-details" element={<LockMilkCollectionDetails />} />
        <Route path="product-stocks" element={<ProductStocks />} />
        <Route path="vehicle-attendance-form" element={<VehicleAttendanceForm />} />
        <Route path="vehicle-attendance" element={<VehicleAttendance />} />
        <Route path="collection-entry" element={<CollectionEntry/>}/>
        <Route path="farmer-master" element={<FarmerMaster/>}/>
                <Route path="test" element={<MilkDispatchTester/>}/>

      </Routes>
    </Router>
  );
}

export default RouterComponent;