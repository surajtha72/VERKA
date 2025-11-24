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
import { Paper } from "@mui/material";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import Header from "../../../components/header/Header";
import images from "../../../../assets/images/log_out.png";
import Loader from "../../../components/loader";
import Confirm from "../../../components/confirmModal/confirm";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CreateProductSalesToAgent, DeleteProductSalesToAgent, GetAllAgents, GetProductSalesToAgentPerBMC, UpdateProductSalesToAgent } from "../../../utils/apiCalls";
import moment from "moment";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ProductsSold from "./ProductsSold";

const productSalesColumns = [
    {
        key: "SlNo",
        label: "#",
        _props: { scope: "col" },
    },
    {
        key: "invoice_number",
        label: "Invoice Number",
        _props: { scope: "col" },
    },
    {
        key: "sold_to_agent",
        label: "Sold To Agent",
        _props: { scope: "col" },
    },
    {
        key: "agent_name",
        label: "Agent Name",
        _props: { scope: "col" },
    },
    {
        key: "total_amount",
        label: "Total Amount",
        _props: { scope: "col" },
    },
    {
        key: "payment_mode",
        label: "Payment Mode",
        _props: { scope: "col" },
    },
    // {
    //     key: "paid_amount",
    //     label: "Paid Amount",
    //     _props: { scope: "col" },
    // },
    {
        key: "balance",
        label: "Balance",
        _props: { scope: "col" },
    },
    {
        key: "actions",
        label: "Actions",
        _props: { scope: "col" },
    },
    {
        key: "details",
        label: " ",
        _props: { scope: "col" },
    },
];

const initialState = {
    invoiceNumber: "",
    soldToAgent: null,
    totalAmount: "",
    paymentMode: "",
    paidAmount: "",
    balance: "",
}

