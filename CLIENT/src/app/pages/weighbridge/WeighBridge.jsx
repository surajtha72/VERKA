// if this line is not present, some has done git push --force :) correcting it for 4th time after being overwritten for 3 times.
import {
   CButton,
   CRow,
   CCol,
   CForm,
   CFormInput,
   CFormLabel,
   CTable,
   CFormSelect,
   CFormCheck,
   CModal,
   CModalBody,
   CModalHeader,
   CModalTitle
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { CPagination, CPaginationItem } from "@coreui/react";
import {
   GetWeighBridge,
   CreateWeighBridge,
   UpdateWeighBridge,
   DeleteWeighBridge,
   GetRouteMaster,
   GetProductCategory,
   GetDropDownProduct,
   GetVehicles,
   GetWeighBridgeData,
   GetManualEntryPermission,
   GetWBVehicleDropdown,
   GetRemoteWeighbridgeData,
   GetVehicleWithRegNumber,
   CreateWeighBridgeVehicle
} from "../../utils/apiCalls";
import Confirm from "../../components/confirmModal/confirm";
import "./Weighbridge.scss"
import { Paper } from "@mui/material";
import moment from "moment";
import Header from "../../components/header/Header";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import Select from 'react-select';
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
      label: "Weigh Bridge No.",
      _props: { scope: "col" },
   },
   {
      key: "heading_2",
      label: "Vehicle",
      _props: { scope: "col" },
   },
   {
      key: "heading_4",
      label: "Contractor Name",
      _props: { scope: "col" },
   },
   {
      key: "heading_5",
      label: "Challan No.",
      _props: { scope: "col" },
   },
   {
      key: "heading_8",
      label: "Destination",
      _props: { scope: "col" },
   },
   {
      key: "heading_9",
      label: "Purpose",
      _props: { scope: "col" },
   },
   {
      key: "heading_10",
      label: "Supplier Name",
      _props: { scope: "col" },
   },
   {
      key: "heading_12",
      label: "Product Category",
      _props: { scope: "col" },
   },
   {
      key: "heading_13",
      label: "Product Name",
      _props: { scope: "col" },
   },
   {
      key: "heading_14",
      label: "Weight Mode",
      _props: { scope: "col" },
   },
   {
      key: "heading_15",
      label: "Tare Weight",
      _props: { scope: "col" },
   },
   {
      key: "heading_16",
      label: "Tare Date",
      _props: { scope: "col" },
   },
   {
      key: "heading_17",
      label: "Gross Weight",
      _props: { scope: "col" },
   },
   {
      key: "heading_18",
      label: "Gross Date",
      _props: { scope: "col" },
   },
   {
      key: "heading_19",
      label: "Net Weight",
      _props: { scope: "col" },
   },
   {
      key: "heading_21",
      label: "Remarks",
      _props: { scope: "col" },
   },
   {
      key: "heading_26",
      label: "Actions",
      _props: { scope: "col" },
   },
];

