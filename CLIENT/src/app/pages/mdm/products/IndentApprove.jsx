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
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import "./Product.scss";
import { CPagination, CPaginationItem } from "@coreui/react";
import {
  GetUser,
  GetProductMaster,
  GetProductSupplyIndent,
  UpdateProductSupply,
  GetProductSupplyDispatch,
  GetDropDownOrganization,
  GetIndentProducts,
  GetProductSupply,
  UpdateIndentProducts,
  UpdateProductSupplyIndent,
  GetIndentPlacedProductSupplyIndent
} from "../../../utils/apiCalls";
import "react-tabs/style/react-tabs.css";
import { Paper } from "@mui/material";
import moment from "moment";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Loader from "../../../components/loader";
import Confirm from "../../../components/confirmModal/confirm";

const productSupplyColumn = [
  // {
  //   key: "SlNo",
  //   label: "#",
  //   _props: { scope: "col" },
  // },
  {
    key: "heading_1",
    label: "Indent Raised For",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Indent Raised On",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Requested By",
    _props: { scope: "col" },
  },
  {
    key: "status",
    label: "Indent Status",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "      ",
    _props: { scope: "col" },
  },
];

const indentedProducts = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Product Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Available Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Rate",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Requested Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Approved Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Action",
    _props: { scope: "col" },
  },
];


const initialProductSupply = {
  id: "",
  approvedOnDate: new Date(),
  approvedQuantity: "",
  rejectReason: "",
  indentApprovedBy: null,
  indentRejectedBy: null,
  indentStatus: null,
};

const initialProductSupplyErr = {
  id: "",
  indentApprovedBy: null,
  indentRejectedBy: null,
};

