import React, { useEffect, useState, useRef } from 'react'
import { CreateMilkCollectionDetails, DeleteMilkCollectionDetails, GetMilkCollectionDetails, GetMilkCollectionRoutes, GetRateMaster, GetRouteStops, UpdateMilkCollectionDetails } from '../../utils/apiCalls'
import { useNavigate } from "react-router-dom";
import { IconButton, Paper, Select } from "@mui/material";
import "./MilkCollection.scss";
import {
   CTable,
   CPagination,
   CPaginationItem,
   CForm,
   CRow,
   CCol,
   CFormLabel,
   CFormSelect,
   CFormInput,
   CButton,
} from "@coreui/react";
import images from "../../../assets/images/log_out.png";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import Header from '../../components/header/Header';
import Confirm from "../../components/confirmModal/confirm";
import Loader from "../../components/loader";
import * as XLSX from "xlsx";
import download from "../../../assets/images/icons/download.png";
import moment from 'moment';
import { v4 as uuidv4 } from "uuid";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const columns = [
   {
      key: "SlNo",
      label: "#",
      _props: { scope: "col" },
   },
   {
      key: "heading_1",
      label: "Collection Date",
      _props: { scope: "col" },
   },
   {
      key: "heading_2",
      label: "Sample Number",
      _props: { scope: "col" },
   },
   {
      key: "agentCode",
      label: "Agent Code",
      _props: { scope: "col" },
   },
   {
      key: "heading_3",
      label: "Agent Name",
      _props: { scope: "col" },
   },
   {
      key: "milkType",
      label: "Milk Type",
      _props: { scope: "col" },
   },
   {
      key: "heading_4",
      label: "Fat",
      _props: { scope: "col" },
   },
   {
      key: "heading_5",
      label: "SNF",
      _props: { scope: "col" },
   },
   {
      key: "heading_6",
      label: "CLR",
      _props: { scope: "col" },
   },
   {
      key: "heading_7",
      label: "Protein",
      _props: { scope: "col" },
   },
   {
      key: "heading_8",
      label: "Lactose",
      _props: { scope: "col" },
   },
   {
      key: "heading_9",
      label: "Salt",
      _props: { scope: "col" },
   },
   {
      key: "heading_10",
      label: "Water",
      _props: { scope: "col" },
   },
   {
      key: "heading_11",
      label: "Temperature",
      _props: { scope: "col" },
   },

   {
      key: "heading_12",
      label: "Weight",
      _props: { scope: "col" },
   },
   {
      key: "heading_13",
      label: "Can Count",
      _props: { scope: "col" },
   },
   {
      key: "heading_14",
      label: "Test Type",
      _props: { scope: "col" },
   },
   {
      key: "heading_15",
      label: "Collection Type",
      _props: { scope: "col" },
   },
   {
      key: "Actions",
      label: "Actions",
      _props: { scope: "col" },
   },
];

const initialState = {
   id: '',
   routeId: null,
   weight: null,
   canCount: null,
   fat: null,
   snf: null,
   clr: null,
   organizationUnitId: null,
   transporterVehicleId: null,
   sampleNumber: null,
};

