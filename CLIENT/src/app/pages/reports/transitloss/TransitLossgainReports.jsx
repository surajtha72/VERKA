// import {
//   CButton,
//   CCol,
//   CFormInput,
//   CFormLabel,
//   CFormSelect,
//   CRow,
//   CTable,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
// } from "@coreui/react";
// import React, { useEffect, useState } from "react";
// import Header from "../../../components/header/Header";
// import { Navigate, useNavigate } from "react-router-dom";
// import {
//   GetMilkDispatch,
//   GetMilkDispatchWithVehicleNo,
//   GetRouteMaster,
//   GetTransitlossGainReports,
//   GetTransitlossWeighbridgeData,
//   GetTransitlossWeighbridgeDataWithVehicleNo,
//   GetVehicles,
// } from "../../../utils/apiCalls";
// import moment from "moment";
// import * as XLSX from "xlsx";
// import Confirm from "../../../components/confirmModal/confirm";
// import TableComponent from "./tablecom";

// const columns = [
//   {
//     key: "SlNo",
//     label: "SL. No.",
//     _props: { scope: "col" },
//   },
//   {
//     key: "vehicle",
//     label: "Vehicle No.",
//     _props: { scope: "col" },
//   },
//   {
//     key: "date",
//     label: "Date",
//     _props: { scope: "col" },
//   },
//   {
//     key: "capacity",
//     label: "Capacity",
//     _props: { scope: "col" },
//   },
//   {
//     key: "received",
//     label: "Received (Total BMCs)",
//     _props: { scope: "col" },
//     children: [
//       {
//         key: "bmc",
//         label: "BMC Count",
//         _props: { scope: "col" },
//       },
//       {
//         key: "fat",
//         label: "Fat %",
//         _props: { scope: "col" },
//       },
//       {
//         key: "snf",
//         label: "SNF %",
//         _props: { scope: "col" },
//       },
//       {
//         key: "weight",
//         label: "Weight (Kg)",
//         _props: { scope: "col" },
//       },
//     ],
//   },
//   {
//     key: "dispatched",
//     label: "Dispatched (Tanker)",
//     _props: { scope: "col" },
//     children: [
//       {
//         key: "weight",
//         label: "Weight (Kg)",
//         _props: { scope: "col" },
//       },
//       {
//         key: "fat",
//         label: "Fat %",
//         _props: { scope: "col" },
//       },
//       {
//         key: "snf",
//         label: "SNF %",
//         _props: { scope: "col" },
//       },
//     ],
//   },
//   {
//     key: "difference",
//     label: "Transit Diff (BMC → Tanker)",
//     _props: { scope: "col" },
//     children: [
//       {
//         key: "weight",
//         label: "Weight (Kg)",
//         _props: { scope: "col" },
//       },
//       {
//         key: "fat",
//         label: "Fat % Δ",
//         _props: { scope: "col" },
//       },
//       {
//         key: "snf",
//         label: "SNF % Δ",
//         _props: { scope: "col" },
//       },
//     ],
//   },
//   {
//     key: "receivedAtFactory",
//     label: "Received at Factory",
//     _props: { scope: "col" },
//     children: [
//       {
//         key: "weight",
//         label: "Weight (Kg)",
//         _props: { scope: "col" },
//       },
//       {
//         key: "fat",
//         label: "Fat %",
//         _props: { scope: "col" },
//       },
//       {
//         key: "snf",
//         label: "SNF %",
//         _props: { scope: "col" },
//       },
//     ],
//   },
//   {
//     key: "finalDifference",
//     label: "Transit Diff (Tanker → Factory)",
//     _props: { scope: "col" },
//     children: [
//       {
//         key: "weight",
//         label: "Weight (Kg)",
//         _props: { scope: "col" },
//       },
//       {
//         key: "fat",
//         label: "Fat % Δ",
//         _props: { scope: "col" },
//       },
//       {
//         key: "snf",
//         label: "SNF % Δ",
//         _props: { scope: "col" },
//       },
//     ],
//   },
//   {
//     key: "actions",
//     label: "Actions",
//     _props: { scope: "col" },
//   },
// ];

// const Filtercolumns = [
//   {
//     key: "heading_2",
//     label: "Vehicle No.",
//     _props: { scope: "col" },
//   },
//   {
//     key: "heading_3",
//     label: "From Date",
//     _props: { scope: "col" },
//   },
//   {
//     key: "heading_4",
//     label: "To Date",
//     _props: { scope: "col" },
//   },
// ];

// const TransitLossGainReportS = () => {
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const [dispatchedData, setdispatchedData] = useState([]);
//   const [weighbridgeData, setWeighbridgeData] = useState([]);
//   const [ReportData, setReportData] = useState([]);
//   const [displayTable, setDisplayTable] = useState(false);
//   const [routeId, setRouteId] = useState();
//   const [vehicleNo, setVehicleNo] = useState();
//   const [routeMasterData, setRouteMasterData] = useState([]);
//   const [vehicleData, setVehicleData] = useState([]);
//   const [fromDate, setFromDate] = useState();
//   const [toDate, setToDate] = useState();

//   const [alertText, setAlertText] = useState("");
//   const [sessionOk, setSessionOk] = useState(false);
//   const [showConfirmModal1, setShowConfirmModal1] = useState(false);

//   // modal states
//   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [manualFactoryValues, setManualFactoryValues] = useState({
//     weight: "",
//     fat: "",
//     snf: "",
//   });

//   const openDetailsModal = (row) => {
//     setSelectedRow(row);
//     setManualFactoryValues({ weight: "", fat: "", snf: "" });
//     setDetailsModalVisible(true);
//   };

//   const closeDetailsModal = () => {
//     setDetailsModalVisible(false);
//     setSelectedRow(null);
//   };

//   const getMilkDispatch = () => {
//     if (vehicleNo) {
//       GetMilkDispatchWithVehicleNo(
//         (res) => {
//           setdispatchedData(res.data);
//         },
//         vehicleNo,
//         fromDate,
//         toDate
//       );
//     } else {
//       GetMilkDispatch(
//         (res) => {
//           setdispatchedData(res.data);
//         },
//         fromDate,
//         toDate
//       );
//     }
//   };

//   const getWeighbridgeData = () => {
//     if (vehicleNo) {
//       GetTransitlossWeighbridgeDataWithVehicleNo(
//         (res) => {
//           setWeighbridgeData(res?.data || []);
//         },
//         vehicleNo,
//         fromDate,
//         toDate
//       );
//     } else {
//       GetTransitlossWeighbridgeData(
//         (res) => {
//           setWeighbridgeData(res?.data || []);
//         },
//         fromDate,
//         toDate
//       );
//     }
//   };

//   // build row from API (frontend calculations)
//   const buildRowFromApi = (data, ind) => {
//     const collectedWeight = Number(data.ReceiptnetWeight || 0);
//     const collectedFatPct = Number(data.ReceiptFat || 0);
//     const collectedSnfPct = Number(data.ReceiptSnf || 0);

//     const tankerWeight = Number(data.TankerDispatchnetWeight || 0);
//     const tankerFatPct = Number(data.TankerDispatchfat || 0);
//     const tankerSnfPct = Number(data.TankerDispatchSnf || 0);

//     const factoryWeight = Number(data.FactoryReceiptWeight || 0);
//     const factoryFatPct = Number(data.FactoryReceiptfat || 0);
//     const factorySnfPct = Number(data.FactoryReceiptSnf || 0);