const IndentApprove = () => {

  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const productSupplyIndentItems = [];
  const productApproveItems = [];

  const [searchTermProductSupply, setSearchTermProductSupply] = useState("");

  const [isCreateProductSupply, setIsCreateProductSupply] = useState(false);

  const [isEditProductSupply, setIsEditProductSupply] = useState(false);
  const [savedItems, setSavedItems] = useState([]);

  const [productMasterTableData, setProductMasterTableData] = useState([]);

  const [approvedQuantities, setApprovedQuantities] = useState();
  const [productSupplyData, setProductSupplyData] = useState(initialProductSupply);
  const [productSupplyDataErr, setProductSupplyDataErr] = useState(initialProductSupply);

  const [alertText, setAlertText] = useState("");
  const [showOkModalSupply, setShowOkModalSupply] = useState(false);
  const [showOkModalSupplyCreate, setShowOkModalSupplyCreate] = useState(false);

  const [showConfirmModalSupplyCreate, setShowConfirmModalSupplyCreate] = useState(false);
  const [showConfirmModalSupply, setShowConfirmModalSupply] = useState(false);
  const [isId, setIsId] = useState();

  const [productSupplyTableData, setProductSupplyTableData] = useState([]);
  const [dropdownOrganization, setDropdownOrganization] = useState([]);

  const [filteredProductSupplyIndent, setFilteredProductSupplyIndent] = useState([]);
  const [filteredProductToApprove, setFilteredProductToApprove] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModalApprove, setShowConfirmModalApprove] = useState(false);


  const navigate = useNavigate();

  const [isIndentProducts, setIsIndentProducts] = useState(false);
  const [selectedIndentId, setSelectedIndentId] = useState(null);
  const [approvedQuantitiesArray, setApprovedQuantitiesArray] = useState([]);

  const handleIndentProducts = (id) => {
    localStorage.setItem("selectedProductSupply", id);
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

  useEffect(() => {
    getProductSupplyIndent()
  }, [])
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
      }
      else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModalSupply(true);
        setSessionOk(true);
      }
    },);
  };

  const handleInputProductSupply = (e) => {
    const { name, value } = e.target;
    setProductSupplyData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProductSupplyDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleInputProductApprove = (e, index) => {
    const { value } = e.target;
    const updatedQuantities = [...approvedQuantitiesArray];
    updatedQuantities[index] = value;
    setApprovedQuantitiesArray(updatedQuantities);
  };

  const submitProductApprove = (id, index) => {
    const payload = {
      approvedQty: approvedQuantitiesArray[index]
    };
    payload.id = id;
    // console.log(payload);
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
        heading_1: val?.indentRaisedFor ? val?.indentRaisedFor?.Name : "--",
        heading_2: moment(val?.indentRaisedOnDate).format("YYYY-MM-DD") ?? "--",
        heading_3: val?.indentRaisedBy ? val?.indentRaisedBy.Name : "--",
        status: indentStatusMapping[val?.indentStatus] || " ",
        heading_4: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link to={`/indent-products`}>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  handleIndentProducts(val?.id);
                }}
              >
                View
              </span>
            </Link>
          </div>
        ),
      });
    });
  }

  useEffect(() => {
    // Initialize approvedQuantitiesArray with default values
    const initialQuantities = Array(filteredProductToApprove.length).fill("");
    setApprovedQuantitiesArray(initialQuantities);
  }, [filteredProductToApprove]);

  {
    filteredProductToApprove?.map((val, ind) => {
      productApproveItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.productId ? val?.productId.ProductName : "--",
        heading_2: val?.availableQty ? val?.availableQty : "--",
        heading_3: val?.rate ? val?.rate : "--",
        heading_4: val?.requestedQty ? val?.requestedQty : "--",
        heading_5: (
          <CFormInput
            size="sm"
            type="name"
            value={approvedQuantities}
            onChange={(e) => handleInputProductApprove(e, ind)}
            name="approvedQty"
            placeholder="Enter Approved Qty.."
            onInput={(e) => {
              e.target.value = e.target.value.replace(
                /[^0-9.-]/g,
                ""
              );
            }}
          />
        ),
        heading_6: (
          <CButton
            style={{
              border: 0,
              backgroundColor: "#0e419d",
              "marginRight": "15px",
            }}
            disabled={savedItems.includes(val.id)}
            target="_blank"
            onClick={() => {
              indentProductSubmit(val?.id, ind)
              setSavedItems([...savedItems, val.id]);
              // console.log(val.id)
            }}
          >
            Save
          </CButton>
        )
      });
    });
  }


  const handleSearchProductSupply = (event) => {
    setSearchTermProductSupply(event.target.value);
  };


  const handleCancleProductSupply = () => {
    setIsCreateProductSupply(!isCreateProductSupply);
    clearProductSupply();
    setIsEditProductSupply(false);
    setDisplayTable(false);
    setSelectedIndentId(null);
  };


  const handleDropDownIndent = (name, value) => {
    setProductSupplyData((prev) => ({ ...prev, [name]: value }));
    setProductSupplyDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedIndentId(value);
  };

  useEffect(() => {
    getIndentProductsToApprove();
  }, [selectedIndentId]);
  // console.log('selectedIndentId: ', selectedIndentId);

  const [indentProductsTableData, setIndentProductsTableData] = useState([]);
  // console.log('indent data ', indentProductsTableData);
  const [displayTable, setDisplayTable] = useState(false);
  const getIndentProductsToApprove = () => {
    GetIndentProducts((res) => {
      let { status, data, message } = res;
      // console.log('res: ', res);
      if (data?.length !== 0) {
        setDisplayTable(true);
      }
      if (status === 200) {
        setIndentProductsTableData(data);
        setFilteredProductToApprove(data);
      } else if (status === 403) {
        setAlertText("You don't have access to perform this operation");
      } else if (status === 500) {
        setAlertText("Something wrong happened in API");
        setIsLoading(false);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setSessionOk(true);
      }
    }, selectedIndentId);
  };


  const clearProductSupply = () => {
    setProductSupplyData(initialProductSupply);
    setIsId(null);
  };

  const validateProductSupply = () => {
    let errObj = { ...initialProductSupplyErr };

    if (!productSupplyData.id) {
      errObj.id = "This field is required";
    } else if (productSupplyData.id == 0) {
      errObj.id = "This field is required";
    } else {
      errObj.id = "";
    }

    if (approveChecked) {
      if (!productSupplyData.indentApprovedBy) {
        errObj.indentApprovedBy = "This field is required";
      } else if (productSupplyData.indentApprovedBy == 0) {
        errObj.indentApprovedBy = "This field is required";
      } else {
        errObj.indentApprovedBy = "";
        errObj.indentRejectedBy = "";
      }
    } else {
      if (!productSupplyData.indentRejectedBy) {
        errObj.indentRejectedBy = "This field is required";
      } else if (productSupplyData.indentRejectedBy == 0) {
        errObj.indentRejectedBy = "This field is required";
      } else {
        errObj.indentRejectedBy = "";
        errObj.indentApprovedBy = "";
      }
    }
    // console.log(errObj);

    setProductSupplyDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };


  const submitProductSupply = () => {
    // console.log(validateProductSupply());
    let status;
    if (approveChecked) {
      status = 2;
    } else {
      status = 3;
    }
    const payload = {
      id: productSupplyData.id,
      indentRaisedBy: productSupplyData.indentRaisedBy,
      indentApprovedBy: productSupplyData.indentApprovedBy,
      indentRejectedBy: productSupplyData.indentRejectedBy,
      indentStatus: status,
      rejectReason: productSupplyData.rejectReason
    };
    payload.id = payload.id;
    // console.log("validate status:  ",validateProductSupply())
    if (validateProductSupply()) {
      UpdateProductSupplyIndent((res) => {
        let { status, message } = res;
        if (status === 200) {
          getProductSupplyIndent();
          setIsId(null);
          getIndentList();
          setIsCreateProductSupply(!isCreateProductSupply);
          setAlertText("Indent Approved Successfully");
          setProductSupplyData(initialProductSupply);
          setProductSupplyDataErr(initialProductSupply);
          setShowConfirmModalApprove(true);
          setIsEditProductSupply(false);
        } else if (status === 403) {
          setShowOkModalSupply(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModalApprove(true);
          setIsLoading(false);
        } else if (status === 500) {
          setShowOkModalSupply(false);
          setAlertText("Something wrong happened in API");
          setShowConfirmModalApprove(true);
          setIsLoading(false);
        } else if (message.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModalApprove(true);
          setSessionOk(true);
        }
      }, payload);
      // console.log(payload);
      setDisplayTable(false);
    }
  };

  const indentProductSubmit = (id, index) => {
    // console.log(validateProductSupply());
    const payload = {
      approvedQty: approvedQuantitiesArray[index],
    };
    payload.id = id
    UpdateIndentProducts((res) => {
      let { status, message } = res;
      if (status === 200) {
        // getProductSupplyIndent();
        setAlertText("Indent Product Updated Successfully");
        setIsId(null);
      } else if (status === 500) {
        setShowOkModalSupply(false);
        setAlertText("Something wrong happened in API");
        setIsLoading(false);
      }
    }, payload);
    // console.log(payload);
  };

  const [isApproved, setIsApproved] = useState(true);
  const [isRejected, setIsRejected] = useState(false);
  const [approveChecked, setApproveChecked] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const handleCheckApprove = () => {
    const checkBox = document.getElementById("approve");
    setApproveChecked(!approveChecked);
    setIsRejected(false);
    setIsApproved(true);
  }

  const handleCheckReject = () => {
    const checkBox = document.getElementById("reject");
    setIsRejected(true);
    setIsApproved(false);
    setApproveChecked(false);
  }

  let indentStatus = 1;
  useEffect(() => {
    getIndentList();
  }, [indentStatus])
  const [indentList, setIndentList] = useState([])
  const getIndentList = () => {
    // console.log('indentList->', indentList);
    GetIndentPlacedProductSupplyIndent((res) => {
      setIndentList(res.data);
    }, indentStatus)
  }

  return (
    // <>{isCreateProductSupply ? (
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
                      Indent Product{" "}
                      <span style={{ color: "red" }}>*</span>
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="indentProductId"
                      value={productSupplyData.id}
                      onChange={(e) => {
                        handleDropDownIndent(
                          "id",
                          e.target.value
                        );
                      }}
                    >
                      <option value={0}>
                        Select Product Indent
                      </option>
                      {/* {console.log(productSupplyTableData)} */}
                      {indentList?.length &&
                        indentList?.map(
                          (option, index) => {
                            return (
                              <option
                                key={index}
                                value={option.id}
                              >
                                {`Indent Raised by ${option.indentRaisedBy?.Name
                                  } on ${moment(
                                    option.indentRaisedOnDate
                                  ).format("YYYY-MM-DD")}`}
                              </option>
                            );
                          }
                        )}
                    </CFormSelect>
                    <span style={{ color: "red", fontSize: "x-small" }}>
                      {productSupplyDataErr.id}
                    </span>
                  </CCol>
                  <CCol lg={1}></CCol>
                  <CCol lg={2}>
                    <CFormLabel></CFormLabel>
                    <CFormCheck id="approve" label="Approve" onClick={handleCheckApprove} defaultChecked={approveChecked} />
                  </CCol>
                  <CCol lg={2}>
                    <CFormLabel></CFormLabel>
                    <CFormCheck id="reject" label="Reject" onClick={handleCheckReject} defaultChecked={!approveChecked} />
                  </CCol>
                  <CCol lg={1}></CCol>

                  {isApproved && (<CCol lg={6}>
                    <CFormLabel htmlFor="nf-email">
                      Approved By{" "}
                      <span style={{ color: "red" }}>*</span>
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="indentApprovedBy"
                      value={productSupplyData.indentApprovedBy}
                      onChange={(e) => {
                        setProductSupplyData((prev) => ({ ...prev, 'indentApprovedBy': e.target.value }));
                      }}
                    >
                      <option value={0}>
                        Select Organization
                      </option>
                      {dropdownOrganization?.length &&
                        dropdownOrganization?.map(
                          (option, index) => {
                            return (
                              <option
                                key={index}
                                value={option.id}
                              >
                                {option?.name}
                              </option>
                            );
                          }
                        )}
                    </CFormSelect>
                    <span style={{ color: "red", fontSize: "x-small" }}>
                      {productSupplyDataErr.indentApprovedBy}
                    </span>
                  </CCol>)}
                  {isRejected && <><CCol lg={6}>
                    <CFormLabel htmlFor="nf-email">
                      Rejected By{" "}
                      <span style={{ color: "red" }}>*</span>
                    </CFormLabel>
                    <CFormSelect
                      size="sm"
                      name="indentRejectedBy"
                      value={productSupplyData.indentRejectedBy}
                      onChange={(e) => {
                        setProductSupplyData((prev) => ({ ...prev, 'indentRejectedBy': e.target.value }));
                      }}
                    >
                      <option value={0}>
                        Select Organization Unit
                      </option>
                      {dropdownOrganization?.length &&
                        dropdownOrganization?.map(
                          (option, index) => {
                            return (
                              <option
                                key={index}
                                value={option.id}
                              >
                                {option?.name}
                              </option>
                            );
                          }
                        )}
                    </CFormSelect>
                    <span style={{ color: "red", fontSize: "x-small" }}>
                      {productSupplyDataErr.indentRejectedBy}
                    </span>
                  </CCol>

                    <CCol lg={6}>
                      <CFormLabel htmlFor="nf-email">
                        Reason
                      </CFormLabel>

                      <CFormInput
                        size="sm"
                        type="name"
                        value={productSupplyData.reason}
                        onChange={handleInputProductSupply}
                        name="rejectReason"
                        placeholder="Reason of rejection"
                      />
                    </CCol></>}
                </CRow>
                <br />
                {displayTable && <CTable
                  columns={indentedProducts}
                  items={productApproveItems}
                  hover
                  className="striped-table"
                />}
                <div style={{ marginTop: "1vw" }}>
                  <CButton
                    style={{
                      border: 0,
                      backgroundColor: "#0e419d",
                      "margin-right": "15px",
                    }}
                    target="_blank"
                    onClick={submitProductSupply}
                  >
                    {isEditProductSupply ? "Update" : "Approve"}
                  </CButton>
                  <CButton
                    target="_blank"
                    style={{
                      border: 0,
                      backgroundColor: "lightslategrey",
                    }}
                    onClick={handleCancleProductSupply}
                  >
                    Cancel
                  </CButton>
                </div>
              </CForm>
            </div>
          </div>
        </Paper>
      </div>
      {/* </>
      // ) : (
        <> */}
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
              columns={productSupplyColumn}
              items={productSupplyIndentItems}
              hover
              className="striped-table"
            />
          )}

          {showConfirmModalApprove && (
            <Confirm
              buttonText={"OK"}
              isCancelRequired={false}
              confirmTitle={alertText}
              onConfirm={() => {
                setShowConfirmModalApprove(false);
              }}
              onCancel={() => {
                setShowConfirmModalApprove(false);
              }}
            />
          )}
        </div>
      </div>
    </>
    // )}</>
  )
}

export default IndentApprove