const ProductSalesToAgent = () => {
    const token = localStorage.getItem("token");
    const userAuthData = JSON.parse(localStorage.getItem("userData"));
    const [permission, setPermission] = useState([]);
    const [isCreate, setIsCreate] = useState(false);
    const [isEditProductSales, setIsEditProductSales] = useState(false);
    const productSalesItems = [];
    const [isLoading, setIsLoading] = useState(true);
    const [sessionOk, setSessionOk] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showConfirmModal1, setShowConfirmModal1] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [productSale, setProductSale] = useState(initialState);
    const [productSalesTableData, setProductSalesTableData] = useState([]);
    const [selectedSalesId, setSelectedSalesId] = useState(null);
    let startEndDate = localStorage.getItem("start-end-date");
    const dateParts = startEndDate?.split(" - ");
    let startDate = moment(dateParts[0]).format("YYYY-MM-DD");
    let endDate = moment(dateParts[1]).format("YYYY-MM-DD");
    let bmcId = localStorage.getItem('BMCId')
    let cycleStartDate = dateParts[0];
    let cycleEndDate = dateParts[1];
    const [agentsData, setAgentsData] = useState([]);
    const navigate = useNavigate();
    const [selectedAgent, setSelectedAgent] = useState({});
    const [filteredSalesData, setFilteredSalesData] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [moveToProductsSold, setMoveToProductsSold] = useState(false);
    const [productSaleId, setProductSaleId] = useState(null);
    useEffect(() => {
        if (userAuthData) {
            const ProductPermissions = userAuthData?.permissions?.find(
                (val) => val?.Products
            );
            setPermission(ProductPermissions?.Products);
        }
    }, []);
    const hasPermission = (perm) => {
        return permission?.includes(perm);
    };

    const handleCreate = () => {
        setIsCreate(!isCreate);
        setIsEditProductSales(false);
    };

    useEffect(() => {
        getProductSalesToAgent();
    }, [startDate, endDate])
    const getProductSalesToAgent = () => {
        setIsLoading(true);
        GetProductSalesToAgentPerBMC((res) => {
            let { status, data, message } = res;
            console.log('res: ', res);
            if (status === 200) {
                setProductSalesTableData(data);
                setFilteredSalesData(data);
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
            } else if (message?.includes("Invalid access token")) {
                setAlertText("User Session has Expired");
                setShowConfirmModal1(true);
                setSessionOk(true);
            }
        }, startDate, endDate, bmcId);
    };

    useEffect(() => {
        filterTableData();
    }, [searchTerm]);

    const filterTableData = () => {
        if (searchTerm === "") {
            setFilteredSalesData(productSalesTableData);
        } else {
            const filteredData = productSalesTableData.filter((item) =>
                Object.values(item).some(
                    (value) =>
                        value !== null &&
                        value
                            .toString()
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                )
            );
            setFilteredSalesData(filteredData);
        }
    };


    {
        filteredSalesData?.map((val, ind) => {
            // console.log(val?.productId.ProductName)
            productSalesItems.push({
                SlNo: ind + 1,
                invoice_number: val?.invoiceNumber ?? ' ',
                sold_to_agent: val?.soldToAgent.Id ?? ' ',
                agent_name: val?.soldToAgent.Name ?? ' ',
                total_amount: val?.totalAmount ?? ' ',
                payment_mode: val?.paymentMode ?? ' ',
                // paid_amount: val?.paidAmount == 0 ? '0' : val?.paidAmount,
                balance: val?.balance ?? ' ',
                actions: (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        background: "none",
                        alignItems: "flex-start",
                    }}>
                        <button
                            disabled={!hasPermission("Update")}
                            title={!hasPermission("Update") ? "No permission to Update" : ""}
                            className={hasPermission("Update") ? "" : "disabled-button"}
                            style={{
                                color: "green",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                            }}
                            onClick={() => {
                                handleEdit(val?.id);
                            }}                  >
                            <EditNoteOutlinedIcon />
                        </button>
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
                details: (
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => { navigateToProductsSold(val?.id); console.log(val.id) }}
                    >Details</span>
                )
            });
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // const selectedIndentId = localStorage.getItem("selectedProductSupply");
        const payload = {
            invoiceNumber: productSale?.invoiceNumber,
            totalAmount: productSale?.totalAmount,
            paymentMode: 'Credit',
            paidAmount: '0',
            soldToAgent: productSale?.soldToAgent.id,
            balance: productSale?.totalAmount,
            createdAt: new Date(endDate)
        };
        if (selectedSalesId) {
            payload.id = selectedSalesId;

            UpdateProductSalesToAgent((res) => {
                let { status, message } = res;
                if (status === 200) {
                    getProductSalesToAgent();
                    clearData();
                    setAlertText(message);
                    setShowConfirmModal1(true);
                    setIsCreate(!isCreate);
                    setIsEditProductSales(false);
                    setProductSale(initialState);
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
                } else if (message?.includes("Invalid access token")) {
                    setAlertText("User Session has Expired");
                    setShowConfirmModal1(true);
                    setSessionOk(true);
                }
            }, payload);
        } else {
            CreateProductSalesToAgent((res) => {
                let { status, message } = res;
                if (status === 200) {
                    getProductSalesToAgent();
                    clearData();
                    setAlertText(message);
                    setShowConfirmModal1(true);
                    setIsCreate(!isCreate);
                    setIsEditProductSales(false);
                    setProductSale(initialState);
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
                } else if (message?.includes("Invalid access token")) {
                    setAlertText("User Session has Expired");
                    setShowConfirmModal1(true);
                    setSessionOk(true);
                }
            }, payload);
        }
    };

    const handleEdit = (id) => {
        setIsCreate(!isCreate);
        setIsEditProductSales(true);
        const productsSale = productSalesTableData.find(
            (sale) => sale.id === id
        );
        console.log('faufdlsaf', productsSale)
        if (productsSale) {
            setProductSale({
                id: productsSale.id,
                invoiceNumber: productsSale?.invoiceNumber,
                soldToAgent: productsSale?.soldToAgent,
                totalAmount: productsSale?.totalAmount,
                paidAmount: productsSale?.paidAmount,
                paymentMode: productsSale?.paymentMode,
                balance: productsSale?.balance,
            });
        }
        setSelectedSalesId(
            productSalesTableData.find((sale) => sale.id === id)?.id
        );
        setSelectedAgent(agentsData.find((agent) => agent.id === productsSale.soldToAgent.Id))
        // setProductSale((prev) => ({ ...prev, "productCatId": indentProductsData?.productCatId }));
    };


    const handleCancel = () => {
        setIsCreate(!isCreate);
        setIsEditProductSales(false);
        clearData();
    };

    const clearData = () => {
        setProductSale(initialState);
        setSelectedAgent(null);
        setSelectedSalesId(null);
    }
    const orgType = 5;
    useEffect(() => {
        getAgents();
    }, [])
    const getAgents = () => {
        GetAllAgents((res) => {
            setAgentsData(res.data);
        }, orgType);
    };

    const handleDropDown = (name, selectedOption) => {
        setProductSale((prev) => ({ ...prev, [name]: selectedOption }));
        // setStopDataErr((prev) => ({ ...prev, [name]: "" }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductSale((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleOk = () => {
        const payload = {
            id: selectedSalesId,
        };
        // console.log(payload);

        if (selectedSalesId != null) {
            DeleteProductSalesToAgent((res) => {
                let { status, message, data } = res;
                if (status === 200) {
                    getProductSalesToAgent();
                    setSelectedSalesId(null);
                    setShowConfirmModal(false);
                    setAlertText(message);
                    setShowConfirmModal1(true);
                    clearData();
                } else if (status === 403) {
                    setShowConfirmModal(false);
                    setAlertText("You don't have access to perform this operation");
                    setShowConfirmModal1(true);
                    setIsLoading(false);
                    clearData();
                } else if (status === 500) {
                    setShowConfirmModal(false);
                    setAlertText("Something wrong happened in API");
                    setShowConfirmModal1(true);
                    setIsLoading(false);
                    clearData();
                } else if (message?.includes("Invalid access token")) {
                    setAlertText("User Session has Expired");
                    setShowConfirmModal1(true);
                    setSessionOk(true);
                    clearData();
                }
            }, payload);
        }
    };


    const handleConfirm = () => {
        setShowConfirmModal1(false);
        setIsEditProductSales(false);
        setIsCreate(isCreate);
        if (sessionOk) {
            localStorage.clear();
            navigate("/");
        }
    };

    const handleDelete = (id) => {
        setShowConfirmModal(true);
        setSelectedSalesId(id);
        // console.log(id);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const navigateToProductsSold = (id) => {
        setMoveToProductsSold(true);
        setProductSaleId(id)
    }

    return (
        // <>{moveToProductsSold ? (<ProductsSold productSaleId={productSaleId}/>) :
        //     (
        <>
            {token ? <div className="indentproduct">
                <div className="indentproduct__container">
                    <div className="indentproduct__header">
                        <div className="indentproduct__header__section">
                            <div className="indentproduct__header__section__main">
                                <h5>Company: Verka</h5>
                                <h4>Product Sales</h4>
                                <h5>{startDate} to {endDate}</h5>
                            </div>
                            <div className="indentproduct__header__section__bottom">
                                <Header />
                            </div>
                        </div>
                    </div>
                    <div className="transporter1__header__section__logo" style={{ marginTop: -40 }}>
                        {/* <IconButton onClick={handleProductSupply} style={{ top: "40px" }}>
                            <img src={images} alt="back" />
                        </IconButton> */}
                    </div><br />
                    {isCreate ? (
                        <>
                            <div className="approve-body">

                                <Paper elevation={3}>
                                    <CForm method="post">
                                        <CRow>
                                            <CCol lg={6}>
                                                <CFormLabel htmlFor="nf-email">
                                                    Select Agent <span style={{ color: "red" }}>*</span>
                                                </CFormLabel>
                                                <Select
                                                    options={agentsData}
                                                    value={selectedAgent}
                                                    onChange={(selectedOption) => {
                                                        handleDropDown("soldToAgent", selectedOption)
                                                        setSelectedAgent(selectedOption)
                                                    }}
                                                    getOptionLabel={(option) => option.name}
                                                    getOptionValue={(option) => option.id}
                                                    isSearchable
                                                    placeholder="Select Agent"
                                                    styles={{
                                                        control: (provided, state) => ({
                                                            ...provided,
                                                            height: '32px',
                                                            minHeight: '32px',
                                                            alignItems: 'center'
                                                        }),
                                                    }}
                                                />

                                            </CCol>
                                            <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                                <CFormLabel
                                                    style={{ fontSize: "0.9vw", marginBottom: "0" }}
                                                >
                                                    Invoice Number
                                                </CFormLabel>
                                                <CFormInput
                                                    size="sm"
                                                    type="text"
                                                    id="invoiceNumber"
                                                    name="invoiceNumber"
                                                    value={productSale.invoiceNumber}
                                                    placeholder="Enter Invoice Number"
                                                    onChange={handleInputChange}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(
                                                            /[^0-9.-]/g,
                                                            ""
                                                        );
                                                    }}
                                                />
                                            </CCol>

                                            <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                                <CFormLabel
                                                    style={{ fontSize: "0.9vw", marginBottom: "0" }}
                                                >
                                                    Total Amout
                                                </CFormLabel>
                                                <CFormInput
                                                    size="sm"
                                                    type="text"
                                                    id="totalAmount"
                                                    name="totalAmount"
                                                    value={productSale.totalAmount}
                                                    placeholder="Enter Total Amount"
                                                    onChange={handleInputChange}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(
                                                            /[^0-9.-]/g,
                                                            ""
                                                        );
                                                    }}
                                                />
                                            </CCol>

                                            <CCol lg={6} style={{ marginTop: "1.1vw", display: 'flex', justifyContent: 'end' }}>
                                                <CButton
                                                    style={{
                                                        border: 0,
                                                        backgroundColor: "#0e419d",
                                                        "margin-right": "15px",
                                                    }}
                                                    target="_blank"
                                                    onClick={handleSubmit}
                                                >
                                                    {isEditProductSales ? "Update" : "Save"}
                                                </CButton>
                                                <CButton
                                                    target="_blank"
                                                    style={{
                                                        border: 0,
                                                        backgroundColor: "lightslategrey",
                                                    }}
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </CButton>
                                            </CCol>
                                        </CRow>

                                        <div style={{ marginTop: "1vw" }}>

                                        </div>
                                    </CForm>
                                </Paper>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="indentproduct__table">
                                <div className="indentproduct__table__header">
                                    <div className="indentproduct__table__header__section">
                                        <input
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
                                            onClick={handleCreate}
                                        >
                                            Sale Products
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className="indentproduct__table__body"
                                    style={{ height: "79vh", overflowY: "scroll" }}
                                >
                                    {isLoading ? (
                                        <Loader />
                                    ) : (
                                        <CTable
                                            columns={productSalesColumns}
                                            items={productSalesItems}
                                            hover
                                            className="striped-table"
                                        />
                                    )}
                                </div>
                                {/* <div
                             style={{
                                marginTop: "1vw",
                                display: "flex",
                                justifyContent: "center",
                             }}
                          >
                             <CPagination
                                activepage={1}
                                pages={1}
                             // onactivepageChange={handlePageChange}
                             >
                                <CPaginationItem>First</CPaginationItem>
                                <CPaginationItem>Next</CPaginationItem>
                                <CPaginationItem>Previous</CPaginationItem>
                                <CPaginationItem>Last</CPaginationItem>
                             </CPagination>
                          </div> */}
                            </div>
                        </>
                    )}

                    {showConfirmModal && (
                        <Confirm
                            buttonText={"OK"}
                            isCancelRequired={true}
                            confirmTitle={"Are you sure ?"}
                            onConfirm={handleOk}
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
            </div> : <Navigate to={"/"} />}
        </>
        // )}</>
    );
}

export default ProductSalesToAgent;