const MilkCollectionDetails = () => {

   const userAuthData = JSON.parse(localStorage.getItem("userData"));
   const selectedMilkCollectionId = localStorage.getItem("selectedMilkCollectionId");
   const [milkCollectionDetails, setMilkCollectionDetails] = useState([]);
   const [rateChartTableData, setRateChartTableData] = useState([]);
   const excelitem = [];
   const tableRef = useRef(null);
   const [isLoading, setIsLoading] = useState(true);
   const [sessionOk, setSessionOk] = useState(false);
   const [alertText, setAlertText] = useState("");
   const navigate = useNavigate();
   const [isCreateCollection, setIsCreateCollection] = useState(false);
   const [isId, setIsId] = useState(null);
   const [milkCollectionData, setMilkCollectionData] = useState(initialState);
   const [milkCollectionRoutes, setMilkCollectionRoutes] = useState([]);
   const [routeStops, setRouteStops] = useState([]);
   const [selectedRouteId, setSelectedRouteId] = useState(null);
   const timeoutRef = useRef();
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [showConfirmModal1, setShowConfirmModal1] = useState();
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredData, setFilteredData] = useState([]);
   const [isMilkBillLocked, setIsMilkBillLocked] = useState();

   const uuid = uuidv4();

   const handleCreateCollection = () => {
      setIsCreateCollection(!isCreateCollection);
      // setIsId("");
   };

   const handleCancelCollection = () => {
      setIsCreateCollection(!isCreateCollection);
      setSelectedRouteId(0);
      clearData();
      setIsId(null);
   };

   useEffect(() => {
      const isLocked = localStorage.getItem("isMilkBillLocked");
      if (isLocked == 'true') {
         setIsMilkBillLocked(true)
      } else { setIsMilkBillLocked(false) }
   }, []);

   useEffect(() => {
      getMilkCollectionDetails();
   }, [selectedMilkCollectionId])
   const getMilkCollectionDetails = () => {
      setIsLoading(true);
      GetMilkCollectionDetails((res) => {
         let { status, data, message } = res;
         if (status === 200) {
            setMilkCollectionDetails(data);
            setIsLoading(false); // Hide the loading spinner
         } else if (status === 403) {
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModal1(true);
            setIsLoading(false);
         } else if (status === 500) {
            setAlertText("Something wrong happened in API");
            setShowConfirmModal1(true);
            setIsLoading(false);
         } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
         }
      }, selectedMilkCollectionId)
      // console.log("milk collection details", milkCollectionDetails)
   }

   useEffect(() => {
      getRateChartData();
      getMilkCollectionRoutes();
      // console.log("milk collection data: ", milkCollectionData)
   }, []);

   const getMilkCollectionRoutes = () => {
      GetMilkCollectionRoutes((res) => {
         setMilkCollectionRoutes(res.data)
      })
   }
   const getRateChartData = () => {
      GetRateMaster((res) => {
         const { status, data } = res;
         if (status === 200) {
            setRateChartTableData(data);
         }
      });
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setMilkCollectionData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
      // setOrganizationDataErr((prev) => ({
      //     ...prev,
      //     [name]: "",
      // }));
   };

   useEffect(() => {
      getRouteStops()
   }, [selectedRouteId, milkCollectionData.routeId])
   const getRouteStops = () => {
      GetRouteStops((res) => {
         setRouteStops(res.data);
      }, selectedRouteId || milkCollectionData.routeId)
   }
   let cowFat, cowSnf, buffaloRate, buffaloSnf = 0;

   if (rateChartTableData.length > 0) {
      const chartData = rateChartTableData[0];
      cowFat = chartData.cowFatRate || 0;
      cowSnf = chartData.cowSnfRate || 0;
      buffaloRate = chartData.buffFatRate || 0;
      buffaloSnf = chartData.buffSnfRate || 0;
   }
   const collectionData = localStorage.getItem("collectionData");
   // const collectionDate = moment(milkCollectionDetails[0]?.collectedAt).format("YYYY-MM-DD")
   const orgDetails = localStorage.getItem("orgDetails")
   const items = []

   const handleMilkCollection = () => {
      navigate("/milk-collections");
   }
   const shift = localStorage.getItem("shift")
   const collectionDate = moment(localStorage.getItem("collectionDate")).format('YYYY-MM-DD');
   // console.log('shift : ', collectionDate)
   const handleExportToExcel = () => {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelitem);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, `${collectionDate}-${shift}-collection.xlsx`);
   };

   const handleDropDown = (name, value) => {
      setMilkCollectionData((prev) => ({ ...prev, [name]: value }));
   };

   const clearData = () => {
      setMilkCollectionData(initialState);
   };

   const handleSubmit = () => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
         const payload = {
            milkCollectionId: selectedMilkCollectionId,
            routeId: milkCollectionData.routeId,
            organizationUnitId: Number(milkCollectionData.organizationUnitId),
            transporterVehicleId: milkCollectionData.transporterVehicleId,
            weight: Number(milkCollectionData.weight),
            canCount: Number(milkCollectionData.canCount),
            sampleNumber: Number(milkCollectionData.sampleNumber),
            fat: Number(milkCollectionData.fat),
            clr: Number(milkCollectionData.clr),
            snf: parseFloat((milkCollectionData.clr / 4 + 0.20 * milkCollectionData.fat + 0.66).toFixed(1)),
            // snf: Math.floor((milkCollectionData.clr / 4 + 0.20 * milkCollectionData.fat + 0.66) * 10) / 10,
            collectionOperationType: 'manual',
            testingOperationType: 'manual',
            milkType: milkCollectionData.fat >= 5.4 ? 'buffalo' : 'cow',
         };

         // console.log('submit func exists id',isId);

         if (isId) {
            // console.log('inside if isId UPDATE')
            payload.id = isId;
            payload.updatedAt = new Date();
            // payload.forEach(item => {
            //    item.id = isId;
            //    item.collectedAt = new Date();
            // });
            UpdateMilkCollectionDetails((res) => {
               let { status, message } = res;
               if (status === 200) {
                  clearData();
                  getMilkCollectionDetails();
                  setIsId(null);
                  setSelectedRouteId(0);
                  setIsCreateCollection(!isCreateCollection);
                  setAlertText(message);
                  setMilkCollectionData(initialState);
                  setShowConfirmModal1(true);
               } else if (status === 403) {
                  setShowConfirmModal(false);
                  setAlertText("You don't have access to perform this operation");
                  setShowConfirmModal1(true);
               } else if (status === 500) {
                  setShowConfirmModal(false);
                  setAlertText("Something wrong happened in API");
                  setShowConfirmModal1(true);
                  setIsLoading(false);
               } else if (message.includes("Invalid access token")) {
                  setAlertText("User Session has Expired");
                  setShowConfirmModal1(true);
                  setSessionOk(true);
               }
            }, payload);
            setIsId(null)
         } else {
            // console.log('insied else CREATE');
            payload.id = uuid;
            payload.collectedAt = new Date();
            payload.createdAt = new Date()

            // payload.forEach(item => {
            //    item.id = uuid;
            //    item.collectedAt = new Date();
            //    item.createdAt = new Date()
            // });
            CreateMilkCollectionDetails((res) => {
               let { status, message } = res;
               if (status === 200) {
                  clearData();
                  getMilkCollectionDetails();
                  setIsId(null);
                  setSelectedRouteId(0);
                  setIsCreateCollection(!isCreateCollection);
                  setAlertText(message);
                  setMilkCollectionData(initialState);
                  setShowConfirmModal1(true);
               } else if (status === 403) {
                  setShowConfirmModal(false);
                  setAlertText("You don't have access to perform this operation");
                  setShowConfirmModal1(true);
               } else if (status === 500) {
                  setShowConfirmModal(false);
                  setAlertText("Something wrong happened in API");
                  setShowConfirmModal1(true);
                  setIsLoading(false);
               } else if (message.includes("Invalid access token")) {
                  setAlertText("User Session has Expired");
                  setShowConfirmModal1(true);
                  setSessionOk(true);
               }
            }, payload);
            setIsId(null)
         }
      }, 1000);
      // }
   };

   const handleEdit = (id) => {
      // console.log('id: ',id);
      setIsCreateCollection(!isCreateCollection);

      const collection = milkCollectionDetails?.find((collection) => collection.id === id);

      if (collection) {
         const payload = {
            id: collection.id,
         };
         setMilkCollectionData({
            routeId: collection.routeId,
            organizationUnitId: collection.organizationUnitId,
            weight: collection.weight,
            canCount: collection.canCount,
            fat: collection.fat,
            snf: collection.snf,
            clr: collection.clr,
            sampleNumber: collection.sampleNumber
         }, payload);
      }
      setIsId(id);
      //   console.log(isId);
   };

   const handleDelete = (id) => {
      setShowConfirmModal(true);
      setIsId(id);
   };

   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   useEffect(() => {
      filterTableData();
   }, [searchTerm]);

   const filterTableData = () => {
      if (searchTerm === "") {
         setFilteredData(milkCollectionDetails);
      } else {
         const filteredData = milkCollectionDetails.filter((item) =>
            Object.values(item).some(
               (value) =>
                  value !== null &&
                  value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
         );
         setFilteredData(filteredData);
      }
   };

   {
      milkCollectionDetails?.map((val, ind) => {
         // console.log(val);
         items.push({
            SlNo: ind + 1,
            id: val?.id,
            heading_1: moment(val?.collectedAt).format('YYYY-MM-DD HH:mm:ss') ?? " ",
            // heading_2: ((((val?.fat * cowFat) + (val?.snf * cowSnf)) / 100) * val?.weight).toFixed(2) ?? "--",
            agentCode: val?.organizationUnitId,
            heading_2: val?.sampleNumber ? val.sampleNumber : " ",
            heading_3: val?.organizationUnitName ? val?.organizationUnitName : " ",
            milkType: val.milkType,
            heading_4: val?.fat?.toFixed(1) ? val?.fat?.toFixed(1) : " ",
            heading_5: val?.snf?.toFixed(1) ? val?.snf?.toFixed(1) : " ",
            heading_6: val?.clr?.toFixed(1) ? val?.clr?.toFixed(1) : " ",
            heading_7: val?.protein?.toFixed(1) ? val?.protein?.toFixed(1) : ' ',
            heading_8: val?.lactose?.toFixed(1) ? val.lactose?.toFixed(1) : ' ',
            heading_9: val?.salt?.toFixed(1) ? val?.salt?.toFixed(1) : ' ',
            heading_10: val?.water?.toFixed(1) ? val?.water?.toFixed(1) : ' ',
            heading_11: val?.temperature?.toFixed(1) ? val.temperature?.toFixed(1) : ' ',
            heading_12: val?.weight?.toFixed(1) ? val?.weight?.toFixed(1) : ' ',
            heading_13: val?.canCount ? val?.canCount : " ",
            heading_14: val?.testingOperationType ? val?.testingOperationType : " ",
            heading_15: val?.collectionOperationType ? val?.collectionOperationType : " ",
            Actions: (
               <div
                  style={{
                     display: "flex",
                     flexDirection: "row",
                     background: "none",
                     alignItems: "flex-start",
                  }}
               >
                  <button
                     disabled={isMilkBillLocked}
                     className="Update"
                     style={{
                        color: isMilkBillLocked ? "grey" : "green",
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                     }}
                     title={isMilkBillLocked ? 'Milk Bill Locked' : ' '}
                     onClick={() => {
                        handleEdit(val?.id)
                     }}
                  >
                     <EditNoteOutlinedIcon />
                  </button>
                  <button
                     disabled={isMilkBillLocked}
                     className="Delete"
                     style={{
                        color: isMilkBillLocked ? "grey" : "red",
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        marginLeft: 10,
                     }}
                     title={isMilkBillLocked ? 'Milk Bill Locked' : ' '}
                     onClick={() => {
                        handleDelete(val?.id);
                     }}
                  >
                     <DeleteOutlinedIcon />
                  </button>
               </div>
            ),
         });

         excelitem.push({
            'SlNo': ind + 1,
            'Milk Type': val?.milkType ? val?.milkType : " ",
            'Agent Code': val?.organizationUnitId,
            'Agent Name': val?.organizationUnitName ? val?.organizationUnitName : " ",
            'Fat': val?.fat?.toFixed(1) ? val?.fat?.toFixed(1) : " ",
            'SNF': val?.snf?.toFixed(1) ? val?.snf?.toFixed(1) : " ",
            'CLR': val?.clr?.toFixed(1) ? val?.clr?.toFixed(1) : " ",
            'Protein': val?.protein?.toFixed(1) ? val?.protein?.toFixed(1) : ' ',
            'Lactose': val?.lactose?.toFixed(1) ? val.lactose?.toFixed(1) : ' ',
            'Salt': val?.salt?.toFixed(1) ? val?.salt?.toFixed(1) : ' ',
            'Water': val?.water?.toFixed(1) ? val?.water?.toFixed(1) : ' ',
            'Temperature': val?.temperature?.toFixed(1) ? val.temperature?.toFixed(1) : ' ',
            'Weight': val?.weight?.toFixed(1) ? val?.weight?.toFixed(1) : ' ',
            'Can Count': val?.canCount ? val?.canCount : " ",
            'Collection Date': val?.collectedAt ? moment(val?.collectedAt).format('YYYY-MM-DD HH:mm:ss') : " ",
            'Sample Number': val?.sampleNumber ? val.sampleNumber : " ",
            'CLR': val?.clr ? val.clr : " ",

         })
      });
      // console.log("items", items)

   }

   const handleOk = () => {
      const payload = {
         id: isId,
      };
      if (isId != null) {
         DeleteMilkCollectionDetails((res) => {
            let { status, message } = res;
            if (status === 200) {
               getMilkCollectionDetails();
               setIsId(null);
               setShowConfirmModal(false);
               setAlertText(message);
               setShowConfirmModal1(true);
            } else if (status === 403) {
               setShowConfirmModal(false);
               setAlertText("You don't have access to perform this operation");
               setShowConfirmModal1(true);
            } else if (status === 500) {
               setShowConfirmModal(false);
               setAlertText("Something wrong happened in API");
               setShowConfirmModal1(true);
               setIsLoading(false);
            } else if (message.includes("Invalid access token")) {
               setAlertText("User Session has Expired");
               setShowConfirmModal1(true);
               setSessionOk(true);
            }
         }, payload);
      }
   };

   const handleConfirm = () => {
      setShowConfirmModal1(false);
      setIsCreateCollection(isCreateCollection);
      if (sessionOk) {
         localStorage.clear();
         navigate("/");
      }
   };

   return (
      <div className="milk-collection">
         <div className="milk-collection__container">
            <div className="milk-collection__header">
               <div className="milk-collection__header__section">
                  <div className="milk-collection__header__section__main">
                     <h5>Company: Verka</h5>
                     <h4>Milk Collection Details </h4>
                  </div>
                  <div className="milk-collection__header__section__bottom">
                     <Header />
                  </div>
               </div>
            </div>
            {isLoading ? (
               <Loader />
            ) : (
               <>
                  {isCreateCollection ? (
                     <div className="Cbody">
                        <Paper elevation={3}>
                           <div className="container">
                              <div>
                                 <CForm>
                                    <CRow>
                                       <CCol lg={6} md={2} sm={3}>
                                          <CFormLabel htmlFor="nf-email">
                                             Select Route
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <CFormSelect
                                             size="sm"
                                             value={milkCollectionData.routeId}
                                             onChange={(e) => {
                                                // handleDropDown("routeId", e.target.value);
                                                setSelectedRouteId(e.target.value)
                                                let route = milkCollectionRoutes.find((route) => route.route.id == e.target.value);
                                                setMilkCollectionData((prev) => ({
                                                   ...prev,
                                                   'routeId': e.target.value,
                                                   'transporterVehicleId': route.vehicle.id
                                                }));
                                                // console.log("milk data : ", milkCollectionData)
                                             }}
                                          >
                                             <option value={0}>
                                                Select Route
                                             </option>
                                             {milkCollectionRoutes?.length &&
                                                milkCollectionRoutes?.map(
                                                   (option, index) => {
                                                      return (
                                                         <option key={index} value={option.route.id}>
                                                            {option.route.routeName}
                                                         </option>
                                                      );
                                                   }
                                                )}
                                          </CFormSelect>
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                          </p>
                                       </CCol>
                                       <CCol lg={6} md={2} sm={3}>
                                          <CFormLabel htmlFor="nf-email">
                                             Select Agent
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <CFormSelect
                                             size="sm"
                                             value={milkCollectionData.organizationUnitId}
                                             onChange={(e) => {
                                                setMilkCollectionData((prev) => ({ ...prev, "organizationUnitId": e.target.value }));
                                                // console.log(e.target.value)
                                             }}
                                          >
                                             <option value={0}>
                                                Select Agent
                                             </option>
                                             {routeStops?.length &&
                                                routeStops?.map(
                                                   (option, index) => {
                                                      return (
                                                         <option key={index} value={option.stopId}>
                                                            {option.stopName}
                                                         </option>
                                                      );
                                                   }
                                                )}
                                          </CFormSelect>
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                          </p>
                                       </CCol>
                                       <CCol lg={6} md={2} sm={3}>
                                          <CFormLabel htmlFor="nf-email">
                                             Weight
                                          </CFormLabel>
                                          <CFormInput
                                             size="sm"
                                             name="weight"
                                             value={milkCollectionData.weight}
                                             onChange={handleInputChange}
                                             placeholder="Enter Milk Quantity "
                                             aria-label="default input example"
                                             onInput={(e) => {
                                                e.target.value = e.target.value.replace(
                                                   /[^0-9.-]/g,
                                                   ""
                                                );
                                             }}
                                          />
                                       </CCol>
                                       <CCol lg={6} md={2} sm={3}>
                                          <CFormLabel htmlFor="nf-email">
                                             Can Count
                                          </CFormLabel>
                                          <CFormInput
                                             size="sm"
                                             name="canCount"
                                             value={milkCollectionData.canCount}
                                             onChange={handleInputChange}
                                             placeholder="Enter Can Count "
                                             aria-label="default input example"
                                             onInput={(e) => {
                                                e.target.value = e.target.value.replace(
                                                   /[^0-9.-]/g,
                                                   ""
                                                );
                                             }}
                                          />
                                       </CCol>
                                       <CCol lg={6} md={2} sm={3}>
                                          <CFormLabel htmlFor="nf-email">
                                             Sample Number
                                          </CFormLabel>
                                          <CFormInput
                                             size="sm"
                                             name="sampleNumber"
                                             value={milkCollectionData.sampleNumber}
                                             onChange={handleInputChange}
                                             placeholder="Enter Sample Number"
                                             aria-label="default input example"
                                             onInput={(e) => {
                                                e.target.value = e.target.value.replace(
                                                   /[^0-9.-]/g,
                                                   ""
                                                );
                                             }}
                                          />
                                       </CCol>
                                       <CCol lg={6} md={2} sm={3}>
                                          <CFormLabel htmlFor="nf-email">
                                             FAT
                                          </CFormLabel>
                                          <CFormInput
                                             size="sm"
                                             name="fat"
                                             value={milkCollectionData.fat}
                                             onChange={handleInputChange}
                                             placeholder="Enter Fat "
                                             aria-label="default input example"
                                             onInput={(e) => {
                                                e.target.value = e.target.value.replace(
                                                   /[^0-9.-]/g,
                                                   ""
                                                );
                                             }}
                                          />
                                       </CCol>
                                       <CCol lg={6} md={2} sm={3}>
                                          <CFormLabel htmlFor="nf-email">
                                             CLR
                                          </CFormLabel>
                                          <CFormInput
                                             size="sm"
                                             name="clr"
                                             value={milkCollectionData.clr}
                                             onChange={handleInputChange}
                                             placeholder="Enter CLR "
                                             aria-label="default input example"
                                             onInput={(e) => {
                                                e.target.value = e.target.value.replace(
                                                   /[^0-9.-]/g,
                                                   ""
                                                );
                                             }}
                                          />
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                          </p>
                                       </CCol>

                                       <CCol lg={6} md={2} sm={3}>
                                          <CFormLabel htmlFor="nf-email">
                                             SNF
                                          </CFormLabel>
                                          <CFormInput
                                             name="snf"
                                             size="sm"
                                             disabled={true}
                                             value={milkCollectionData.fat > 0 && milkCollectionData.clr > 0 ? Number(milkCollectionData.clr / 4 + 0.20 * milkCollectionData.fat + 0.66).toFixed(1) : 0}
                                             onChange={handleInputChange}
                                             placeholder="Enter SNF "
                                             aria-label="default input example"
                                          // onInput={(e) => {
                                          //     e.target.value = e.target.value.replace(
                                          //         /[^0-9.-]/g,
                                          //         ""
                                          //     );
                                          // }}
                                          />
                                       </CCol>

                                    </CRow>
                                    <div style={{ marginTop: "1vw" }}>
                                       <CButton
                                          style={{
                                             border: 0,
                                             backgroundColor: "#0e419d",
                                             "margin-right": "15px",
                                          }}
                                          target="_blank"
                                          // disabled={isButtonDisabled}
                                          onClick={handleSubmit}
                                       >
                                          {isId ? "Update" : "Save"}
                                       </CButton>
                                       <CButton
                                          target="_blank"
                                          style={{
                                             border: 0,
                                             backgroundColor: "lightslategrey",
                                          }}
                                          onClick={handleCancelCollection}
                                       >
                                          Cancel
                                       </CButton>
                                    </div>
                                 </CForm>
                              </div>
                           </div>
                        </Paper>
                     </div>
                  ) : (
                     <div className="milk-collection__table">
                        <div className="milk-collection__table__header">
                           <div className="milk-collection__table__header__section">
                              <IconButton onClick={handleMilkCollection} style={{ backgroundColor: 'white' }}>
                                 <img src={images} alt="back" style={{ position: 'absolute', height: '40px' }} />
                              </IconButton>
                              {/* <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            onKeyPress={(e) => {
                                                if (e.target.value.length === 0 && e.key === " ") {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.target.value.length > 1 &&
                                                    e.key === " " &&
                                                    e.target.value[e.target.value.length - 1] === " "
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        /> */}
                              <div className="buttons">
                                 <button
                                    onClick={handleCreateCollection}
                                    title={"Create"}
                                    className={"Create"}
                                 >
                                    Add Milk Collection Details
                                 </button>
                                 <img
                                    onClick={handleExportToExcel}
                                    src={download}
                                    alt="download-icon"
                                 // style={{ marginTop: "-70px" }}
                                 />
                              </div>
                           </div>
                        </div>
                        <div
                           className="milk-collection__table__body"
                           style={{ height: "75vh", overflowY: "scroll" }}
                        >
                           <CTable
                              ref={tableRef}
                              columns={columns}
                              items={items}
                              hover
                              className="striped-table"
                           />
                        </div>
                     </div>
                  )}
               </>
            )}

            {showConfirmModal && (
               <Confirm
                  buttonText={"OK"}
                  isCancelRequired={true}
                  confirmTitle={"Are you sure ?"}
                  onConfirm={() => {
                     handleOk();
                  }}
                  onCancel={() => {
                     setShowConfirmModal(false);
                  }}
               />
            )}
            {showConfirmModal1 && (
               <Confirm
                  buttonText={"OK"}
                  isCancelRequired={false}
                  confirmTitle={alertText}
                  onConfirm={() => {
                     handleConfirm();
                  }}
                  onCancel={() => {
                     setShowConfirmModal1(false);
                     setSessionOk(true);
                  }}
               />
            )}
         </div>
      </div>
   )
}
export default MilkCollectionDetails