import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CFormSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import "./Product.scss";
import { CPagination, CPaginationItem } from "@coreui/react";
import {
  GetUser,
  GetProductMaster,
  GetProductSupply,
  GetProductSupplyIndent,
  CreateProductSupply,
  UpdateProductSupply,
  GetProductSupplyDispatch,
  UpdateProductSupplyDispatch,
  GetProductSupplyReceived,
  UpdateProductSupplyReceived,
  GetDropDownOrganization,
  GetAllAgents
} from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Paper } from "@mui/material";
import moment from "moment";
import Header from "../../../components/header/Header";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Loader from "../../../components/loader";
import IndentProducts from "./IndentProducts";
import IndenApprove from "./IndentApprove";
import IndentApprove from "./IndentApprove";
import IndentDispatch from "./IndentDispatch";
import Select from "react-select";

const productSupplyIndent = [
  {
    key: "IndentNo",
    label: "Indent No.",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Indent Raised On",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Requested By",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Status",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Indent Raised For",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Details",
    _props: { scope: "col" },
  },
]

const productSupplyColumn = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Indent Raised On",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Indent Product",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Indent Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Unit Price",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Indent",
    _props: { scope: "col" },
  },
];

const productSupplyDispatchColumn = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Indent Raised On",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Indent Product",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Indent Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Unit Price",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Purchase Indent no.",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Indent Approved By",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Approved On",
    _props: { scope: "col" },
  },
  {
    key: "heading_8",
    label: "Approved Qty",
    _props: { scope: "col" },
  },
  {
    key: "heading_9",
    label: "Payment Terms",
    _props: { scope: "col" },
  },
  {
    key: "heading_10",
    label: "Dispatch by",
    _props: { scope: "col" },
  },
  {
    key: "heading_11",
    label: "Dispatch Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_12",
    label: "Dispatch Date",
    _props: { scope: "col" },
  },
];

const productSupplyReceivedColumn = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Indent Raised On",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Indent Product",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Indent Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Unit Price",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Purchase Indent no.",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Indent Approved By",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Approved On",
    _props: { scope: "col" },
  },
  {
    key: "heading_8",
    label: "Approved Qty",
    _props: { scope: "col" },
  },
  {
    key: "heading_9",
    label: "Payment Terms",
    _props: { scope: "col" },
  },
  {
    key: "heading_10",
    label: "Dispatch by",
    _props: { scope: "col" },
  },
  {
    key: "heading_11",
    label: "Dispatch Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_12",
    label: "Dispatch Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_13",
    label: "Received by",
    _props: { scope: "col" },
  },
  {
    key: "heading_14",
    label: "Received Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_15",
    label: "Received Date",
    _props: { scope: "col" },
  },
];

const initialProductSupplyCreate = {
  indentRaisedBy: "",
  indentRaisedFor: "",
};

const initialProductSupply = {
  indentProductId: "",
  approvedOnDate: "",
  approvedQuantity: "",
  paymentTerms: "",
  purchaseIndentNo: "",
};

const initialProductSupplyDispatch = {
  indentProductId: "",
  dispatchByEmployee: "",
  dispatchQuantity: "",
  dispatchDate: "",
};

const initialProductSupplyReceived = {
  indentProductId: "",
  receivedQuantity: "",
};