const initialWeigh = {
   weighbridgeNo: "weighbridge1",
   vehicleNo: "",
   contractorName: "",
   challanNo: "",
   destination: "",
   purpose: "",
   supplierName: "",
   productCategory: "",
   productName: "",
   weightMode: "",
   tareWeight: "",
   tareDate: "",
   grossWeight: "",
   grossDate: "",
   netWeightKg: "",
   supplyQty: "",
   remarks: "",
   vehicleType: '',
   vehicleRegNo: ''
};
const WeighBridge = () => {
   const userAuthData = JSON.parse(localStorage.getItem("userData"));
   const [permission, setPermission] = useState([]);
   let userId = userAuthData?.userDetails.id;
   const items = [];
   const [filteredData, setFilteredData] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isCreateWeigh, setIsCreateWeigh] = useState(false);
   const [isEditWeigh, setIsEditWeigh] = useState(false);
   const [alertText, setAlertText] = useState("");
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [showConfirmModal1, setShowConfirmModal1] = useState(false);
   const [isId, setIsId] = useState();

   const [weighData, setWeighData] = useState(initialWeigh);
   const [weighDataErr, setWeighDataErr] = useState(initialWeigh);
   const [weighTableData, setWeighTableData] = useState([]);

   const [productCategoryData, setProductCategoryData] = useState([]);
   const [vehicleData, setVehicleData] = useState([]);

   const [dateTimeValue, setDateTimeValue] = useState('');

   const [isWeightInputDisable, setWeightInputDisable] = useState(true);

   const [isLoading, setIsLoading] = useState(true);
   const [sessionOk, setSessionOk] = useState(false);
   const destinationPurpose = [{ name: 'LMP' }, { name: 'Store' }]
   const [connectionError, setConnectionError] = useState('');
   const [generateSlipBtn, setGenerateSlipBtn] = useState(false);
   const [isPurposeLoading, setIsLoadingPurpose] = useState(false)
   const [chipData, setChipData] = useState(null);
   const navigate = useNavigate();
   const [isExistingTransporter, setIsExistingTransporter] = useState(true);
   const [newVehicleNumber, setNewVehicleNumber] = useState('');
   const [newTransporterName, setNewTransporterName] = useState('');
   const [createVehicleModal, setCreateVehicleModal] = useState(false);

   const [vehicleNumberError, setVehicleNumberError] = useState('');
   const [transporterNameError, setTransporterNameError] = useState('');

   useEffect(() => {
      if (userAuthData) {
         const WeighPermissions = userAuthData?.permissions?.find(
            (val) => val?.WeighBridge
         );
         setPermission(WeighPermissions?.WeighBridge);
      }
   }, []);

   const hasPermission = (perm) => {
      return permission?.includes(perm);
   };

   const clearDataErr = () => {
      setWeighDataErr(initialWeigh);
   };

   const clearData = () => {
      setWeighData(initialWeigh);
   };

   useEffect(() => {
      filterTableData();
   }, [searchTerm]);

   const filterTableData = () => {
      if (searchTerm === "") {
         setFilteredData(weighTableData);
      } else {
         const filteredData = weighTableData.filter((item) =>
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
      filteredData?.map((val, ind) => {
         items.push({
            SlNo: ind + 1,
            id: val?.id,
            heading_1: val?.weighbridgeNo ? val?.weighbridgeNo : " ",
            heading_2: val?.vehicleNo ? val?.vehicleNo.RegistrationNo : " ",
            heading_4: val?.contractorName ? val?.contractorName : " ",
            heading_5: val?.challanNo ? val?.challanNo : " ",
            heading_8: val?.destination ? val?.destination : " ",
            heading_9: val?.purpose ? val?.purpose : " ",
            heading_10: val?.supplierName ? val?.supplierName : " ",
            // heading_11: val?.routeId ? val?.routeId.RouteName : " ",
            heading_12: val?.productCategory ? val?.productCategory.CategoryName : " ",
            heading_13: val?.productName ? val?.productName : " ",
            heading_14: val?.weightMode ? val?.weightMode : " ",
            heading_15: val?.tareWeight ? val?.tareWeight : " ",
            heading_16: moment(val?.tareDateDate).format('YYYY-MM-DD') ?? " ",
            heading_17: val?.grossWeight ? val?.grossWeight : " ",
            heading_18: moment(val?.grossDate).format('YYYY-MM-DD') ?? " ",
            heading_19: val?.netWeightKg ? val?.netWeightKg : " ",
            heading_21: val?.remarks ? val?.remarks : " ",
            heading_26: (
               <div
                  style={{
                     display: "flex",
                     flexDirection: "row",
                     background: "none",
                     alignItems: "flex-start",
                  }}
               >
                  {/* <button
                     disabled={!hasPermission("Update")}
                     title={!hasPermission("Update") ? "No permission to Update" : ""}
                     className={hasPermission("Update") ? "" : "disabled-button"}
                     style={{
                        color: "green",
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                     }}
                     onClick={() => handleEdit(val?.id)}
                  >
                     <EditNoteOutlinedIcon />
                  </button> */}
                  <button
                     disabled={!hasPermission("Delete")}
                     title={!hasPermission("Delete") ? "No permission to Delete" : ""}
                     className={hasPermission("Delete") ? "" : "disabled-button"}
                     style={{
                        color: "red",
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        marginLeft: 10,
                     }}
                     onClick={() => {
                        handleDelete(val?.id);
                     }}
                  >
                     <DeleteOutlinedIcon />
                  </button>
               </div>

            ),
         });
      });
   }

   const handleDelete = (id) => {
      setShowConfirmModal(true);
      setIsId(id);
   };

   const handleOk = () => {
      const payload = {
         id: isId,
      };
      if (isId != null) {
         DeleteWeighBridge((res) => {
            let { status, message } = res;
            if (status === 200) {
               getWeighBridge();
               setIsId(null);
               setShowConfirmModal(false);
               setAlertText(message);
               setShowConfirmModal1(true);
            } else if (status === 403) {
               setShowConfirmModal(false);
               setAlertText("You don't have access to perform this operation");
               setShowConfirmModal1(true);
               setIsLoading(false);
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

   useEffect(() => {
      getWeighBridge();
      // getRouteMasterData();
      getProductCategory();
      getVehicles()
   }, []);


   let getWeighBridge = () => {
      setIsLoading(true);
      GetWeighBridge((res) => {
         let { status, data, message } = res;
         if (status === 200) {
            setWeighTableData(data);
            setFilteredData(data);
            setIsLoading(false);
         } else if (status === 403) {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModal1(true);
            setIsLoading(false);
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
      });
   };

   // const getRouteMasterData = () => {
   //    GetRouteMaster((res) => {
   //       // const { status, data, message } = res;
   //       if (res.status === 200) {
   //          setRouteMasterData(res.data);
   //       }
   //    });
   // };

   const getProductCategory = () => {
      GetProductCategory((res) => {
         // const { status, data, message } = res;
         if (res.status === 200) {
            setProductCategoryData(res.data);
         }
      });
   };

   //get all the vehicles
   const getVehicles = () => {
      GetVehicles((res) => {
         // const { status, data, message } = res;
         if (res.status === 200) {
            setVehicleData(res.data);
         }
      });
   };

   //get a vehicle with the registration number incase of a new vehicle number is entered
   const getVehicle = (vehicleNo) => {
      GetVehicleWithRegNumber((res) => {
         // const { status, data, message } = res;
         if (res.status === 200) {
            if (res.data.length > 0) {
               setIsExistingTransporter(true);
               setCreateVehicleModal(false);
            } else {
               setIsExistingTransporter(false);
               setNewVehicleNumber(vehicleNo);
               setCreateVehicleModal(true);
            }
         }
      }, vehicleNo);
   };

   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   const handleCreateWeigh = () => {
      setIsCreateWeigh(!isCreateWeigh);
      setIsEditWeigh(false);

      setWeightInputDisable(true);

      const currentDate = new Date();
      const formattedDate = moment(currentDate).format("YYYY-MM-DDTHH:mm");
      setDateTimeValue(formattedDate);
   };

   const handleCancleWeigh = () => {
      setIsCreateWeigh(!isCreateWeigh);
      setIsEditWeigh(false);
      clearData();
      clearDataErr();
      setShowWeightChip(false);
   };

   const handleConfirm = () => {
      setShowConfirmModal1(false);
      setIsCreateWeigh(isCreateWeigh);
      setIsEditWeigh(false);
      if (sessionOk) {
         localStorage.clear();
         navigate("/");
      }
   };

   const handleInput = (e) => {
      if (e.target.name === "bankIfscCode" || e.target.name === "panNo") {
         setWeighData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value.toUpperCase(),
         }));
      } else {
         setWeighData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
         }));
      }
      setWeighDataErr((prev) => ({
         ...prev,
         [e.target.name]: "",
      }));

      const currentDate = new Date();
      const formattedDate = moment(currentDate).format("YYYY-MM-DDTHH:mm");
      setDateTimeValue(formattedDate);
   };

   const handleDropDownBridgeNo = (name, value) => {
      setWeighData((prev) => ({ ...prev, [name]: value }));
      setWeighDataErr((prev) => ({ ...prev, [name]: "" }));
   }

   const handleDropdownSupplierName = (name, value) => {
      setWeighData((prev) => ({ ...prev, [name]: value }));
      setWeighDataErr((prev) => ({ ...prev, [name]: "" }));
   }

   const handleProductCatDropDown = (name, value) => {
      setWeighData((prev) => ({ ...prev, [name]: value }));
      setWeighDataErr((prev) => ({ ...prev, [name]: "" }));
      setSelectedCategoryId(value);
   };

   const handleDestinationPurposeDropdown = (name, value) => {
      setWeighData((prev) => ({ ...prev, [name]: value }));
      setWeighDataErr((prev) => ({ ...prev, [name]: "" }));
   };

   const handleProductNameDropDown = (name, value) => {
      setWeighData((prev) => ({ ...prev, [name]: value }));
      setWeighDataErr((prev) => ({ ...prev, [name]: "" }));
   };

   const handleVehicleDropDown = (name, value) => {
      setWeighData((prev) => ({ ...prev, [name]: value }));
      setWeighDataErr((prev) => ({ ...prev, [name]: "" }));
      setShowWeightChip(false);
   };

   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
   useEffect(() => {
      getProduct();
   }, [selectedCategoryId]);

   const [selectProductData, setSelectProductData] = useState([]);
   const getProduct = () => {
      GetDropDownProduct((res) => {
         setSelectProductData(res.data);
      }, selectedCategoryId);
      // console.log(selectProductData);
   };

   const validateFields = () => {
      let errObj = { ...initialWeigh };

      if (!weighData.weighbridgeNo) {
         errObj.weighbridgeNo = "This field is required";
      } else {
         errObj.weighbridgeNo = "";
      }
      if (!weighData.vehicleNo) {
         errObj.vehicleNo = "This field is required";
      } else if (weighData.vehicleNo == 0) {
         errObj.vehicleNo = "This field is required";
      } else {
         errObj.vehicleNo = "";
      }
      if (!weighData.contractorName) {
         errObj.contractorName = "This field is required";
      } else {
         errObj.contractorName = "";
      }
      if (!weighData.destination) {
         errObj.destination = "This field is required";
      } else if (weighData.destination == 0) {
         errObj.destination = "This field is required";
      } else {
         errObj.destination = "";
      }
      if (!weighData.purpose) {
         errObj.purpose = "This field is required";
      } else if (weighData.purpose == 0) {
         errObj.purpose = "This field is required";
      } else {
         errObj.purpose = "";
      }
      if (!weighData.supplierName) {
         errObj.supplierName = "This field is required";
      } else if (weighData.supplierName == 0) {
         errObj.supplierName = "This field is required";
      } else {
         errObj.supplierName = "";
      }
      if (!weighData.productCategory) {
         errObj.productCategory = "This field is required";
      } else if (weighData.productCategory == 0) {
         errObj.productCategory = "This field is required";
      } else {
         errObj.productCategory = "";
      }
      if (!weighData.productName) {
         errObj.productName = "This field is required";
      } else if (weighData.productName == 0) {
         errObj.productName = "This field is required";
      } else {
         errObj.productName = "";
      }
      if (!weighData.weightMode) {
         errObj.weightMode = "This field is required";
      } else {
         errObj.weightMode = "";
      }
      setWeighDataErr((prev) => ({ ...prev, ...errObj }));

      const currentDate = new Date();
      const formattedDate = moment(currentDate).format("YYYY-MM-DDTHH:mm");
      setDateTimeValue(formattedDate);

      console.log("errobj: ", errObj);

      return Object.values(errObj).every((x) => x === "");
   };

   const handleSubmit = () => {
      console.log(validateFields());
      if (validateFields()) {
         // console.log(weighData.grossWeight - weighData.tareWeight)
         let payload = {
            weighbridgeNo: weighData.weighbridgeNo,
            vehicleNo: isExistingTransporter ? weighData.vehicleNo : newVehicleNumber,
            contractorName: weighData.contractorName,
            challanNo: weighData.challanNo,
            destination: weighData.destination,
            purpose: weighData.purpose,
            supplierName: weighData.supplierName,
            // routeId: weighData.routeId,
            productCategory: weighData.productCategory,
            productName: weighData.productName,
            weightMode: weighData.weightMode,
            tareWeight: weighData.tareWeight,
            tareDate: dateTimeValue,
            grossWeight: weighData.grossWeight,
            grossDate: dateTimeValue,
            netWeightKg: weighData.grossWeight - weighData.tareWeight,
            supplyQty: weighData.supplyQty,
            remarks: weighData.remarks,
         };
         if (isId) {
            payload.id = isId;
            UpdateWeighBridge((res) => {
               let { status, message } = res;
               if (status === 200) {
                  // clearData();
                  getWeighBridge();
                  setIsId(null);
                  setAlertText(message);
                  setGenerateSlipBtn(true);
                  showWeightChip(false);
               }
               // console.log(weighData)
            }, payload);
         } else {
            CreateWeighBridge((res) => {
               let { status, message } = res;
               if (status === 200) {
                  if (!isNotNullTareWeight) {
                     clearData();
                     getWeighBridge();
                     setIsId(null);
                     setAlertText(message);
                     setIsCreateWeigh(!isCreateWeigh);
                     setShowConfirmModal1(true);
                     setIsEditWeigh(false);
                     setManualEntryFlag(true);
                     setAutomaticChecked(true);
                     setAllowManualEntry(true);
                     setShowWeightChip(false);
                  } else {
                     clearData();
                     getWeighBridge();
                     setIsId(null);
                     setAlertText(message);
                     setIsCreateWeigh(!isCreateWeigh);
                     setShowConfirmModal1(true);
                     setIsEditWeigh(false);
                     // setGenerateSlipBtn(true);
                  }
               }
            }, payload);
         }
      }
   };

   const validateVehicleData = () => {
      let isValid = true;
      if (!newVehicleNumber.trim()) {
         setVehicleNumberError('Vehicle Number is required');
         isValid = false;
      } else {
         setVehicleNumberError('');
      }

      if (!newTransporterName.trim()) {
         setTransporterNameError('Transporter Name is required');
         isValid = false;
      } else {
         setTransporterNameError('');
      }

      return isValid;
   };
   const createNewVehicle = () => {
      if (validateVehicleData()) {
         let payload = {
            vehicleNo: newVehicleNumber,
            contractorName: newTransporterName,
         }
         CreateWeighBridgeVehicle((res) => {
            if (res.status == 200) {
               setCreateVehicleModal(false);
               getVehicles();
            }
         }, payload)
      }
   }
   const handleEdit = (id) => {
      setIsCreateWeigh(!isCreateWeigh);
      setIsEditWeigh(true);

      setWeightInputDisable(true);

      const currentDate = new Date();
      const formattedDate = moment(currentDate).format("YYYY-MM-DDTHH:mm");
      setDateTimeValue(formattedDate);

      const payload = {
         id: weighTableData.find((role) => role.id === id)?.id,
      };
      const productCategId = weighTableData.find((role) => role.id === id)?.productCategory.Id
      setSelectedCategoryId(productCategId);

      setWeighData(
         {
            weighbridgeNo: weighTableData.find((role) => role.id === id)?.weighbridgeNo || "",
            vehicleNo: weighTableData.find((role) => role.id === id)?.vehicleNo.Id || "",
            contractorCode: weighTableData.find((role) => role.id === id)?.contractorCode || "",
            contractorName: weighTableData.find((role) => role.id === id)?.contractorName || "",
            challanNo: weighTableData.find((role) => role.id === id)?.challanNo || "",
            driverName: weighTableData.find((role) => role.id === id)?.driverName || "",
            contactPerson: weighTableData.find((role) => role.id === id)?.contactPerson || "",
            destination: weighTableData.find((role) => role.id === id)?.destination || "",
            purpose: weighTableData.find((role) => role.id === id)?.purpose || "",
            supplierName: weighTableData.find((role) => role.id === id)?.supplierName || "",
            // routeId: weighTableData.find((role) => role.id === id)?.routeId.Id || "",
            productCategory: weighTableData.find((role) => role.id === id)?.productCategory.Id || "",
            productName: weighTableData.find((role) => role.id === id)?.productName || "",
            weightMode: weighTableData.find((role) => role.id === id)?.weightMode || "",
            tareWeight: weighTableData.find((role) => role.id === id)?.tareWeight || "",
            grossWeight: weighTableData.find((role) => role.id === id)?.grossWeight || "",
            netWeightKg: weighTableData.find((role) => role.id === id)?.netWeightKg || "",
            supplyQty: weighTableData.find((role) => role.id === id)?.supplyQty || "",
            remarks: weighTableData.find((role) => role.id === id)?.remarks || "",
         },
         payload
      );
      setIsId(weighTableData.find((role) => role.id === id)?.id);
   };

   const handleDateTimeChange = (e) => {
      setDateTimeValue(e.target.value);
   };

   const [automaticChecked, setAutomaticChecked] = useState(true);
   const [showPermissionModal, setShowPermissionModal] = useState(false);
   const handleCheckAutomatic = () => {
      const checkBox = document.getElementById("automatic");
      setAutomaticChecked(!automaticChecked);
      setWeightInputDisable(true);
      setAllowManualEntry(true);
   }

   const handleCheckManual = () => {
      const checkBox = document.getElementById("manual");
      setWeightInputDisable(false);
      setAutomaticChecked(false);
      setShowPermissionModal(true);
   }

   const [showWeightChip, setShowWeightChip] = useState(false);
   const getWeighbridgeData = () => {
      // console.log("inside get weigdata fun")
      GetRemoteWeighbridgeData((result) => {
         const data = result.data
         if (result.data.weight !== null) {
            setShowWeightChip(true);
            setChipData(data.weight);
         }
         else {
            setShowWeightChip(false);
         }
         console.log('weigh data : ', weighData)
         if (isPurposeLoading) {
            console.log("inside loading condition")
            if (!isNotNullTareWeight) {
               console.log('loading tare')
               setWeighData((prev) => ({ ...prev, ["tareWeight"]: data.weight }));
            }
            else {
               console.log('locading gross')
               setWeighData((prev) => ({ ...prev, ["grossWeight"]: data.weight }))
            }
         }
         else {
            console.log('inside unloading condition')
            if (!isNotNullGrossWeight) {
               console.log("unloading gross")
               setWeighData((prev) => ({ ...prev, ["grossWeight"]: data.weight }));
            }
            else {
               setWeighData((prev) => ({ ...prev, ["tareWeight"]: data.weight }))
               console.log("unloading tare")
            }
         }
         // if ((weighData.tareWeight == null && !isPurposeLoading) || (weighData.tareWeight !== null && isPurposeLoading)) {
         //    console.log("inside grossweight condition")
         //    setWeighData((prev) => ({ ...prev, ["grossWeight"]: data.weight }));
         // }
         // else{
         //    setWeighData((prev) => ({ ...prev, ["tareWeight"]: data.weight }))
         //    console.log("inside tareweight condition")

         // }

         if (result.status == 500) {
            setConnectionError("Couldn't connect");
         }
         else {
            setConnectionError('');
         }
      })
   }

   // MANUAL ENTRY
   const [allowManualEntry, setAllowManualEntry] = useState(true);
   const [manualEntryFlag, setManualEntryFlag] = useState(false);
   const [enableGrossWeicghtManualEntry, setEnableGrossWeightManualEntry] = useState(false)
   let aadhaarNo;
   const [errMessage, setErrorMessage] = useState('');
   const getManualEntryPermission = (userId, aadhaarNo) => {
      GetManualEntryPermission((res) => {
         if (res.status === 200) {
            setAllowManualEntry(!allowManualEntry);
            setShowPermissionModal(!showPermissionModal)
            setManualEntryFlag(true);
         }
         else {
            setErrorMessage("Please enter a valid code.")
         }
      }, userId, aadhaarNo)
   }

   const handleInputChange = (e) => {
      aadhaarNo = e.target.value;
   }

   if (allowManualEntry) {
      weighData.weightMode = 'Automatic'
   } else { weighData.weightMode = 'Manual' }

   // GROSS WEIGHT AND TARE WEIGHT
   const [isNotNullGrossWeight, setisNotNullGrossWeight] = useState(false);
   const [isNotNullTareWeight, setisNotNullTareWeight] = useState(false);
   const [selectedVehicleDetails, setSelectedVehicleDetails] = useState();
   const tareOrGrossWeight = (vehicleNo) => {
      GetWBVehicleDropdown((res) => {
         if (res.data && res.data.length > 0) {
            setSelectedVehicleDetails(res.data[0].vehicleNo);
            if (res.data[0].purpose == 'Loading') {
               setIsLoadingPurpose(true)
            } else {
               setIsLoadingPurpose(false);
            }
            if (res.data[0].grossWeight !== null && res.data[0].tareWeight !== null) {
               console.log('res data :', res.data);
               setIsId(null);
            }
            else {
               if (res.data[0].grossWeight !== null) {
                  console.log('result data :', res.data);
                  setIsId(res.data[0].id);
                  setWeighData({
                     ...res.data[0],
                     vehicleNo: vehicleNo,
                  });
                  // setWeighData((prev) => ({ ...prev, ["routeId"]: res.data[0].routeId.Id }));
                  setWeighData((prev) => ({ ...prev, ["productCategory"]: res.data[0].productCategory.Id }));
                  setWeighData((prev) => ({ ...prev, ["productName"]: res.data[0].productName }));
                  setSelectedCategoryId(res.data[0].productCategory.Id)
                  setisNotNullGrossWeight(true);
               }
               if (res.data[0].tareWeight !== null) {
                  setIsId(res.data[0].id);
                  setWeighData({
                     ...res.data[0],
                     vehicleNo: vehicleNo,
                  });
                  // setWeighData((prev) => ({ ...prev, ["routeId"]: res.data[0].routeId.Id }));
                  setWeighData((prev) => ({ ...prev, ["productCategory"]: res.data[0].productCategory.Id }));
                  setWeighData((prev) => ({ ...prev, ["productName"]: res.data[0].productName }));
                  setSelectedCategoryId(res.data[0].productCategory.Id)
                  setisNotNullTareWeight(true);
               }
            }
         } else {
            // console.log('inside else');
            setisNotNullGrossWeight(false);
         }
      }, vehicleNo)
   }


   // GENERATE SLIP BUTTON
   const [generateSlip, setGenerateSlip] = useState(false);
   const handleGenerateSlip = async () => {
      setGenerateSlip(true);
      getWeighBridge();
      setIsCreateWeigh(!isCreateWeigh);
      console.table('weighbridge data : ', weighData)
   }

   const generatePDF = async () => {
      const invoiceElements = document.querySelectorAll(".weighbridge_invoice");
      const html2pdfOptions = {
         margin: 10,
         filename: "Weighbridge Bill.pdf",
         image: { type: "jpeg", quality: 0.98 },
         html2canvas: { scale: 2 },
         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Create an array to store HTML content of each "invoice" element
      const htmlContents = [];

      invoiceElements.forEach((content) => {
         htmlContents.push(content.innerHTML);
      });

      // Combine all HTML content into a single string
      const combinedHTML = htmlContents.join("<div style='page-break-before:always'></div>");

      // Generate a PDF from the combined HTML content
      const opt = { ...html2pdfOptions };
      await html2pdf().from(combinedHTML).set(opt).save();
      // setShowConfirmModal1(true);
      setIsEditWeigh(false);
      clearData();
      setIsId(null);
      setGenerateSlip(false);
      setGenerateSlipBtn(false)
      window.location.reload();
   };

   return (

      <>
         <CModal
            alignment="center"
            visible={createVehicleModal}
            onClose={() => {
               setCreateVehicleModal(false);
               setErrorMessage('');
            }}
         >
            <CModalHeader>
               <CModalTitle>Vehicle number does not exist. <br />
                  Create New Vehicle</CModalTitle>
            </CModalHeader>

            <CModalBody>
               <CForm method="post" onSubmit={e => e.preventDefault()}>
                  <CRow>
                     <CCol lg={12}>
                        <CFormLabel>Vehicle Number</CFormLabel>
                        <CFormInput
                           size="sm"
                           type="text"
                           name="vehicleNo"
                           id="vehicleNo"
                           required
                           value={newVehicleNumber.toUpperCase()}
                           onChange={(e) => {
                              setNewVehicleNumber(e.target.value);
                              setVehicleNumberError('');
                           }}
                           placeholder="Enter Vehicle Number"
                        />
                        <span style={{ color: 'red' }}>{vehicleNumberError}</span>
                     </CCol>
                     <CCol lg={12}>
                        <CFormLabel>Transporter Name</CFormLabel>
                        <CFormInput
                           size="sm"
                           type="text"
                           name="transporterName"
                           id="transporterName"
                           required
                           onChange={(e) => {
                              setNewTransporterName(e.target.value);
                              setTransporterNameError('');
                           }}
                           placeholder="Enter Transporter Name"
                        />
                        <span style={{ color: 'red' }}>{transporterNameError}</span>
                     </CCol>
                  </CRow>
                  <br />
                  <div style={{ display: "flex" }}>
                     <CButton
                        style={{
                           backgroundColor: "#0060f1",
                           marginRight: "15px",
                        }}
                        onClick={createNewVehicle}
                     >
                        Submit
                     </CButton>
                     <CButton
                        color="primary"
                        style={{
                           backgroundColor: "gray",
                        }}
                        onClick={() => {
                           setCreateVehicleModal(false);
                        }}
                     >
                        Cancel
                     </CButton>
                  </div>
               </CForm>
            </CModalBody>
         </CModal>


         <CModal

            alignment="center"
            visible={showPermissionModal}
            onClose={() => {
               setShowPermissionModal(false);
               setErrorMessage('');
               if (manualEntryFlag !== true) {
                  setAutomaticChecked(true)
               }
            }}
         >
            <CModalHeader>
               <CModalTitle>Enter Manager Password</CModalTitle>
            </CModalHeader>

            <CModalBody>
               <CForm method="post" onSubmit="">
                  <CRow>
                     <CCol lg={12}>
                        <CFormLabel>Manager Authorization Required!</CFormLabel>
                        <CFormInput
                           size="sm"
                           type="password"
                           name="password"
                           id="password"
                           onChange={(handleInputChange)}
                           placeholder="Enter The Varification Code"
                        />
                     </CCol>
                  </CRow>
                  <span style={{ color: 'red' }}>{errMessage}</span>
                  <br></br>
                  <div style={{ display: "flex" }}>
                     <CButton
                        //color="primary"
                        style={{
                           backgroundColor: "#0060f1",
                           "margin-right": "15px",
                        }}
                        target="_blank"
                        onClick={() => getManualEntryPermission(userId, aadhaarNo)}
                     >
                        Submit
                     </CButton>
                     <CButton
                        color="primary"
                        target="_blank"
                        style={{
                           backgroundColor: "gray",
                        }}
                        onClick={() => {
                           setShowPermissionModal(false);
                           setErrorMessage('');
                        }}
                     >
                        Cancel
                     </CButton>
                  </div>
               </CForm>
            </CModalBody>
         </CModal>
         <div className="weighbridge">
            <div className="weighbridge__container">
               <div className="weighbridge__header">
                  <div className="weighbridge__header__section">
                     <div className="weighbridge__header__section__main">
                        <h5>Company: Verka</h5>
                        <h4>{`${!isCreateWeigh
                           ? "Weigh Bridge List"
                           : isEditWeigh
                              ? "Edit Weigh Bridge"
                              : "Create Weigh Bridge"
                           }`}</h4>
                     </div>
                     <div className="weighbridge__header__section__bottom">
                        <Header />
                     </div>
                  </div>
               </div>
               {isCreateWeigh ? (
                  <>
                     <div className="Cbody">
                        <Paper elevation={3}>
                           <div className="container">
                              <div>
                                 <CForm method="post" onSubmit="">
                                    <CRow>
                                       <CCol lg={4}>
                                          <CFormLabel htmlFor="nf-email">
                                             Weigh Bridge No.
                                          </CFormLabel>
                                          <CFormSelect
                                             size="sm"
                                             value={weighData.weighbridgeNo}
                                             name="weighbridgeNo"
                                             onChange={(e) => {
                                                handleDropDownBridgeNo(
                                                   "weighbridgeNo",
                                                   e.target.value
                                                );
                                             }}
                                          >
                                             <option value={"Weigh Bridge 1"}>Weigh Bridge 1</option>
                                          </CFormSelect>
                                       </CCol>
                                    </CRow> <br />
                                    <CRow>
                                       <hr />
                                       <CCol lg={12}><p style={{ fontWeight: "bold" }}>Vehicle Details :</p></CCol>
                                       <CCol lg={4}>
                                          <CFormLabel htmlFor="nf-email">
                                             Vehicle No.{" "}
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <Select
                                             name="vehicleId"
                                             options={vehicleData}
                                             // value={weighData.vehicleNo}
                                             onChange={(e) => {
                                                const selectedVehicleId = e.id;
                                                setIsExistingTransporter(true);
                                                const selectedVehicle = vehicleData.find((option) => option.id === parseInt(selectedVehicleId, 10));
                                                if (selectedVehicle) {
                                                   setWeighData((prev) => ({ ...prev, "contractorName": selectedVehicle.transporterId?.FirmName || '' }));
                                                   setWeighData((prev) => ({ ...prev, "vehicleType": selectedVehicle?.vehicleNo?.VehicleType || '' }));
                                                   setWeighData((prev) => ({ ...prev, "vehicleRegNo": selectedVehicle?.vehicleNo?.RegistrationNo || '' }));
                                                }
                                                handleVehicleDropDown("vehicleNo", selectedVehicleId);
                                                tareOrGrossWeight(selectedVehicleId);
                                             }}
                                             onInputChange={(inputValue) => {
                                                if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                                   if (inputValue.length >= 9) {
                                                      getVehicle(inputValue);
                                                      setNewVehicleNumber(inputValue)
                                                   } else setIsExistingTransporter(true)
                                                }
                                             }}
                                             getOptionLabel={(option) => option.registrationNumber.toUpperCase()}
                                             getOptionValue={(option) => option.id}
                                             isSearchable
                                             placeholder="Select Vehicle"
                                             styles={{
                                                control: (provided, state) => ({
                                                   ...provided,
                                                   height: '32px',
                                                   minHeight: '32px',
                                                   alignContent: 'center'
                                                }),
                                             }}
                                          />
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                             {weighDataErr.vehicleNo}
                                          </p>
                                       </CCol>
                                       <CCol lg={4}>
                                          <CFormLabel htmlFor="nf-email">
                                             Contractor Name{" "}
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <CFormInput
                                             size="sm"
                                             type="Name"
                                             name="contractorName"
                                             disabled={isExistingTransporter}
                                             value={weighData.contractorName}
                                             onChange={handleInput}
                                             placeholder="Enter Contractor Name.."
                                             aria-label="default input example"
                                             onInput={(e) => {
                                                e.target.value = e.target.value.replace(
                                                   /[^a-zA-Z\s]/g,
                                                   ""
                                                );
                                             }}
                                          />
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                             {weighDataErr.contractorName}
                                          </p>
                                       </CCol>
                                       <CCol lg={4}>
                                          <CFormLabel htmlFor="nf-email">
                                             Challan No.
                                             {/* <span style={{ color: "red" }}>*</span> */}
                                          </CFormLabel>
                                          <CFormInput
                                             size="sm"
                                             type="text"
                                             name="challanNo"
                                             value={weighData.challanNo}
                                             onChange={handleInput}
                                             placeholder="Enter Challan No.."
                                             aria-label="default input example"
                                          />
                                       </CCol>
                                    </CRow> <br />
                                    <CRow>
                                       <hr />
                                       <CCol lg={12}><p style={{ fontWeight: "bold" }}>Destination/Purpose :</p></CCol>
                                       <CCol lg={6}>
                                          <CFormLabel htmlFor="nf-email">
                                             Purpose{" "}
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <CFormSelect
                                             size="sm"
                                             value={weighData.purpose}
                                             // disabled={true}
                                             name="purpose"
                                             onChange={(e) => {
                                                handleDropDownBridgeNo(
                                                   "purpose",
                                                   e.target.value
                                                );
                                                if (e.target.value == 'Loading') {
                                                   setIsLoadingPurpose(true);
                                                } else {
                                                   setIsLoadingPurpose(false);
                                                }
                                             }}
                                          >
                                             <option value={0}>Select Purpose</option>
                                             <option value={"Loading"}>Loading</option>
                                             <option value={"Unloading"}>Unloading</option>
                                          </CFormSelect>
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                             {weighDataErr.purpose}
                                          </p>
                                       </CCol>
                                       <CCol lg={6}>
                                          <CFormLabel htmlFor="nf-email">
                                             Destination{" "}
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <CFormSelect
                                             size="sm"
                                             value={weighData.destination}
                                             name="destination"
                                             onChange={(e) => {
                                                handleDestinationPurposeDropdown(
                                                   "destination",
                                                   e.target.value
                                                );
                                             }}
                                          >
                                             <option value={0}>Select Destination Purpose</option>
                                             {destinationPurpose?.length &&
                                                destinationPurpose?.map(
                                                   (option, index) => {
                                                      return (
                                                         <option key={index} value={option.id}>
                                                            {option.name}
                                                         </option>
                                                      );
                                                   }
                                                )}
                                          </CFormSelect>
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                             {weighDataErr.destination}
                                          </p>
                                       </CCol>
                                    </CRow><br />
                                    <CRow>
                                       <hr />
                                       <CCol lg={12}><p style={{ fontWeight: "bold" }}>Supplier Details :</p></CCol>
                                       <CCol lg={6}>
                                          <CFormLabel htmlFor="nf-email">
                                             Supplier Name{" "}
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <CFormSelect
                                             size="sm"
                                             name="supplierName"
                                             value={weighData.supplierName}
                                             onChange={(e) => {
                                                handleDropdownSupplierName("supplierName", e.target.value);
                                             }}
                                          // placeholder="Enter Supplier Name.."
                                          // aria-label="default input example"
                                          // onInput={(e) => {
                                          //     e.target.value = e.target.value.replace(
                                          //         /[^a-zA-Z\s]/g,
                                          //         ""
                                          //     );
                                          // }}
                                          >
                                             <option value={0}>Select Suppllier Name</option>
                                             <option value={'GDL Factory'}>GDL Factory</option>
                                             <option value={'BMC'}>BMC</option>
                                             <option value={'Chilling Center'}>Chilling Center</option>
                                          </CFormSelect>
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                             {weighDataErr.supplierName}
                                          </p>
                                       </CCol>
                                       {/* <CCol lg={6}>
                                          <CFormLabel htmlFor="nf-email">
                                             Route Id.{" "}
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <Select
                                             styles={{ control: (base, _state) => ({ ...base, minHeight: '32px', height: '32px' }) }}
                                             size="sm"
                                             value={routeMasterData.find(
                                                (option) =>
                                                   option.id === weighData.routeId)}
                                             name="routeId"
                                             isSeachable
                                             getOptionLabel={(option) => option.routeName}
                                             getOptionValue={(option) => option.id}
                                             placeholder={<div style={{ height: 30 }}>Select Route</div>}
                                             onChange={(selectedOption) => {
                                                handleRouteDropDown(
                                                   "routeId",
                                                   selectedOption.id
                                                );
                                             }}
                                             options={routeMasterData}
                                          />
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                             {weighDataErr.routeId}
                                          </p>
                                       </CCol> */}
                                    </CRow><br />
                                    <CRow>
                                       <hr />
                                       <CCol lg={12}><p style={{ fontWeight: "bold" }}>Product Details :</p></CCol>
                                       <CCol lg={6}>
                                          <CFormLabel htmlFor="nf-email">
                                             Product Group{" "}
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <CFormSelect
                                             size="sm"
                                             value={weighData.productCategory}
                                             name="productCategory"
                                             onChange={(e) => {
                                                handleProductCatDropDown(
                                                   "productCategory",
                                                   e.target.value
                                                );
                                             }}
                                          >
                                             <option value={0}>Select Prod Category</option>
                                             {productCategoryData?.length &&
                                                productCategoryData?.map(
                                                   (option, index) => {
                                                      return (
                                                         <option key={index} value={option.id}>
                                                            {option.categoryName}
                                                         </option>
                                                      );
                                                   }
                                                )}
                                          </CFormSelect>
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                             {weighDataErr.productCategory}
                                          </p>
                                       </CCol>
                                       <CCol lg={6}>
                                          <CFormLabel htmlFor="nf-email">
                                             Product Name{" "}
                                             <span style={{ color: "red" }}>*</span>
                                          </CFormLabel>
                                          <CFormSelect
                                             size="sm"
                                             value={weighData.productName}
                                             name="productName"
                                             onChange={(e) =>
                                                handleProductNameDropDown("productName", e.target.value)
                                             }
                                          >
                                             <option value={0}>Select Prod Name</option>
                                             {selectProductData?.length &&
                                                selectProductData?.map((option, index) => {
                                                   return (
                                                      <option key={index} value={option.productName}>
                                                         {option.productName}
                                                      </option>
                                                   );
                                                })}
                                          </CFormSelect>
                                          <p style={{ color: "red", fontSize: "x-small" }}>
                                             {weighDataErr.productName}
                                          </p>
                                       </CCol>
                                    </CRow><br />
                                    {!isPurposeLoading ? (
                                       // UNLOADING
                                       <><CRow>
                                          <hr />
                                          <CCol lg={2}><p style={{ fontWeight: "bold" }}>Weight Details :</p></CCol>
                                          <CCol lg={2}>
                                             <CFormCheck id="automatic" label="Automatic" onClick={handleCheckAutomatic} defaultChecked={automaticChecked} />
                                          </CCol>
                                          <CCol lg={2}>
                                             <CFormCheck id="manual" label="Manual" onClick={handleCheckManual} defaultChecked={!automaticChecked} />
                                          </CCol>
                                          <CCol lg={2}>
                                             <CButton style={{
                                                border: 0,
                                                backgroundColor: "#0e619d",
                                                marginRight: "15px",
                                                fontSize: "0.9rem"
                                             }}
                                                onClick={getWeighbridgeData}
                                             >Read Values</CButton>
                                             <span style={{ color: 'red' }}>{connectionError}</span>
                                          </CCol>
                                          {showWeightChip && <CCol style={{
                                             height: "60px",
                                             backgroundColor: "#FA8072",
                                             textAlign: "center",
                                             fontSize: "40px",
                                             fontWeight: "bold",
                                             marginLeft: "10px",
                                             borderRadius: "10px",
                                             marginLeft: 45,
                                             marginRight: 40,
                                             width: 135

                                          }} lg={2}>
                                             {chipData}

                                          </CCol>}
                                       </CRow>
                                          <CRow>
                                             <CCol lg={6}>
                                                <CFormLabel htmlFor="nf-email">
                                                   Gross Weight{" "}
                                                   <span style={{ color: "red" }}>*</span>
                                                </CFormLabel>
                                                <CFormInput
                                                   size="sm"
                                                   type="Name"
                                                   name="grossWeight"
                                                   disabled={allowManualEntry}
                                                   value={weighData.grossWeight}
                                                   onChange={handleInput}
                                                   placeholder="Enter Gross Weight.."
                                                   aria-label="default input example"
                                                   onInput={(e) => {
                                                      e.target.value = e.target.value.replace(
                                                         /[^0-9.-]/g,
                                                         ""
                                                      );
                                                   }}
                                                />
                                                <p style={{ color: "red", fontSize: "x-small" }}>
                                                   {weighDataErr.grossWeight}
                                                </p>
                                             </CCol>

                                             <CCol lg={6}>
                                                <CFormLabel htmlFor="nf-email">
                                                   Gross Date{" "}
                                                   <span style={{ color: "red" }}>*</span>
                                                </CFormLabel>
                                                <input
                                                   type="datetime-local"
                                                   className="time-control"
                                                   id="datetimeInput"
                                                   value={dateTimeValue}
                                                   disabled={true}
                                                   onChange={handleDateTimeChange}
                                                />
                                                {/* <p style={{ color: "red", fontSize: "x-small" }}>
                                                        {weighDataErr.tareDate}
                                                    </p> */}
                                             </CCol>
                                          </CRow>
                                          {isNotNullGrossWeight && <>
                                             <CRow>
                                                <CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      Tare Weight{" "}
                                                      <span style={{ color: "red" }}>*</span>
                                                   </CFormLabel>
                                                   <CFormInput
                                                      size="sm"
                                                      type="Name"
                                                      name="tareWeight"
                                                      disabled={allowManualEntry}
                                                      value={weighData.tareWeight}
                                                      onChange={handleInput}
                                                      placeholder="Enter Tare Weight.."
                                                      aria-label="default input example"
                                                      onInput={(e) => {
                                                         e.target.value = e.target.value.replace(
                                                            /[^0-9.-]/g,
                                                            ""
                                                         );
                                                      }} />
                                                   <p style={{ color: "red", fontSize: "x-small" }}>
                                                      {weighDataErr.tareWeight}
                                                   </p>
                                                </CCol><CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      Tare Date{" "}
                                                      <span style={{ color: "red" }}>*</span>
                                                   </CFormLabel>
                                                   <input
                                                      type="datetime-local"
                                                      className="time-control"
                                                      id="datetimeInput"
                                                      value={dateTimeValue}
                                                      disabled={true}
                                                      onChange={handleDateTimeChange} />
                                                </CCol>
                                                <CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      Net Weight in Kg{" "}
                                                      <span style={{ color: "red" }}>*</span>
                                                   </CFormLabel>
                                                   <CFormInput
                                                      size="sm"
                                                      type="Name"
                                                      name="netWeightKg"
                                                      disabled={true}
                                                      value={weighData.grossWeight - weighData.tareWeight}
                                                      onChange={handleInput}
                                                      placeholder="Enter Net Weight.."
                                                      aria-label="default input example"
                                                   // onInput={(e) => {
                                                   //     e.target.value = e.target.value.replace(
                                                   //         /[^0-9.-]/g,
                                                   //         ""
                                                   //     );
                                                   // }}
                                                   />
                                                   <p style={{ color: "red", fontSize: "x-small" }}>
                                                      {weighDataErr.netWeightKg}
                                                   </p>
                                                </CCol>
                                             </CRow>
                                          </>}

                                          <CRow><CCol lg={6}>
                                             <CFormLabel htmlFor="nf-email">
                                                {/* Remarks<span style={{ color: "red" }}>*</span> */}
                                             </CFormLabel>
                                             <CFormInput
                                                size="sm"
                                                type="Name"
                                                name="remarks"
                                                value={weighData.remarks}
                                                onChange={handleInput}
                                                placeholder="Enter Remarks.."
                                                aria-label="default input example"
                                                onInput={(e) => {
                                                   e.target.value = e.target.value.replace(
                                                      /[^a-zA-Z\s]/g,
                                                      ""
                                                   );
                                                }}
                                             />
                                             {/* <p style={{ color: "red", fontSize: "x-small" }}>
                                                            {weighDataErr.remarks}
                                                        </p> */}
                                          </CCol>
                                          </CRow> <br />
                                          <div style={{ marginTop: "1vw" }}>
                                             {!generateSlipBtn ? (
                                                <>
                                                   <CButton
                                                      style={{
                                                         border: 0,
                                                         backgroundColor: "#0e419d",
                                                         marginRight: "15px",
                                                      }}
                                                      target="_blank"
                                                      onClick={handleSubmit}
                                                   >
                                                      {isEditWeigh ? "Update" : "Save"}
                                                   </CButton>
                                                   <CButton
                                                      target="_blank"
                                                      style={{
                                                         border: 0,
                                                         backgroundColor: "lightslategrey",
                                                      }}
                                                      onClick={handleCancleWeigh}
                                                   >
                                                      Cancel
                                                   </CButton>
                                                </>
                                             ) : (
                                                <>
                                                   <CButton
                                                      style={{
                                                         border: 0,
                                                         backgroundColor: "#0e419d",
                                                      }}
                                                      target="_blank"
                                                      onClick={handleGenerateSlip}
                                                   >
                                                      Generate Slip
                                                   </CButton>
                                                </>
                                             )}

                                          </div></>) :
                                       (
                                          //LOADING
                                          <><CRow>
                                             <hr />
                                             <CCol lg={2}><p style={{ fontWeight: "bold" }}>Weight Details :</p></CCol>
                                             <CCol lg={2}>
                                                <CFormCheck id="automatic" label="Automatic" onClick={handleCheckAutomatic} defaultChecked={automaticChecked} />
                                             </CCol>
                                             <CCol lg={2}>
                                                <CFormCheck id="manual" label="Manual" onClick={handleCheckManual} defaultChecked={!automaticChecked} />
                                             </CCol>
                                             <CCol lg={2}>
                                                <CButton style={{
                                                   border: 0,
                                                   backgroundColor: "#0e619d",
                                                   marginRight: "15px",
                                                   fontSize: "0.9rem"
                                                }}
                                                   onClick={getWeighbridgeData}
                                                >Read Values</CButton>
                                                <span style={{ color: 'red' }}>{connectionError}</span>
                                             </CCol>
                                             {showWeightChip && <CCol style={{
                                                height: "60px",
                                                backgroundColor: "#FA8072",
                                                textAlign: "center",
                                                fontSize: "40px",
                                                fontWeight: "bold",
                                                marginLeft: "10px",
                                                borderRadius: "10px",
                                                marginLeft: 45,
                                                marginRight: 40,
                                                width: 135

                                             }} lg={2}>
                                                {chipData}

                                             </CCol>}
                                          </CRow>
                                             <CRow>
                                                <CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      Tare Weight<span style={{ color: "red" }}>*</span>
                                                   </CFormLabel>
                                                   <CFormInput
                                                      size="sm"
                                                      type="Name"
                                                      name="tareWeight"
                                                      disabled={allowManualEntry}
                                                      value={weighData.tareWeight}
                                                      onChange={handleInput}
                                                      placeholder="Enter Tare Weight.."
                                                      aria-label="default input example"
                                                      onInput={(e) => {
                                                         e.target.value = e.target.value.replace(
                                                            /[^0-9.-]/g,
                                                            ""
                                                         );
                                                      }} />
                                                   <p style={{ color: "red", fontSize: "x-small" }}>
                                                      {weighDataErr.tareWeight}
                                                   </p>
                                                </CCol><CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      Tare Date<span style={{ color: "red" }}>*</span>
                                                   </CFormLabel>
                                                   <input
                                                      type="datetime-local"
                                                      className="time-control"
                                                      id="datetimeInput"
                                                      value={dateTimeValue}
                                                      disabled={true}
                                                      onChange={handleDateTimeChange} />
                                                </CCol>
                                             </CRow>
                                             {isNotNullTareWeight && <CRow>
                                                <CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      Gross Weight<span style={{ color: "red" }}>*</span>
                                                   </CFormLabel>
                                                   <CFormInput
                                                      size="sm"
                                                      type="Name"
                                                      name="grossWeight"
                                                      disabled={allowManualEntry}
                                                      value={weighData.grossWeight}
                                                      onChange={handleInput}
                                                      placeholder="Enter Gross Weight.."
                                                      aria-label="default input example"
                                                      onInput={(e) => {
                                                         e.target.value = e.target.value.replace(
                                                            /[^0-9.-]/g,
                                                            ""
                                                         );
                                                      }}
                                                   />
                                                   <p style={{ color: "red", fontSize: "x-small" }}>
                                                      {weighDataErr.grossWeight}
                                                   </p>
                                                </CCol>

                                                <CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      Gross Date<span style={{ color: "red" }}>*</span>
                                                   </CFormLabel>
                                                   <input
                                                      type="datetime-local"
                                                      className="time-control"
                                                      id="datetimeInput"
                                                      value={dateTimeValue}
                                                      disabled={true}
                                                      onChange={handleDateTimeChange}
                                                   />
                                                   {/* <p style={{ color: "red", fontSize: "x-small" }}>
                                                        {weighDataErr.tareDate}
                                                    </p> */}
                                                </CCol>
                                                <CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      Net Weight in Kg<span style={{ color: "red" }}>*</span>
                                                   </CFormLabel>
                                                   <CFormInput
                                                      size="sm"
                                                      type="Name"
                                                      name="netWeightKg"
                                                      disabled={true}
                                                      value={weighData.grossWeight - weighData.tareWeight}
                                                      onChange={handleInput}
                                                      placeholder="Enter Net Weight.."
                                                      aria-label="default input example"
                                                   // onInput={(e) => {
                                                   //     e.target.value = e.target.value.replace(
                                                   //         /[^0-9.-]/g,
                                                   //         ""
                                                   //     );
                                                   // }}
                                                   />
                                                   <p style={{ color: "red", fontSize: "x-small" }}>
                                                      {weighDataErr.netWeightKg}
                                                   </p>
                                                </CCol>
                                                <CCol lg={6}>
                                                   <CFormLabel htmlFor="nf-email">
                                                      {/* Remarks<span style={{ color: "red" }}>*</span> */}
                                                   </CFormLabel>
                                                   <CFormInput
                                                      size="sm"
                                                      type="Name"
                                                      name="remarks"
                                                      value={weighData.remarks}
                                                      onChange={handleInput}
                                                      placeholder="Enter Remarks.."
                                                      aria-label="default input example"
                                                      onInput={(e) => {
                                                         e.target.value = e.target.value.replace(
                                                            /[^a-zA-Z\s]/g,
                                                            ""
                                                         );
                                                      }}
                                                   />
                                                   {/* <p style={{ color: "red", fontSize: "x-small" }}>
                                                            {weighDataErr.remarks}
                                                        </p> */}
                                                </CCol>
                                             </CRow>} <br />
                                             <div style={{ marginTop: "1vw" }}>
                                                {!generateSlipBtn ? (
                                                   <>
                                                      <CButton
                                                         style={{
                                                            border: 0,
                                                            backgroundColor: "#0e419d",
                                                            marginRight: "15px",
                                                         }}
                                                         target="_blank"
                                                         onClick={handleSubmit}
                                                      >
                                                         {isEditWeigh ? "Update" : "Save"}
                                                      </CButton>
                                                      <CButton
                                                         target="_blank"
                                                         style={{
                                                            border: 0,
                                                            backgroundColor: "lightslategrey",
                                                         }}
                                                         onClick={handleCancleWeigh}
                                                      >
                                                         Cancel
                                                      </CButton>
                                                   </>
                                                ) : (
                                                   <>
                                                      <CButton
                                                         style={{
                                                            border: 0,
                                                            backgroundColor: "#0e419d",
                                                         }}
                                                         target="_blank"
                                                         onClick={handleGenerateSlip}
                                                      >
                                                         Generate Slip
                                                      </CButton>
                                                   </>
                                                )}

                                             </div></>
                                       )}
                                 </CForm>
                              </div>
                           </div>
                        </Paper>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="weighbridge__table">
                        <div className="weighbridge__table__header">
                           <div className="weighbridge__table__header__section">
                              <input
                                 type="text"
                                 className="form-control"
                                 placeholder="Search"
                                 value={searchTerm}
                                 onChange={handleSearch}
                              />
                              <button
                                 disabled={!hasPermission("Create")}
                                 title={
                                    !hasPermission("Create")
                                       ? "No permission to Create"
                                       : ""
                                 }
                                 className={
                                    hasPermission("Create") ? "" : "disabled-button"
                                 }
                                 onClick={handleCreateWeigh}
                              >
                                 Add Weigh Bridge
                              </button>
                           </div>
                        </div>
                        <div
                           className="weighbridge__table__body"
                           style={{ height: "75vh", overflowY: "scroll" }}
                        >
                           {isLoading ? (
                              <Loader />
                           ) : (
                              <CTable
                                 columns={columns}
                                 items={items}
                                 hover
                                 className="striped-table"
                              />
                           )}
                        </div>
                     </div>
                  </>
               )
               }
            </div >
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
            {
               showConfirmModal1 && (
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
               )
            }
         </div >
         <CModal
            alignment="center"
            visible={generateSlip}
            size="xl"
            onClose={() => {
               setGenerateSlip(false);
               setErrorMessage('');
               window.location.reload();
            }}
         >
            <CModalHeader>
               <CModalTitle>Generate Weighbridge Slip</CModalTitle>
            </CModalHeader>

            <CModalBody>
               <div>
                  <div className="weighbridge_invoice">
                     <div className="weighbridge_invoice__header">
                        <div className="weighbridge_invoice__header__heading">
                           <p>GANGA DAIRY LTD.</p>
                        </div>
                        <div className="weighbridge_invoice__header__address">
                           <p>RAMJANPUR,BEGUSARAI(BIHAR)</p>
                        </div>
                        <div className="weighbridge_invoice__header__telephone">
                           <p>PH.NO:60243259101/259113</p>
                        </div>
                     </div>
                     <div className="weighbridge_invoice__date">
                        <div className="weighbridge_invoice__date__leftside">
                           <div className="weighbridge_invoice__date__leftside__weighbridge">
                              <p>RST No.:
                                 <br />
                                 Vehicle Type : {selectedVehicleDetails?.VehicleType}
                                 <br />
                                 Address : </p>
                           </div>
                        </div>
                        <div className="weighbridge_invoice__date__leftside"></div>
                        <div className="weighbridge_invoice__date__rightside">
                           <div className="weighbridge_invoice__date__rightside__weighbridge">
                              <p>Vehicle No.: {selectedVehicleDetails?.RegistrationNo}
                                 <br />
                                 Party Name: {weighData.contractorName}
                                 <br />
                                 Item : {weighData.productName}
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="weighbridge_invoice__date">
                        <div className="weighbridge_invoice__date__leftside">
                           <div className="weighbridge_invoice__date__leftside__weighbridge">
                              <p>Gross : {weighData.grossWeight} Kg
                                 <br />
                                 Tare : {weighData.tareWeight} Kg
                                 <br />
                                 Net : {weighData.grossWeight - weighData.tareWeight} Kg</p>
                           </div>
                        </div>
                        <div className="weighbridge_invoice__date__leftside">
                           <div className="weighbridge_invoice__date__leftside__weighbridge">
                              <p>Date : {moment(weighData.grossDate).format('YYYY-MM-DD')}
                                 <br />
                                 Date : {moment(weighData.tareDate).format('YYYY-MM-DD')}
                              </p>
                           </div>
                        </div>
                        <div className="weighbridge_invoice__date__rightside">
                           <div className="weighbridge_invoice__date__rightside__weighbridge">
                              <p>Time : {moment(weighData.grossDate).format('HH:mm:ss')}
                                 <br />
                                 Time :  {moment(weighData.grossDate).format('HH:mm:ss')}
                                 <br />

                              </p>
                           </div>
                           <div className="weighbridge_invoice__date__rightside__route">
                           </div>
                        </div>
                     </div>
                     <br />
                     {/* <div className="weighbridge_invoice__total">
                        <p>Charges</p>
                    </div> */}
                  </div>
               </div>
               <div style={{ padding: 10, alignSelf: "center" }}>
                  <CButton onClick={generatePDF} style={{ width: 100 }}>Download</CButton>
               </div>
            </CModalBody>
         </CModal>
      </>
   );
};

export default WeighBridge;