//     const stage1WeightDiff = tankerWeight - collectedWeight;
//     const stage1FatDiffPct = tankerFatPct - collectedFatPct;
//     const stage1SnfDiffPct = tankerSnfPct - collectedSnfPct;

//     const stage2WeightDiff = factoryWeight - tankerWeight;
//     const stage2FatDiffPct = factoryFatPct - tankerFatPct;
//     const stage2SnfDiffPct = factorySnfPct - tankerSnfPct;

//     const bmcCount = Array.isArray(data.BmcSummary)
//       ? data.BmcSummary.length
//       : 0;

//     return {
//       SlNo: ind + 1,
//       vehicle: data.VehicleNo || (data.vehicle && data.vehicle.RegistrationNo),
//       date: data.ReportDate,
//       capacity: data.vehicle && data.vehicle.Capacity,
//       received: {
//         bmc: bmcCount,
//         fat: collectedFatPct.toFixed(2),
//         snf: collectedSnfPct.toFixed(2),
//         weight: collectedWeight.toFixed(2),
//       },
//       dispatched: {
//         weight: tankerWeight.toFixed(2),
//         fat: tankerFatPct.toFixed(2),
//         snf: tankerSnfPct.toFixed(2),
//       },
//       difference: {
//         weight: stage1WeightDiff.toFixed(2),
//         fat: stage1FatDiffPct.toFixed(2),
//         snf: stage1SnfDiffPct.toFixed(2),
//       },
//       receivedAtFactory: {
//         weight: factoryWeight.toFixed(2),
//         fat: factoryFatPct.toFixed(2),
//         snf: factorySnfPct.toFixed(2),
//       },
//       finalDifference: {
//         weight: stage2WeightDiff.toFixed(2),
//         fat: stage2FatDiffPct.toFixed(2),
//         snf: stage2SnfDiffPct.toFixed(2),
//       },
//       raw: data,
//       actions: (
//         <CButton
//           size="sm"
//           color="primary"
//           onClick={() =>
//             openDetailsModal({
//               SlNo: ind + 1,
//               ...data,
//             })
//           }
//         >
//           View
//         </CButton>
//       ),
//     };
//   };

//   const getTransitLossgainReports = () => {
//     if (vehicleNo && fromDate && toDate) {
//       GetTransitlossGainReports(
//         (res) => {
//           const apiData = res?.data || [];
//           const finaldata = apiData.map((data, ind) =>
//             buildRowFromApi(data, ind)
//           );
//           setReportData(finaldata);
//         },
//         fromDate,
//         toDate,
//         vehicleNo
//       );
//     }
//   };

//   useEffect(() => {
//     getRouteMasterData();
//     getVehicles();
//   }, []);

//   const getRouteMasterData = () => {
//     GetRouteMaster((res) => {
//       let { status, data, message } = res;
//       if (status === 200) {
//         setRouteMasterData(data);
//       } else if (status === 403) {
//         setAlertText("You don't have access to perform this operation");
//         setShowConfirmModal1(true);
//       } else if (status === 500) {
//         setAlertText("Something wrong happened in API");
//         setShowConfirmModal1(true);
//       } else if (message && message.includes("Invalid access token")) {
//         setAlertText("User Session has Expired");
//         setShowConfirmModal1(true);
//         setSessionOk(true);
//       }
//     });
//   };

//   const handleExportToExcel = () => {
//     let excelData = [];
//     if (ReportData.length > 0) {
//       excelData = ReportData.map((item) => ({
//         SlNo: item.SlNo,
//         vehicle: item.vehicle,
//         date: item.date,
//         capacity: item.capacity,
//         received_bmc: item.received.bmc,
//         received_fat: item.received.fat,
//         received_snf: item.received.snf,
//         received_weight: item.received.weight,
//         dispatched_weight: item.dispatched.weight,
//         dispatched_fat: item.dispatched.fat,
//         dispatched_snf: item.dispatched.snf,
//         difference_weight: item.difference.weight,
//         difference_fat: item.difference.fat,
//         difference_snf: item.difference.snf,
//         receivedAtFactory_weight: item.receivedAtFactory.weight,
//         receivedAtFactory_fat: item.receivedAtFactory.fat,
//         receivedAtFactory_snf: item.receivedAtFactory.snf,
//         finalDifference_weight: item.finalDifference.weight,
//         finalDifference_fat: item.finalDifference.fat,
//         finalDifference_snf: item.finalDifference.snf,
//       }));
//     }

//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, "Transit_loss_gain.xlsx");
//   };

//   const handleSubmit = () => {
//     getTransitLossgainReports();
//     setDisplayTable(true);
//     // optional: also refresh milkDispatch / weighbridge if needed
//     getMilkDispatch();
//     getWeighbridgeData();
//   };

//   const handleConfirm = () => {
//     setShowConfirmModal1(false);
//     if (sessionOk) {
//       localStorage.clear();
//       navigate("/");
//     }
//   };

//   const getVehicles = () => {
//     GetVehicles((res) => {
//       if (res.status === 200) {
//         setVehicleData(res.data);
//       }
//     });
//   };

//   const FilterItems = [
//     {
//       heading_1: (
//         <CFormSelect
//           size="sm"
//           name="routeId"
//           onChange={(e) => {
//             setRouteId(e.target.value);
//             setDisplayTable(false);
//           }}
//         >
//           <option>Select Route</option>
//           {routeMasterData &&
//             routeMasterData.map((option, index) => {
//               return (
//                 <option key={index} value={option.id}>
//                   {option.routeName}
//                 </option>
//               );
//             })}
//         </CFormSelect>
//       ),
//       heading_2: (
//         <CFormSelect
//           size="sm"
//           name="vehicleNo"
//           onChange={(e) => {
//             setVehicleNo(e.target.value);
//           }}
//         >
//           <option>Select Vehicle No.</option>
//           {vehicleData &&
//             vehicleData.map((option, index) => {
//               return (
//                 <option key={index} value={option.id}>
//                   {option.registrationNumber}
//                 </option>
//               );
//             })}
//         </CFormSelect>
//       ),
//       heading_3: (
//         <CFormInput
//           type="date"
//           name="fromDate"
//           size="sm"
//           onChange={(e) => {
//             setFromDate(e.target.value);
//           }}
//           placeholder="From Date"
//         />
//       ),
//       heading_4: (
//         <CFormInput
//           type="date"
//           name="toDate"
//           size="sm"
//           onChange={(e) => {
//             setToDate(e.target.value);
//           }}
//           placeholder="To Date"
//         />
//       ),
//     },
//   ];

//   // modal summary calculations with optional manual factory values
//   const computeModalSummary = () => {
//     if (!selectedRow) return null;
//     const d = selectedRow;

//     const collectedWeight = Number(d.ReceiptnetWeight || 0);
//     const collectedFatPct = Number(d.ReceiptFat || 0);
//     const collectedSnfPct = Number(d.ReceiptSnf || 0);

//     const tankerWeight = Number(d.TankerDispatchnetWeight || 0);
//     const tankerFatPct = Number(d.TankerDispatchfat || 0);
//     const tankerSnfPct = Number(d.TankerDispatchSnf || 0);