const Product = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const productSupplyIndentItems = [];
  const productSupplyItems = [];
  const productSupplyDispatchItems = [];
  const productSupplyReceivedItems = [];

  const [searchTermProductSupply, setSearchTermProductSupply] = useState("");
  const [searchTermProductSupplyDispatch, setSearchTermProductSupplyDispatch] = useState("");
  const [searchTermProductSupplyReceived, setSearchTermProductSupplyReceived] = useState("");

  const [isCreateProductSupply, setIsCreateProductSupply] = useState(false);
  const [isCreateProductSupplyDispatch, setIsCreateProductSupplyDispatch] = useState(false);
  const [isCreateProductSupplyReceived, setIsCreateProductSupplyReceived] = useState(false);

  const [isEditProductSupply, setIsEditProductSupply] = useState(false);
  const [isEditProductSupplyDispatch, setIsEditProductSupplyDispatch] = useState(false);
  const [isEditProductSupplyReceived, setIsEditProductSupplyReceived] = useState(false);

  const [productMasterTableData, setProductMasterTableData] = useState([]);

  const [productSupplyCreateData, setProductSupplyCreateData] = useState(initialProductSupplyCreate);
  const [productSupplyCreateDataErr, setProductSupplyCreateDataErr] = useState(initialProductSupplyCreate);

  const [productSupplyData, setProductSupplyData] = useState(initialProductSupply);
  const [productSupplyDataErr, setProductSupplyDataErr] = useState(initialProductSupply);

  const [productSupplyDispatchData, setProductSupplyDispatchData] = useState(initialProductSupplyDispatch);
  const [productSupplyDispatchDataErr, setProductSupplyDispatchDataErr] = useState(initialProductSupplyDispatch);
  const [userData, setUserData] = useState([]);

  const [productSupplyReceivedData, setProductSupplyReceivedData] = useState(initialProductSupplyDispatch);
  const [productSupplyReceivedDataErr, setProductSupplyReceivedDataErr] = useState(initialProductSupplyReceived);

  const [alertText, setAlertText] = useState("");
  const [showOkModalSupply, setShowOkModalSupply] = useState(false);
  const [showOkModalSupplyCreate, setShowOkModalSupplyCreate] = useState(false);

  const [showConfirmModalSupplyCreate, setShowConfirmModalSupplyCreate] = useState(false);
  const [showConfirmModalSupply, setShowConfirmModalSupply] = useState(false);

  const [showOkModalSupplyDispatch, setShowOkModalSupplyDispatch] = useState(false);
  const [showOkModalSupplyReceived, setShowOkModalSupplyReceived] = useState(false);

  const [showConfirmModalSupplyDispatch, setShowConfirmModalSupplyDispatch] = useState(false);
  const [showConfirmModalSupplyReceived, setShowConfirmModalSupplyReceived] = useState(false);
  const [isId, setIsId] = useState();

  const [productSupplyTableData, setProductSupplyTableData] = useState([]);
  const [productSupplyDispatchTableData, setProductSupplyDispatchTableData] = useState([]);
  const [productSupplyReceivedTableData, setProductSupplyReceivedTableData] = useState([]);


  const [filteredProductSupplyIndent, setFilteredProductSupplyIndent] = useState([]);
  const [filteredProductSupply, setFilteredProductSupply] = useState([]);
  const [filteredProductSupplyDispatch, setFilteredProductSupplyDispatch] = useState([]);
  const [filteredProductSupplyReceived, setFilteredProductSupplyReceived] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const [dropdownOrganization, setDropdownOrganization] = useState([]);

  const navigate = useNavigate();

  const [isIndentProducts, setIsIndentProducts] = useState(false);
  const [selectedIndentId, setSelectedIndentId] = useState(null);

  const [allAgentDropdownData, setAllAgentDropdownData] = useState([]);

  const handleIndentProducts = (id, orgId) => {
    localStorage.setItem("selectedProductSupply", id);
    localStorage.setItem("selectedorgUnitId", orgId);
    setSelectedIndentId(id);
    setIsIndentProducts(true);
  };

  const orgType = 5;
  useEffect(() => {
    getDropdownOrganization();
  }, [orgType]);

  const getDropdownOrganization = () => {
    GetDropDownOrganization((res) => {
      setDropdownOrganization(res.data);
    }, orgType);
  };

  const orgUnitType = 5;
  useEffect(() => {
    getOrganizationData();
  }, [orgUnitType]);

  const getOrganizationData = () => {
    setIsLoading(true);
    GetAllAgents(
      (res) => {
        setAllAgentDropdownData(res.data);
      },
      orgUnitType,
    );
  };

  // console.log('all agent data->', allAgentDropdownData);

  useEffect(() => {
    getProductMaster();
  }, []);

  const getProductMaster = () => {
    setIsLoading(true); // Show the loading spinner
    GetProductMaster((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setProductMasterTableData(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowOkModalSupplyCreate(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModalSupplyCreate(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowOkModalSupplyCreate(false);
        setAlertText("Something wrong happened in API");
        setShowConfirmModalSupplyCreate(true);
        setIsLoading(false);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModalSupplyCreate(true);
        setSessionOk(true);
      }
    });
  };

  let indentStatus = 1;

  useEffect(() => {
    getProductSupplyIndent()
  }, [indentStatus])

  const getProductSupplyIndent = () => {
    setIsLoading(true); // Show the loading spinner
    GetProductSupplyIndent((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setProductSupplyTableData(data);
        setFilteredProductSupplyIndent(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowOkModalSupply(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModalSupply(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowOkModalSupply(false);
        setAlertText("Something wrong happened in API");
        setShowConfirmModalSupply(true);
        setIsLoading(false);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModalSupply(true);
        setSessionOk(true);
      }
    }, indentStatus);
  };

  const getProductSupplyDispatch = () => {
    setIsLoading(true); // Show the loading spinner
    GetProductSupplyDispatch((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setProductSupplyDispatchTableData(data);
        setFilteredProductSupplyDispatch(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowOkModalSupplyDispatch(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModalSupplyDispatch(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowOkModalSupplyDispatch(false);
        setAlertText("Something wrong happened in API");
        setShowConfirmModalSupplyDispatch(true);
        setIsLoading(false);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModalSupplyDispatch(true);
        setSessionOk(true);
      }
    });
    // console.log(productSupplyDispatchTableData);
  };

  const getProductSupplyReceived = () => {
    setIsLoading(true); // Show the loading spinner
    GetProductSupplyReceived((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setProductSupplyReceivedTableData(data);
        setFilteredProductSupplyReceived(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowOkModalSupplyReceived(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModalSupplyReceived(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowOkModalSupplyReceived(false);
        setAlertText("Something wrong happened in API");
        setShowConfirmModalSupplyReceived(true);
        setIsLoading(false);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModalSupplyReceived(true);
        setSessionOk(true);
      }
    });
    // console.log(productSupplyReceivedTableData);
  };

  const getUser = () => {
    GetUser((res) => {
      const { status, data } = res;
      if (status === 200) {
        setUserData(data);
      }
    });
  };

  useEffect(() => {
    filterProductSupplyData();
  }, [searchTermProductSupply]);

  useEffect(() => {
    filterProductSupplyDispatchData();
  }, [searchTermProductSupplyDispatch]);

  useEffect(() => {
    filterProductSupplyReceivedData();
  }, [searchTermProductSupplyReceived]);

  const filterProductSupplyData = () => {
    if (searchTermProductSupply === "") {
      setFilteredProductSupply(productSupplyTableData);
    } else {
      const filteredProductSupply = productSupplyTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTermProductSupply.toLowerCase())
        )
      );
      setFilteredProductSupply(filteredProductSupply);
    }
  };

  const filterProductSupplyDispatchData = () => {
    if (searchTermProductSupplyDispatch === "") {
      setFilteredProductSupplyDispatch(productSupplyDispatchTableData);
    } else {
      const filteredProductSupplyDispatch =
        productSupplyDispatchTableData.filter((item) =>
          Object.values(item).some(
            (value) =>
              value !== null &&
              value
                .toString()
                .toLowerCase()
                .includes(searchTermProductSupplyDispatch.toLowerCase())
          )
        );
      setFilteredProductSupply(filteredProductSupplyDispatch);
    }
  };

  const filterProductSupplyReceivedData = () => {
    if (searchTermProductSupplyReceived === "") {
      setFilteredProductSupplyReceived(productSupplyReceivedTableData);
    } else {
      const filteredProductSupplyReceived =
        productSupplyReceivedTableData.filter((item) =>
          Object.values(item).some(
            (value) =>
              value !== null &&
              value
                .toString()
                .toLowerCase()
                .includes(searchTermProductSupplyReceived.toLowerCase())
          )
        );
      setFilteredProductSupply(filteredProductSupplyReceived);
    }
  };

  {
    filteredProductSupplyIndent?.map((val, ind) => {
      const indentStatusMapping = {
        1: 'Indent Placed',
        2: 'Approved',
        3: 'Rejected',
        4: 'Dispatched',
        5: 'Received'
      };

      productSupplyIndentItems.push({
        IndentNo: ind + 1,
        id: val?.id,
        heading_1: moment(val?.indentRaisedOnDate).format("YYYY-MM-DD") ?? "--",
        heading_2: val?.indentRaisedBy ? val?.indentRaisedBy.Name : "--",
        heading_3: indentStatusMapping[val?.indentStatus] || '--',
        heading_4: val?.indentRaisedFor?.Name ? val?.indentRaisedFor?.Name : "--",
        heading_5: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link to={`/indent-products`}>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  handleIndentProducts(val?.id, val?.indentRaisedFor.Id);
                }}
              >
                Products
              </span>
            </Link>
          </div>
        ),
      });
    });
  }

  {
    filteredProductSupply?.map((val, ind) => {
      // console.log('val', val);
      productSupplyItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: moment(val?.indentRaisedOnDate).format("YYYY-MM-DD") ?? "--",
        heading_2: val?.indentProductId ? val?.indentProductId.ProductName : "--",
        heading_3: val?.indentQuantity ? val?.indentQuantity : "--",
        heading_4: val?.unitPrice ? val?.unitPrice : "--",
        heading_5: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                handleCreateProductSupply();
              }}
            >
              Details
            </button>
          </div>
        ),
      });
    });
  }

  {
    filteredProductSupplyDispatch?.map((val, ind) => {
      productSupplyDispatchItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: moment(val?.indentRaisedOnDate).format("YYYY-MM-DD") ?? "--",
        heading_2: val?.indentProductId ? val?.indentProductId.ProductName : "--",
        heading_3: val?.indentQuantity ? val?.indentQuantity : "--",
        heading_4: val?.unitPrice ? val?.unitPrice : "--",
        heading_5: val?.purchaseIndentNo ? val?.purchaseIndentNo : "--",
        heading_6: val?.indentApprovedBy ? val?.indentApprovedBy.Name : "--",
        heading_7: moment(val?.approvedOnDate).format("YYYY-MM-DD") ?? "--",
        heading_8: val?.approvedQuantity ? val?.approvedQuantity : "--",
        heading_9: val?.paymentTerms ? val?.paymentTerms : "--",
        heading_10: val?.dispatchByEmployee ? val?.dispatchByEmployee.Name : "--",
        heading_11: val?.dispatchQuantity ? val?.dispatchQuantity : "--",
        heading_12: moment(val?.dispatchDate).format("YYYY-MM-DD") ?? "--",
      });
    });
  }

  {
    filteredProductSupplyReceived?.map((val, ind) => {
      productSupplyReceivedItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: moment(val?.indentRaisedOnDate).format("YYYY-MM-DD") ?? "--",
        heading_2: val?.indentProductId ? val?.indentProductId.ProductName : "--",
        heading_3: val?.indentQuantity ? val?.indentQuantity : "--",
        heading_4: val?.unitPrice ? val?.unitPrice : "--",
        heading_5: val?.purchaseIndentNo ? val?.purchaseIndentNo : "--",
        heading_6: val?.indentApprovedBy ? val?.indentApprovedBy.Name : "--",
        heading_7: moment(val?.approvedOnDate).format("YYYY-MM-DD") ?? "--",
        heading_8: val?.approvedQuantity ? val?.approvedQuantity : "--",
        heading_9: val?.paymentTerms ? val?.paymentTerms : "--",
        heading_10: val?.dispatchByEmployee ? val?.dispatchByEmployee.Name : "--",
        heading_11: val?.dispatchQuantity ? val?.dispatchQuantity : "--",
        heading_12: moment(val?.dispatchDate).format("YYYY-MM-DD") ?? "--",
        heading_13: val?.receivedByUserId ? val?.receivedByUserId.Name : "--",
        heading_14: val?.receivedQuantity ? val?.receivedQuantity : "--",
        heading_15: moment(val?.receivedOn).format("YYYY-MM-DD") ?? "--",
      });
    });
  }

  const handleSearchProductSupply = (event) => {
    setSearchTermProductSupply(event.target.value);
  };

  const handleCreateProductSupply = () => {
    setIsCreateProductSupply(!isCreateProductSupply);
    getUser();
    setIsEditProductSupply(false);
  };

  const handleCancleProductSupplyCreate = () => {
    clearProductSupplyCreate();
  };

  const handleDropDownIndentCreate = (name, value) => {
    setProductSupplyCreateData((prev) => ({ ...prev, [name]: value }));
    setProductSupplyCreateDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const clearProductSupplyCreate = () => {
    setProductSupplyCreateData(initialProductSupplyCreate);
    // console.log(productSupplyCreateData);
  };

  const handleConfirmProductSupplyCreate = () => {
    setShowConfirmModalSupplyCreate(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleConfirmProductSupply = () => {
    setShowConfirmModalSupply(false);
    setIsCreateProductSupply(isCreateProductSupply);
    setIsEditProductSupply(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleConfirmProductSupplyDispatch = () => {
    setShowConfirmModalSupplyDispatch(false);
    setIsCreateProductSupplyDispatch(isCreateProductSupplyDispatch);
    setIsEditProductSupplyDispatch(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleConfirmProductSupplyReceived = () => {
    setShowConfirmModalSupplyReceived(false);
    setIsCreateProductSupplyReceived(isCreateProductSupplyReceived);
    setIsEditProductSupplyReceived(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const validateProductSupply = () => {
    let errObj = { ...initialProductSupplyCreate };

    if (!productSupplyCreateData.indentRaisedBy) {
      errObj.indentRaisedBy = "This field is required";
    } else if (productSupplyCreateData.indentRaisedBy == 0) {
      errObj.indentRaisedBy = "This field is required";
    } else {
      errObj.indentRaisedBy = "";
    }

    if (!productSupplyCreateData.indentRaisedFor) {
      errObj.indentRaisedFor = "This field is required";
    } else if (productSupplyCreateData.indentRaisedFor == 0) {
      errObj.indentRaisedFor = "This field is required";
    } else {
      errObj.indentRaisedFor = "";
    }

    setProductSupplyCreateDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const submitProductSupplyCreate = () => {
    // console.log(validateProductSupply());
    const payload = {
      indentRaisedBy: productSupplyCreateData.indentRaisedBy,
      indentRaisedFor: productSupplyCreateData.indentRaisedFor
    };
    if (validateProductSupply()) {
      CreateProductSupply((res) => {
        let { status, message } = res;
        if (status === 200) {
          getProductSupplyIndent();
          setAlertText(message);
          setProductSupplyCreateData(initialProductSupplyCreate);
          setProductSupplyCreateDataErr(initialProductSupplyCreate);
          setShowConfirmModalSupplyCreate(true);
          clearProductSupplyCreate();
        } else if (status === 403) {
          setShowOkModalSupplyCreate(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModalSupplyCreate(true);
          setIsLoading(false);
        } else if (status === 500) {
          setShowOkModalSupplyCreate(false);
          setAlertText("Something wrong happened in API");
          setShowConfirmModalSupplyCreate(true);
          setIsLoading(false);
        } else if (message.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModalSupplyCreate(true);
          setSessionOk(true);
        }
      }, payload);
      // console.log(payload);
    }

  };


  return (
    <>
      {token ? (
        <>
          {isIndentProducts ? <CButton style={{ position: 'absolute', right: 10, top: 50 }} onClick={() => setIsIndentProducts(!isIndentProducts)}>Back</CButton> : null}
          {isIndentProducts ? (<IndentProducts selectedIndentId={selectedIndentId} />) :
            (
              <div className="product">
                <div className="product__container">
                  <div className="product__header">
                    <div className="product__header__section">
                      <div className="product__header__section__main">
                        <h5>Company: Verka</h5>
                        <h4>{`Indent`}</h4>
                      </div>
                      <div className="product__header__section__bottom">
                        <Header />
                      </div>
                    </div>
                  </div>
                  <Tabs>
                    <TabList>
                      <Tab>Indent Create</Tab>
                      <Tab>Indent Approve</Tab>
                      <Tab>Indent Dispatch</Tab>
                    </TabList>

                    <TabPanel>
                      <>
                        <div className="Cbody">
                          <Paper elevation={3}>
                            <div className="container">
                              <br></br>
                              <div>
                                <CForm method="post">
                                  <CRow>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Indent Requested by{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>
                                      <CFormSelect
                                        size="sm"
                                        value={productSupplyCreateData.indentRaisedBy}
                                        onChange={(e) => {
                                          handleDropDownIndentCreate(
                                            "indentRaisedBy",
                                            e.target.value
                                          );
                                        }}
                                      >
                                        <option value={0}>
                                          Select Organization
                                        </option>
                                        {dropdownOrganization?.length &&
                                          dropdownOrganization?.map(
                                            (option, index) => {
                                              return (
                                                <option key={index} value={option.id}>
                                                  {option.name}
                                                </option>
                                              );
                                            }
                                          )}
                                      </CFormSelect>
                                      <span style={{ color: "red", fontSize: "x-small" }}>
                                        {productSupplyCreateDataErr.indentRaisedBy}
                                      </span>
                                    </CCol>

                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Indent Requested for{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>
                                      <Select
                                        options={allAgentDropdownData}
                                        value={allAgentDropdownData?.find(
                                          (option) =>
                                            option.id === productSupplyCreateData.indentRaisedFor
                                        )}
                                        onChange={(selectedOption) =>
                                          handleDropDownIndentCreate(
                                            "indentRaisedFor", selectedOption?.id
                                          )
                                        }
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        isSearchable
                                        placeholder="Select Agent"
                                        menuPortalTarget={document.body}
                                        styles={{
                                          control: (provided, state) => ({
                                            ...provided,
                                            height: '32px',
                                            minHeight: '32px',
                                          }),
                                        }}
                                      />
                                      <span style={{ color: "red", fontSize: "x-small" }}>
                                        {productSupplyCreateDataErr.indentRaisedFor}
                                      </span>
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
                                      onClick={submitProductSupplyCreate}
                                    >
                                      Save
                                    </CButton>
                                    <CButton
                                      target="_blank"
                                      style={{
                                        border: 0,
                                        backgroundColor: "lightslategrey",
                                      }}
                                      onClick={handleCancleProductSupplyCreate}
                                    >
                                      Cancel
                                    </CButton>
                                  </div>
                                </CForm>
                              </div>
                            </div>
                          </Paper>
                        </div>
                        <div className="product__table">
                          <div className="product__table__header">
                            <div className="product__table__header__section">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={searchTermProductSupply}
                                onChange={handleSearchProductSupply}
                              />
                            </div>
                          </div>
                          <div
                            className="product__table__body"
                            style={{ height: "50vh", overflowY: "scroll" }}
                          >
                            {isLoading ? (
                              <Loader />
                            ) : (
                              <CTable
                                columns={productSupplyIndent}
                                items={productSupplyIndentItems}
                                hover
                                className="striped-table"
                              />
                            )}
                          </div>
                        </div>
                      </>

                    </TabPanel>
                    <TabPanel>
                      <IndentApprove />
                    </TabPanel>
                    <TabPanel>
                      <IndentDispatch />
                    </TabPanel>
                  </Tabs>
                </div>

                {showConfirmModalSupplyCreate && (
                  <Confirm
                    buttonText={"OK"}
                    isCancelRequired={false}
                    confirmTitle={alertText}
                    onConfirm={() => {
                      handleConfirmProductSupplyCreate();
                    }}
                    onCancel={() => {
                      setShowConfirmModalSupplyCreate(false);
                      setSessionOk(true);
                    }}
                  />
                )}

                {showConfirmModalSupply && (
                  <Confirm
                    buttonText={"OK"}
                    isCancelRequired={false}
                    confirmTitle={alertText}
                    onConfirm={() => {
                      handleConfirmProductSupply();
                    }}
                    onCancel={() => {
                      setShowConfirmModalSupply(false);
                      setSessionOk(true);
                    }}
                  />
                )}

                {showConfirmModalSupplyDispatch && (
                  <Confirm
                    buttonText={"OK"}
                    isCancelRequired={false}
                    confirmTitle={alertText}
                    onConfirm={() => {
                      handleConfirmProductSupplyDispatch();
                    }}
                    onCancel={() => {
                      setShowConfirmModalSupplyDispatch(false);
                      setSessionOk(true);
                    }}
                  />
                )}

                {showConfirmModalSupplyReceived && (
                  <Confirm
                    buttonText={"OK"}
                    isCancelRequired={false}
                    confirmTitle={alertText}
                    onConfirm={() => {
                      handleConfirmProductSupplyReceived();
                    }}
                    onCancel={() => {
                      setShowConfirmModalSupplyReceived(false);
                      setSessionOk(true);
                    }}
                  />
                )}
              </div>
            )
          }</>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default Product;