//     const factoryWeight = manualFactoryValues.weight
//       ? Number(manualFactoryValues.weight)
//       : Number(d.FactoryReceiptWeight || 0);
//     const factoryFatPct = manualFactoryValues.fat
//       ? Number(manualFactoryValues.fat)
//       : Number(d.FactoryReceiptfat || 0);
//     const factorySnfPct = manualFactoryValues.snf
//       ? Number(manualFactoryValues.snf)
//       : Number(d.FactoryReceiptSnf || 0);

//     const collectedFatKg = (collectedWeight * collectedFatPct) / 100;
//     const collectedSnfKg = (collectedWeight * collectedSnfPct) / 100;

//     const tankerFatKg = (tankerWeight * tankerFatPct) / 100;
//     const tankerSnfKg = (tankerWeight * tankerSnfPct) / 100;

//     const factoryFatKg = (factoryWeight * factoryFatPct) / 100;
//     const factorySnfKg = (factoryWeight * factorySnfPct) / 100;

//     const stage1WeightDiff = tankerWeight - collectedWeight;
//     const stage2WeightDiff = factoryWeight - tankerWeight;
//     const totalWeightDiff = factoryWeight - collectedWeight;

//     const stage1FatDiffKg = tankerFatKg - collectedFatKg;
//     const stage2FatDiffKg = factoryFatKg - tankerFatKg;
//     const totalFatDiffKg = factoryFatKg - collectedFatKg;

//     const stage1SnfDiffKg = tankerSnfKg - collectedSnfKg;
//     const stage2SnfDiffKg = factorySnfKg - tankerSnfKg;
//     const totalSnfDiffKg = factorySnfKg - collectedSnfKg;

//     return {
//       collectedWeight,
//       collectedFatPct,
//       collectedSnfPct,
//       tankerWeight,
//       tankerFatPct,
//       tankerSnfPct,
//       factoryWeight,
//       factoryFatPct,
//       factorySnfPct,
//       stage1WeightDiff,
//       stage2WeightDiff,
//       totalWeightDiff,
//       stage1FatDiffKg,
//       stage2FatDiffKg,
//       totalFatDiffKg,
//       stage1SnfDiffKg,
//       stage2SnfDiffKg,
//       totalSnfDiffKg,
//     };
//   };

//   const modalSummary = computeModalSummary();

//   if (!token) {
//     return <Navigate to={"/"} />;
//   }

//   return (
//     <div className="weighbridge">
//       <div className="weighbridge__container">
//         <div className="weighbridge__header">
//           <div className="weighbridge__header__section">
//             <div className="weighbridge__header__section__main">
//               <h5>Company: Verka</h5>
//               <h4>Tanker Milk Reconciliation Reports</h4>
//             </div>
//             <div className="weighbridge__header__section__bottom">
//               <Header />
//             </div>
//           </div>
//         </div>

//         <div className="weighbridge__table">
//           <div
//             className="weighbridge__table__body"
//             style={{ height: "20vh" }}
//           >
//             <CTable
//               columns={Filtercolumns}
//               items={FilterItems}
//               className="striped-table"
//             />
//             <CRow>
//               <CCol lg={2}>
//                 {displayTable && (
//                   <CButton
//                     style={{
//                       border: 0,
//                       backgroundColor: "#0e419d",
//                     }}
//                     onClick={handleExportToExcel}
//                   >
//                     Export to Excel
//                   </CButton>
//                 )}
//               </CCol>
//               <CCol lg={9}></CCol>
//               <CCol lg={1}>
//                 <CButton
//                   style={{
//                     border: 0,
//                     backgroundColor: "#0e419d",
//                   }}
//                   onClick={handleSubmit}
//                 >
//                   Submit
//                 </CButton>
//               </CCol>
//             </CRow>
//           </div>
//         </div>

//         {displayTable && (
//           <div className="weighbridge__table">
//             <div
//               className="weighbridge__table__body"
//               style={{ height: "70vh", overflowY: "scroll" }}
//             >
//               <TableComponent columns={columns} items={ReportData} />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* DETAILS MODAL */}
//       {selectedRow && (
//         <CModal
//           visible={detailsModalVisible}
//           onClose={closeDetailsModal}
//           size="xl"
//           scrollable
//         >
//           <CModalHeader closeButton>
//             <CModalTitle>
//               Transit Loss/Gain Details – Vehicle{" "}
//               {selectedRow.VehicleNo ||
//                 (selectedRow.vehicle && selectedRow.vehicle.RegistrationNo)}{" "}
//               ({selectedRow.ReportDate})
//             </CModalTitle>
//           </CModalHeader>
//           <CModalBody>
//             {modalSummary && (
//               <>
//                 <h6>Summary (BMC → Tanker → Factory)</h6>
//                 <CRow>
//                   <CCol lg={4}>
//                     <b>Collected (All BMCs)</b>
//                     <div>Weight: {modalSummary.collectedWeight} Kg</div>
//                     <div>Fat: {modalSummary.collectedFatPct}%</div>
//                     <div>SNF: {modalSummary.collectedSnfPct}%</div>
//                   </CCol>
//                   <CCol lg={4}>
//                     <b>Tanker Dispatch</b>
//                     <div>Weight: {modalSummary.tankerWeight} Kg</div>
//                     <div>Fat: {modalSummary.tankerFatPct}%</div>
//                     <div>SNF: {modalSummary.tankerSnfPct}%</div>
//                   </CCol>
//                   <CCol lg={4}>
//                     <b>Factory Receipt</b>
//                     <div>Weight: {modalSummary.factoryWeight} Kg</div>
//                     <div>Fat: {modalSummary.factoryFatPct}%</div>
//                     <div>SNF: {modalSummary.factorySnfPct}%</div>
//                   </CCol>
//                 </CRow>
//                 <hr />
//                 <CRow>
//                   <CCol lg={4}>
//                     <b>BMC → Tanker</b>
//                     <div>
//                       Weight Diff: {modalSummary.stage1WeightDiff.toFixed(2)} Kg
//                     </div>
//                     <div>
//                       Fat Diff: {modalSummary.stage1FatDiffKg.toFixed(2)} Kg
//                     </div>
//                     <div>
//                       SNF Diff: {modalSummary.stage1SnfDiffKg.toFixed(2)} Kg
//                     </div>
//                   </CCol>
//                   <CCol lg={4}>
//                     <b>Tanker → Factory</b>
//                     <div>
//                       Weight Diff: {modalSummary.stage2WeightDiff.toFixed(2)} Kg
//                     </div>
//                     <div>
//                       Fat Diff: {modalSummary.stage2FatDiffKg.toFixed(2)} Kg
//                     </div>
//                     <div>
//                       SNF Diff: {modalSummary.stage2SnfDiffKg.toFixed(2)} Kg
//                     </div>
//                   </CCol>
//                   <CCol lg={4}>
//                     <b>Overall (BMC → Factory)</b>
//                     <div>
//                       Weight Diff: {modalSummary.totalWeightDiff.toFixed(2)} Kg
//                     </div>
//                     <div>
//                       Fat Diff: {modalSummary.totalFatDiffKg.toFixed(2)} Kg
//                     </div>
//                     <div>
//                       SNF Diff: {modalSummary.totalSnfDiffKg.toFixed(2)} Kg
//                     </div>
//                   </CCol>
//                 </CRow>

//                 <hr />
//               </>
//             )}

//             {/* Manual override section */}
//             <h6>Manual Factory Values (What-if)</h6>
//             <CRow className="mb-3">
//               <CCol lg={4}>
//                 <CFormLabel>Factory Weight (Kg)</CFormLabel>
//                 <CFormInput
//                   type="number"
//                   value={manualFactoryValues.weight}
//                   onChange={(e) =>
//                     setManualFactoryValues((prev) => ({
//                       ...prev,
//                       weight: e.target.value,
//                     }))
//                   }
//                   placeholder="Leave blank to use system value"
//                 />
//               </CCol>
//               <CCol lg={4}>
//                 <CFormLabel>Factory Fat (%)</CFormLabel>
//                 <CFormInput
//                   type="number"
//                   value={manualFactoryValues.fat}
//                   onChange={(e) =>
//                     setManualFactoryValues((prev) => ({
//                       ...prev,
//                       fat: e.target.value,
//                     }))
//                   }
//                   placeholder="Leave blank to use system value"
//                 />
//               </CCol>
//               <CCol lg={4}>
//                 <CFormLabel>Factory SNF (%)</CFormLabel>
//                 <CFormInput
//                   type="number"
//                   value={manualFactoryValues.snf}
//                   onChange={(e) =>
//                     setManualFactoryValues((prev) => ({
//                       ...prev,
//                       snf: e.target.value,
//                     }))
//                   }
//                   placeholder="Leave blank to use system value"
//                 />
//               </CCol>
//             </CRow>

//             <hr />

//             {/* BMC summary table */}
//             <h6>BMC-wise Summary</h6>
//             <CTable
//               striped
//               small
//               columns={[
//                 { key: "SlNo", label: "Sl No" },
//                 { key: "BmcName", label: "BMC" },
//                 { key: "NetWeight", label: "Weight (Kg)" },
//                 { key: "Fat", label: "Fat (%)" },
//                 { key: "Snf", label: "SNF (%)" },
//                 { key: "Clr", label: "CLR" },
//               ]}
//               items={(selectedRow.BmcSummary || []).map((b, idx) => ({
//                 SlNo: idx + 1,
//                 BmcName: b.BmcName || b.BmcId || "-",
//                 NetWeight: b.NetWeight != null ? b.NetWeight.toFixed(2) : "0.00",
//                 Fat: b.Fat != null ? b.Fat.toFixed(2) : "0.00",
//                 Snf: b.Snf != null ? b.Snf.toFixed(2) : "0.00",
//                 Clr: b.Clr != null ? b.Clr.toFixed(2) : "0.00",
//               }))}
//             />

//             <hr />

//             {/* Dispatch list */}
//             <h6>Dispatches (timeline)</h6>
//             <CTable
//               striped
//               small
//               columns={[
//                 { key: "SlNo", label: "Sl No" },
//                 { key: "DispatchedAt", label: "Dispatched At" },
//                 { key: "Weight", label: "Weight (Kg)" },
//                 { key: "Fat", label: "Fat (%)" },
//                 { key: "Snf", label: "SNF (%)" },
//                 { key: "Clr", label: "CLR" },
//               ]}
//               items={(selectedRow.Dispatches || []).map((d, idx) => ({
//                 SlNo: idx + 1,
//                 DispatchedAt: d.DispatchedAt
//                   ? moment(d.DispatchedAt).format("YYYY-MM-DD HH:mm")
//                   : "-",
//                 Weight: d.Weight,
//                 Fat: d.EndFat,
//                 Snf: d.EndSnf,
//                 Clr: d.EndClr,
//               }))}
//             />

//             <hr />
// <CTable
//   striped
//   columns={[
//     { key: 'BmcId', label: 'BMC ID' },
//     { key: 'OpeningWeight', label: 'Opening (L)' },
//     { key: 'CollectedWeight', label: 'Collected (L)' },
//     { key: 'DispatchedWeight', label: 'Dispatched (L)' },
//     { key: 'ClosingWeight', label: 'Closing (L)' }
//   ]}
//   items={selectedRow.BmcStockSummary || []}
// />

//             {/* Factory sample info */}
//             <h6>Factory Sample Details</h6>
//             <div>
//               Sample Time:{" "}
//               {selectedRow.FactorySampleDateTime
//                 ? moment(selectedRow.FactorySampleDateTime).format(
//                     "YYYY-MM-DD HH:mm"
//                   )
//                 : "-"}
//             </div>
//             <div>Fat: {selectedRow.FactoryReceiptfat ?? "-"}%</div>
//             <div>SNF: {selectedRow.FactoryReceiptSnf ?? "-"}%</div>
//             <div>CLR: {selectedRow.FactoryReceiptClr ?? "-"} </div>
//           </CModalBody>
//           <CModalFooter>
//             <CButton color="secondary" onClick={closeDetailsModal}>
//               Close
//             </CButton>
//           </CModalFooter>
//         </CModal>
//       )}

//       {showConfirmModal1 && (
//         <Confirm
//           buttonText={"OK"}
//           isCancelRequired={false}
//           confirmTitle={alertText}
//           onConfirm={handleConfirm}
//           onCancel={() => {
//             setShowConfirmModal1(false);
//             setSessionOk(true);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default TransitLossGainReportS;
import {
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import {
  GetMilkDispatch,
  GetMilkDispatchWithVehicleNo,
  GetRouteMaster,
  GetTransitlossGainReports,
  GetTransitlossWeighbridgeData,
  GetTransitlossWeighbridgeDataWithVehicleNo,
  GetVehicles,
  GetMilkCollections,
  GetOrganization1,
} from "../../../utils/apiCalls";
import moment from "moment";
import * as XLSX from "xlsx";
import Confirm from "../../../components/confirmModal/confirm";
import TableComponent from "./tablecom";

// helper: safely extract YYYY-MM-DD from various date/datetime strings
function extractDatePart(value) {
  if (!value) return null;
  const str = String(value);
  if (str.length >= 10) {
    // "2025-11-29T07:07:00.000Z" or "2025-11-29 07:07:00"
    return str.slice(0, 10);
  }
  return str; // if API already sends "2025-11-29"
}

/**
 * MAIN TABLE COLUMNS
 * Header layout:
 * SL. No. | Vehicle No. | Date | Capacity |
 * Received -> (BMC/CC, Fat, SNF, Weight) |
 * Dispatched -> (Weight, Fat, SNF) |
 * Difference (BMC → Tanker) -> (Weight, Fat, SNF) |
 * Received at Factory -> (Weight, Fat, SNF) |
 * Final Difference (Tanker → Factory) -> (Weight, Fat, SNF) |
 * Actions -> View
 */
const columns = [
  {
    key: "SlNo",
    label: "SL. No.",
    _props: { scope: "col" },
  },
  {
    key: "vehicle",
    label: "Vehicle No.",
    _props: { scope: "col" },
  },
  {
    key: "date",
    label: "Date",
    _props: { scope: "col" },
  },
  {
    key: "capacity",
    label: "Capacity",
    _props: { scope: "col" },
  },
  {
    key: "received",
    label: "Received (BMC Collection)",
    _props: { scope: "col" },
    children: [
      {
        key: "bmc",
        label: "BMC/CC",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat %",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF %",
        _props: { scope: "col" },
      },
      {
        key: "weight",
        label: "Weight (Kg)",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "dispatched",
    label: "Dispatched (Tanker)",
    _props: { scope: "col" },
    children: [
      {
        key: "weight",
        label: "Weight (Kg)",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat %",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF %",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "difference",
    label: "Difference (BMC → Tanker)",
    _props: { scope: "col" },
    children: [
      {
        key: "weight",
        label: "Weight (Kg)",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat % Δ",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF % Δ",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "receivedAtFactory",
    label: "Received at Factory",
    _props: { scope: "col" },
    children: [
      {
        key: "weight",
        label: "Weight (Kg)",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat %",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF %",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "finalDifference",
    label: "Final Difference (Tanker → Factory)",
    _props: { scope: "col" },
    children: [
      {
        key: "weight",
        label: "Weight (Kg)",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat % Δ",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF % Δ",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "actions",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const Filtercolumns = [
  {
    key: "heading_2",
    label: "Vehicle No.",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "From Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "To Date",
    _props: { scope: "col" },
  },
];

const TransitLossGainReportS = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [dispatchedData, setdispatchedData] = useState([]);
  const [weighbridgeData, setWeighbridgeData] = useState([]);
  const [ReportData, setReportData] = useState([]);
  const [displayTable, setDisplayTable] = useState(false);
  const [routeId, setRouteId] = useState();
  const [vehicleNo, setVehicleNo] = useState();
  const [routeMasterData, setRouteMasterData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [alertText, setAlertText] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);

  // BMC list (Organization Units) – used to show names
  const [bmcOptions, setBmcOptions] = useState([]);

  // modal states
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [manualFactoryValues, setManualFactoryValues] = useState({
    weight: "",
    fat: "",
    snf: "",
  });

  const openDetailsModal = (row) => {
    // row is the full transit row from GetTransitlossGainReports
    setSelectedRow(row);
    setManualFactoryValues({ weight: "", fat: "", snf: "" });
    setDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedRow(null);
  };

  const getMilkDispatch = () => {
    if (vehicleNo) {
      GetMilkDispatchWithVehicleNo(
        (res) => {
          setdispatchedData(res.data || []);
        },
        vehicleNo,
        fromDate,
        toDate
      );
    } else {
      GetMilkDispatch(
        (res) => {
          setdispatchedData(res.data || []);
        },
        fromDate,
        toDate
      );
    }
  };

  const getWeighbridgeData = () => {
    if (vehicleNo) {
      GetTransitlossWeighbridgeDataWithVehicleNo(
        (res) => {
          setWeighbridgeData(res?.data || []);
        },
        vehicleNo,
        fromDate,
        toDate
      );
    } else {
      GetTransitlossWeighbridgeData(
        (res) => {
          setWeighbridgeData(res?.data || []);
        },
        fromDate,
        toDate
      );
    }
  };

  // ========= NEW CORE LOGIC: per-BMC rows using GetMilkCollections =========

  const getTransitLossgainReports = () => {
    if (vehicleNo && fromDate && toDate) {
      GetTransitlossGainReports(
        async (res) => {
          const apiData = res?.data || [];

          if (!apiData.length) {
            setReportData([]);
            return;
          }

          // helper: BMC id -> name (from GetOrganization1)
          const bmcNameById = {};
          bmcOptions.forEach((b) => {
            if (b.id != null) {
              bmcNameById[String(b.id)] = b.name || String(b.id);
            }
          });

          // 1) Collect unique BMC IDs from transit data
          const bmcIdSet = new Set();
          for (const item of apiData) {
            if (Array.isArray(item.BmcStockSummary)) {
              for (const b of item.BmcStockSummary) {
                const id =
                  b.OrganizationUnitId != null ? b.OrganizationUnitId : b.BmcId;
                if (id != null) bmcIdSet.add(id);
              }
            }
            if (Array.isArray(item.Dispatches)) {
              for (const d of item.Dispatches) {
                if (d.BmcId != null) bmcIdSet.add(d.BmcId);
              }
            }
          }

          const bmcIdArray = Array.from(bmcIdSet);
          if (!bmcIdArray.length) {
            setReportData([]);
            return;
          }

          // 2) For each BMC, call GetMilkCollections(bmcId, fromDate, toDate)
          const milkPromises = bmcIdArray.map(
            (id) =>
              new Promise((resolve) => {
                GetMilkCollections(
                  (milkRes) => resolve({ bmcId: id, res: milkRes }),
                  id,
                  fromDate,
                  toDate
                );
              })
          );

          const allMilk = await Promise.all(milkPromises);

          // 3) Build collected map: per BMC + per date (+ shift) how much was collected
          // structure: { [bmcId]: { [date]: { totalCollected, shifts: { [shift]: kg } } } }
          const collectedByBmcAndDate = {};

          for (const { bmcId, res: milkRes } of allMilk) {
            if (
              !milkRes ||
              milkRes.status !== 200 ||
              !Array.isArray(milkRes.data)
            )
              continue;

            const bKey = String(bmcId);
            if (!collectedByBmcAndDate[bKey]) {
              collectedByBmcAndDate[bKey] = {};
            }

            for (const item of milkRes.data) {
              const dt =
                item.collectionDateTime ||
                item.collection_date_time ||
                item.collectionDate ||
                item.CollectionDateTime ||
                item.CollectionDate;

              const dateKey = extractDatePart(dt);
              if (!dateKey) continue;

              const weight =
                item.totalWeight != null
                  ? Number(item.totalWeight)
                  : item.total_weight != null
                  ? Number(item.total_weight)
                  : item.weight != null
                  ? Number(item.weight)
                  : item.Weight != null
                  ? Number(item.Weight)
                  : 0;

              if (!Number.isFinite(weight) || weight === 0) continue;

              const shiftRaw =
                item.shift ||
                item.Shift ||
                item.collectionShift ||
                item.CollectionShift ||
                "";
              const shiftKey = shiftRaw ? String(shiftRaw).toUpperCase() : "NA";

              if (!collectedByBmcAndDate[bKey][dateKey]) {
                collectedByBmcAndDate[bKey][dateKey] = {
                  totalCollected: 0,
                  shifts: {},
                };
              }

              const bucket = collectedByBmcAndDate[bKey][dateKey];
              bucket.totalCollected += weight;
              bucket.shifts[shiftKey] =
                (bucket.shifts[shiftKey] || 0) + weight;
            }
          }

          // 4) Build final per-day, per-BMC rows using transit + collected maps
          const bmcRows = [];

          for (const tItem of apiData) {
            const reportDateKey = extractDatePart(tItem.ReportDate);
            if (!reportDateKey) continue;

            const tankerWeightTotal = Number(
              tItem.TankerDispatchnetWeight || 0
            );
            const tankerFatPct = Number(tItem.TankerDispatchfat || 0);
            const tankerSnfPct = Number(tItem.TankerDispatchSnf || 0);

            const factoryWeightTotal = Number(
              tItem.FactoryReceiptWeight || 0
            );
            const factoryFatPct = Number(tItem.FactoryReceiptfat || 0);
            const factorySnfPct = Number(tItem.FactoryReceiptSnf || 0);

            const bmcStockSummary = Array.isArray(tItem.BmcStockSummary)
              ? tItem.BmcStockSummary
              : [];
            const bmcSummaryArr = Array.isArray(tItem.BmcSummary)
              ? tItem.BmcSummary
              : [];

            // total dispatched for this day across BMCs – used to distribute factory weight
            let totalDispatchedForDate = 0;
            for (const b of bmcStockSummary) {
              totalDispatchedForDate += Number(b.DispatchedWeight || 0);
            }
            if (!totalDispatchedForDate && tankerWeightTotal) {
              totalDispatchedForDate = tankerWeightTotal;
            }

            for (const b of bmcStockSummary) {
              const rawBmcId =
                b.OrganizationUnitId != null ? b.OrganizationUnitId : b.BmcId;
              if (rawBmcId == null) continue;

              const bKey = String(rawBmcId);

              const opening = Number(b.OpeningWeight ?? 0);
              const dispatched = Number(b.DispatchedWeight ?? 0);

              const collectedBucket =
                collectedByBmcAndDate[bKey] &&
                collectedByBmcAndDate[bKey][reportDateKey];
              const collected = collectedBucket
                ? collectedBucket.totalCollected
                : Number(b.CollectedWeight ?? 0);

              const closing = opening + collected - dispatched;

              const shiftsArray =
                collectedBucket && collectedBucket.shifts
                  ? Object.entries(collectedBucket.shifts).map(
                      ([shift, wt]) => ({
                        shift,
                        collectedKg: Number(wt.toFixed(2)),
                      })
                    )
                  : [];

              // find BMC quality summary for this trip
              const bmcQual = bmcSummaryArr.find((s) => {
                const sId =
                  s.BmcId != null
                    ? s.BmcId
                    : s.OrganizationUnitId != null
                    ? s.OrganizationUnitId
                    : null;
                return sId != null && String(sId) === bKey;
              });

              const receivedWeight =
                bmcQual && bmcQual.NetWeight != null
                  ? Number(bmcQual.NetWeight)
                  : collected;

              const receivedFatPct =
                bmcQual && bmcQual.Fat != null
                  ? Number(bmcQual.Fat)
                  : tankerFatPct;
              const receivedSnfPct =
                bmcQual && bmcQual.Snf != null
                  ? Number(bmcQual.Snf)
                  : tankerSnfPct;

              // Stage 1 (BMC → Tanker) deltas (per BMC)
              const stage1WeightDiff = dispatched - receivedWeight;
              const stage1FatDeltaPct = tankerFatPct - receivedFatPct;
              const stage1SnfDeltaPct = tankerSnfPct - receivedSnfPct;

              // Distribute factory weight for this BMC by share of dispatched
              let factoryWeightBmc = 0;
              if (
                factoryWeightTotal > 0 &&
                totalDispatchedForDate > 0 &&
                dispatched > 0
              ) {
                const share = dispatched / totalDispatchedForDate;
                factoryWeightBmc = share * factoryWeightTotal;
              } else {
                factoryWeightBmc = 0;
              }

              const stage2WeightDiff = factoryWeightBmc - dispatched;
              const stage2FatDeltaPct = factoryFatPct - tankerFatPct;
              const stage2SnfDeltaPct = factorySnfPct - tankerSnfPct;

              const vehicleLabel =
                tItem.VehicleNo ||
                tItem.vehicle?.RegistrationNo ||
                tItem.vehicle?.VehicleNo ||
                "";

              const bmcName =
                bmcNameById[bKey] ||
                (bmcQual && bmcQual.BmcName) ||
                `BMC ${bKey}`;

              bmcRows.push({
                vehicle: vehicleLabel,
                date: reportDateKey,
                capacity: tItem.vehicle?.Capacity,
                bmcId: bKey,
                bmcName,

                openingKg: Number(opening.toFixed(2)),
                collectedKg: Number(collected.toFixed(2)),
                dispatchedKg: Number(dispatched.toFixed(2)),
                closingKg: Number(closing.toFixed(2)),

                // BMC side (Received)
                recvWeight: Number(receivedWeight.toFixed(2)),
                recvFat: Number(receivedFatPct.toFixed(2)),
                recvSnf: Number(receivedSnfPct.toFixed(2)),

                // Tanker (per BMC: weight share, but common fat/snf)
                tankerWeight: Number(dispatched.toFixed(2)),
                tankerFat: Number(tankerFatPct.toFixed(2)),
                tankerSnf: Number(tankerSnfPct.toFixed(2)),

                // Difference BMC → Tanker
                diff1Weight: Number(stage1WeightDiff.toFixed(2)),
                diff1Fat: Number(stage1FatDeltaPct.toFixed(2)),
                diff1Snf: Number(stage1SnfDeltaPct.toFixed(2)),

                // Factory side (per BMC weight, common fat/snf)
                factoryWeightBmc: Number(factoryWeightBmc.toFixed(2)),
                factoryFat: Number(factoryFatPct.toFixed(2)),
                factorySnf: Number(factorySnfPct.toFixed(2)),

                // Difference Tanker → Factory
                diff2Weight: Number(stage2WeightDiff.toFixed(2)),
                diff2Fat: Number(stage2FatDeltaPct.toFixed(2)),
                diff2Snf: Number(stage2SnfDeltaPct.toFixed(2)),

                shifts: shiftsArray,
                rawTransit: tItem,
                rawBmcStock: b,
                rawBmcSummary: bmcQual,
              });
            }
          }

          // sort rows by date, vehicle, then BMC
          bmcRows.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            if (a.vehicle < b.vehicle) return -1;
            if (a.vehicle > b.vehicle) return 1;
            if (a.bmcId < b.bmcId) return -1;
            if (a.bmcId > b.bmcId) return 1;
            return 0;
          });

          // convert to table items matching `columns` shape
          const tableItems = bmcRows.map((row, idx) => ({
            SlNo: idx + 1,
            vehicle: row.vehicle,
            date: row.date,
            capacity: row.capacity,
            received: {
              bmc: `${row.bmcName} (${row.bmcId})`,
              fat: row.recvFat.toFixed(2),
              snf: row.recvSnf.toFixed(2),
              weight: row.recvWeight.toFixed(2),
            },
            dispatched: {
              weight: row.tankerWeight.toFixed(2),
              fat: row.tankerFat.toFixed(2),
              snf: row.tankerSnf.toFixed(2),
            },
            difference: {
              weight: row.diff1Weight.toFixed(2),
              fat: row.diff1Fat.toFixed(2),
              snf: row.diff1Snf.toFixed(2),
            },
            receivedAtFactory: {
              weight: row.factoryWeightBmc.toFixed(2),
              fat: row.factoryFat.toFixed(2),
              snf: row.factorySnf.toFixed(2),
            },
            finalDifference: {
              weight: row.diff2Weight.toFixed(2),
              fat: row.diff2Fat.toFixed(2),
              snf: row.diff2Snf.toFixed(2),
            },
            // keep extra info for Excel / future use if needed
            _meta: row,
            actions: (
              <CButton
                size="sm"
                color="primary"
                onClick={() => openDetailsModal(row.rawTransit)}
              >
                View
              </CButton>
            ),
          }));

          setReportData(tableItems);
        },
        fromDate,
        toDate,
        vehicleNo
      );
    }
  };

  // =======================================================================

  useEffect(() => {
    getRouteMasterData();
    getVehicles();

    // Load BMCs (Organization Units) – same style as tester: GetOrganization1(..., 4)
    GetOrganization1((res) => {
      if (res.status === 200 && Array.isArray(res.data)) {
        setBmcOptions(res.data);
      }
    }, 4);
  }, []);

  const getRouteMasterData = () => {
    GetRouteMaster((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setRouteMasterData(data);
      } else if (status === 403) {
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
      } else if (status === 500) {
        setAlertText("Something wrong happened in API");
        setShowConfirmModal1(true);
      } else if (message && message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModal1(true);
        setSessionOk(true);
      }
    });
  };

  const handleExportToExcel = () => {
    let excelData = [];
    if (ReportData.length > 0) {
      excelData = ReportData.map((item) => ({
        SlNo: item.SlNo,
        vehicle: item.vehicle,
        date: item.date,
        capacity: item.capacity,
        received_bmc: item.received.bmc,
        received_fat: item.received.fat,
        received_snf: item.received.snf,
        received_weight: item.received.weight,
        dispatched_weight: item.dispatched.weight,
        dispatched_fat: item.dispatched.fat,
        dispatched_snf: item.dispatched.snf,
        difference_weight: item.difference.weight,
        difference_fat: item.difference.fat,
        difference_snf: item.difference.snf,
        receivedAtFactory_weight: item.receivedAtFactory.weight,
        receivedAtFactory_fat: item.receivedAtFactory.fat,
        receivedAtFactory_snf: item.receivedAtFactory.snf,
        finalDifference_weight: item.finalDifference.weight,
        finalDifference_fat: item.finalDifference.fat,
        finalDifference_snf: item.finalDifference.snf,
      }));
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Transit_loss_gain.xlsx");
  };

  const handleSubmit = () => {
    getTransitLossgainReports();
    setDisplayTable(true);
    // optional: also refresh milkDispatch / weighbridge if needed
    getMilkDispatch();
    getWeighbridgeData();
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const getVehicles = () => {
    GetVehicles((res) => {
      if (res.status === 200) {
        setVehicleData(res.data || []);
      }
    });
  };

  const FilterItems = [
    {
      heading_1: (
        <CFormSelect
          size="sm"
          name="routeId"
          onChange={(e) => {
            setRouteId(e.target.value);
            setDisplayTable(false);
          }}
        >
          <option>Select Route</option>
          {routeMasterData &&
            routeMasterData.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.routeName}
                </option>
              );
            })}
        </CFormSelect>
      ),
      heading_2: (
        <CFormSelect
          size="sm"
          name="vehicleNo"
          onChange={(e) => {
            setVehicleNo(e.target.value);
          }}
        >
          <option>Select Vehicle No.</option>
          {vehicleData &&
            vehicleData.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.registrationNumber}
                </option>
              );
            })}
        </CFormSelect>
      ),
      heading_3: (
        <CFormInput
          type="date"
          name="fromDate"
          size="sm"
          onChange={(e) => {
            setFromDate(e.target.value);
          }}
          placeholder="From Date"
        />
      ),
      heading_4: (
        <CFormInput
          type="date"
          name="toDate"
          size="sm"
          onChange={(e) => {
            setToDate(e.target.value);
          }}
          placeholder="To Date"
        />
      ),
    },
  ];

  // modal summary calculations (still tanker-level, all BMCs combined)
  const computeModalSummary = () => {
    if (!selectedRow) return null;
    const d = selectedRow;

    const collectedWeight = Number(d.ReceiptnetWeight || 0);
    const collectedFatPct = Number(d.ReceiptFat || 0);
    const collectedSnfPct = Number(d.ReceiptSnf || 0);

    const tankerWeight = Number(d.TankerDispatchnetWeight || 0);
    const tankerFatPct = Number(d.TankerDispatchfat || 0);
    const tankerSnfPct = Number(d.TankerDispatchSnf || 0);

    const factoryWeight = manualFactoryValues.weight
      ? Number(manualFactoryValues.weight)
      : Number(d.FactoryReceiptWeight || 0);
    const factoryFatPct = manualFactoryValues.fat
      ? Number(manualFactoryValues.fat)
      : Number(d.FactoryReceiptfat || 0);
    const factorySnfPct = manualFactoryValues.snf
      ? Number(manualFactoryValues.snf)
      : Number(d.FactoryReceiptSnf || 0);

    const collectedFatKg = (collectedWeight * collectedFatPct) / 100;
    const collectedSnfKg = (collectedWeight * collectedSnfPct) / 100;

    const tankerFatKg = (tankerWeight * tankerFatPct) / 100;
    const tankerSnfKg = (tankerWeight * tankerSnfPct) / 100;

    const factoryFatKg = (factoryWeight * factoryFatPct) / 100;
    const factorySnfKg = (factoryWeight * factorySnfPct) / 100;

    const stage1WeightDiff = tankerWeight - collectedWeight;
    const stage2WeightDiff = factoryWeight - tankerWeight;
    const totalWeightDiff = factoryWeight - collectedWeight;

    const stage1FatDiffKg = tankerFatKg - collectedFatKg;
    const stage2FatDiffKg = factoryFatKg - tankerFatKg;
    const totalFatDiffKg = factoryFatKg - collectedFatKg;

    const stage1SnfDiffKg = tankerSnfKg - collectedSnfKg;
    const stage2SnfDiffKg = factorySnfKg - tankerSnfKg;
    const totalSnfDiffKg = factorySnfKg - collectedSnfKg;

    return {
      collectedWeight,
      collectedFatPct,
      collectedSnfPct,
      tankerWeight,
      tankerFatPct,
      tankerSnfPct,
      factoryWeight,
      factoryFatPct,
      factorySnfPct,
      stage1WeightDiff,
      stage2WeightDiff,
      totalWeightDiff,
      stage1FatDiffKg,
      stage2FatDiffKg,
      totalFatDiffKg,
      stage1SnfDiffKg,
      stage2SnfDiffKg,
      totalSnfDiffKg,
    };
  };

  const modalSummary = computeModalSummary();

  if (!token) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="weighbridge">
      <div className="weighbridge__container">
        <div className="weighbridge__header">
          <div className="weighbridge__header__section">
            <div className="weighbridge__header__section__main">
              <h5>Company: Verka</h5>
              <h4>Tanker Milk Reconciliation Reports</h4>
            </div>
            <div className="weighbridge__header__section__bottom">
              <Header />
            </div>
          </div>
        </div>

        <div className="weighbridge__table">
          <div
            className="weighbridge__table__body"
            style={{ height: "20vh" }}
          >
            <CTable
              columns={Filtercolumns}
              items={FilterItems}
              className="striped-table"
            />
            <CRow>
              <CCol lg={2}>
                {displayTable && (
                  <CButton
                    style={{
                      border: 0,
                      backgroundColor: "#0e419d",
                    }}
                    onClick={handleExportToExcel}
                  >
                    Export to Excel
                  </CButton>
                )}
              </CCol>
              <CCol lg={9}></CCol>
              <CCol lg={1}>
                <CButton
                  style={{
                    border: 0,
                    backgroundColor: "#0e419d",
                  }}
                  onClick={handleSubmit}
                >
                  Submit
                </CButton>
              </CCol>
            </CRow>
          </div>
        </div>

        {displayTable && (
          <div className="weighbridge__table">
            <div
              className="weighbridge__table__body"
              style={{ height: "70vh", overflowY: "scroll" }}
            >
              <TableComponent columns={columns} items={ReportData} />
            </div>
          </div>
        )}
      </div>

      {/* DETAILS MODAL – tanker-level + all BMC stock & quality */}
      {selectedRow && (
        <CModal
          visible={detailsModalVisible}
          onClose={closeDetailsModal}
          size="xl"
          scrollable
        >
          <CModalHeader closeButton>
            <CModalTitle>
              Transit Loss/Gain Details – Vehicle{" "}
              {selectedRow.VehicleNo ||
                (selectedRow.vehicle &&
                  selectedRow.vehicle.RegistrationNo)}{" "}
              ({selectedRow.ReportDate})
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {modalSummary && (
              <>
                <h6>Summary (All BMCs → Tanker → Factory)</h6>
                <CRow>
                  <CCol lg={4}>
                    <b>Collected (All BMCs)</b>
                    <div>Weight: {modalSummary.collectedWeight} Kg</div>
                    <div>Fat: {modalSummary.collectedFatPct}%</div>
                    <div>SNF: {modalSummary.collectedSnfPct}%</div>
                  </CCol>
                  <CCol lg={4}>
                    <b>Tanker Dispatch</b>
                    <div>Weight: {modalSummary.tankerWeight} Kg</div>
                    <div>Fat: {modalSummary.tankerFatPct}%</div>
                    <div>SNF: {modalSummary.tankerSnfPct}%</div>
                  </CCol>
                  <CCol lg={4}>
                    <b>Factory Receipt</b>
                    <div>Weight: {modalSummary.factoryWeight} Kg</div>
                    <div>Fat: {modalSummary.factoryFatPct}%</div>
                    <div>SNF: {modalSummary.factorySnfPct}%</div>
                  </CCol>
                </CRow>
                <hr />
                <CRow>
                  <CCol lg={4}>
                    <b>BMC → Tanker</b>
                    <div>
                      Weight Diff: {modalSummary.stage1WeightDiff.toFixed(2)} Kg
                    </div>
                    <div>
                      Fat Diff: {modalSummary.stage1FatDiffKg.toFixed(2)} Kg
                    </div>
                    <div>
                      SNF Diff: {modalSummary.stage1SnfDiffKg.toFixed(2)} Kg
                    </div>
                  </CCol>
                  <CCol lg={4}>
                    <b>Tanker → Factory</b>
                    <div>
                      Weight Diff: {modalSummary.stage2WeightDiff.toFixed(2)} Kg
                    </div>
                    <div>
                      Fat Diff: {modalSummary.stage2FatDiffKg.toFixed(2)} Kg
                    </div>
                    <div>
                      SNF Diff: {modalSummary.stage2SnfDiffKg.toFixed(2)} Kg
                    </div>
                  </CCol>
                  <CCol lg={4}>
                    <b>Overall (BMC → Factory)</b>
                    <div>
                      Weight Diff: {modalSummary.totalWeightDiff.toFixed(2)} Kg
                    </div>
                    <div>
                      Fat Diff: {modalSummary.totalFatDiffKg.toFixed(2)} Kg
                    </div>
                    <div>
                      SNF Diff: {modalSummary.totalSnfDiffKg.toFixed(2)} Kg
                    </div>
                  </CCol>
                </CRow>

                <hr />
              </>
            )}

            {/* Manual override section */}
            <h6>Manual Factory Values (What-if)</h6>
            <CRow className="mb-3">
              <CCol lg={4}>
                <CFormLabel>Factory Weight (Kg)</CFormLabel>
                <CFormInput
                  type="number"
                  value={manualFactoryValues.weight}
                  onChange={(e) =>
                    setManualFactoryValues((prev) => ({
                      ...prev,
                      weight: e.target.value,
                    }))
                  }
                  placeholder="Leave blank to use system value"
                />
              </CCol>
              <CCol lg={4}>
                <CFormLabel>Factory Fat (%)</CFormLabel>
                <CFormInput
                  type="number"
                  value={manualFactoryValues.fat}
                  onChange={(e) =>
                    setManualFactoryValues((prev) => ({
                      ...prev,
                      fat: e.target.value,
                    }))
                  }
                  placeholder="Leave blank to use system value"
                />
              </CCol>
              <CCol lg={4}>
                <CFormLabel>Factory SNF (%)</CFormLabel>
                <CFormInput
                  type="number"
                  value={manualFactoryValues.snf}
                  onChange={(e) =>
                    setManualFactoryValues((prev) => ({
                      ...prev,
                      snf: e.target.value,
                    }))
                  }
                  placeholder="Leave blank to use system value"
                />
              </CCol>
            </CRow>

            <hr />

            {/* BMC summary table */}
            <h6>BMC-wise Summary (Quality for This Trip)</h6>
            <CTable
              striped
              small
              columns={[
                { key: "SlNo", label: "Sl No" },
                { key: "BmcName", label: "BMC" },
                { key: "NetWeight", label: "Weight (Kg)" },
                { key: "Fat", label: "Fat (%)" },
                { key: "Snf", label: "SNF (%)" },
                { key: "Clr", label: "CLR" },
              ]}
              items={(selectedRow.BmcSummary || []).map((b, idx) => ({
                SlNo: idx + 1,
                BmcName: b.BmcName || b.BmcId || "-",
                NetWeight:
                  b.NetWeight != null ? b.NetWeight.toFixed(2) : "0.00",
                Fat: b.Fat != null ? b.Fat.toFixed(2) : "0.00",
                Snf: b.Snf != null ? b.Snf.toFixed(2) : "0.00",
                Clr: b.Clr != null ? b.Clr.toFixed(2) : "0.00",
              }))}
            />

            <hr />

            {/* BMC stock summary */}
            <h6>BMC Stock Summary (Opening → Closing)</h6>
            <CTable
              striped
              columns={[
                { key: "BmcId", label: "BMC ID" },
                { key: "OpeningWeight", label: "Opening (Kg)" },
                { key: "CollectedWeight", label: "Collected (Kg)" },
                { key: "DispatchedWeight", label: "Dispatched (Kg)" },
                { key: "ClosingWeight", label: "Closing (Kg)" },
              ]}
              items={selectedRow.BmcStockSummary || []}
            />

            <hr />

            {/* Dispatch list */}
            <h6>Dispatches (timeline)</h6>
            <CTable
              striped
              small
              columns={[
                { key: "SlNo", label: "Sl No" },
                { key: "DispatchedAt", label: "Dispatched At" },
                { key: "Weight", label: "Weight (Kg)" },
                { key: "Fat", label: "Fat (%)" },
                { key: "Snf", label: "SNF (%)" },
                { key: "Clr", label: "CLR" },
              ]}
              items={(selectedRow.Dispatches || []).map((d, idx) => ({
                SlNo: idx + 1,
                DispatchedAt: d.DispatchedAt
                  ? moment(d.DispatchedAt).format("YYYY-MM-DD HH:mm")
                  : "-",
                Weight: d.Weight,
                Fat: d.EndFat,
                Snf: d.EndSnf,
                Clr: d.EndClr,
              }))}
            />

            <hr />

            {/* Factory sample info */}
            <h6>Factory Sample Details</h6>
            <div>
              Sample Time:{" "}
              {selectedRow.FactorySampleDateTime
                ? moment(selectedRow.FactorySampleDateTime).format(
                    "YYYY-MM-DD HH:mm"
                  )
                : "-"}
            </div>
            <div>Fat: {selectedRow.FactoryReceiptfat ?? "-"}%</div>
            <div>SNF: {selectedRow.FactoryReceiptSnf ?? "-"}%</div>
            <div>CLR: {selectedRow.FactoryReceiptClr ?? "-"} </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={closeDetailsModal}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {showConfirmModal1 && (
        <Confirm
          buttonText={"OK"}
          isCancelRequired={false}
          confirmTitle={alertText}
          onConfirm={handleConfirm}
          onCancel={() => {
            setShowConfirmModal1(false);
            setSessionOk(true);
          }}
        />
      )}
    </div>
  );
};

export default TransitLossGainReportS;
