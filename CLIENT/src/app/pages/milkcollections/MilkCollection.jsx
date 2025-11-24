import React, { useEffect, useState } from "react";
import {
  GetDropDownOrganizationTypes,
  GetMilkCollections,
  GetOrganization,
  GetOrganization1,
  CreateMilkCollection,
  UpdateMilkCollection
} from "../../utils/apiCalls";
import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter
} from "@coreui/react";
import { IconButton, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MilkCollectionDetails from "./MilkCollectionDetails";
import Header from "../../components/header/Header";
import Confirm from "../../components/confirmModal/confirm";
import moment from "moment";
import Loader from "../../components/loader";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";

const columns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "collectionDate",
    label: "Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Shift",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Status",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Started At",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Completed At",
    _props: { scope: "col" },
  },
  {
    key: "milkQuantity",
    label: "Milk Quantity",
    _props: { scope: "col" },
  },
  {
    key: "enteredGT",
    label: "GT Entered",
    _props: { scope: "col" },
  },
  {
    key: "calculatedGT",
    label: "GT Calculated",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Navigate",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Action",
    _props: { scope: "col" },
  },
];

const MilkCollection = () => {
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const [selectedOrgTypeId, setSelectedOrgTypeId] = useState(null);
  const [selectedOrgUnitId, setSelectedOrgUnitId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orgUnits, setOrgUnits] = useState([]);
  const [milkCollections, setMilkCollections] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionOk, setSessionOk] = useState(false)
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const excelitem = [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollectionData, setNewCollectionData] = useState({
    createdBy: userAuthData.userDetails.id,
    shift: "",
    id: uuidv4(),
    status: "started",
    startedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    collectionDateTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fat, setFat] = useState("");
  const [clr, setClr] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState(null);

  useEffect(() => {
    if (userAuthData) {
      const MilkPermissions = userAuthData?.permissions?.find(
        (val) => val?.MilkCollection
      );
      setPermission(MilkPermissions?.MilkCollection);
    }
  }, []);

  // console.log(userAuthData);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  useEffect(() => {
    getMilkCollections()
  }, [])

  useEffect(() => {
    getOrgUnits();
  }, [selectedOrgTypeId, startDate, endDate]);
  const getOrgUnits = () => {
    GetOrganization1((res) => {
      setOrgUnits(res.data);
    }, 4);
  };

  const getMilkCollections = () => {
    setIsLoading(true);
    if (localStorage.getItem('selectedOrgUnitId')) {
      GetMilkCollections((res) => {
        if (res.status == 200) {
          setMilkCollections(res.data);
          setIsLoading(false);
        }
      }, localStorage.getItem('selectedOrgUnitId'), localStorage.getItem('startDate'), localStorage.getItem('endDate'));
    } else {
      GetMilkCollections((res) => {
        if (res.status == 200) {
          setMilkCollections(res.data);
          setIsLoading(false);
        }
      }, selectedOrgUnitId, startDate, endDate);
    }
    setIsSubmitted(true);
  };

  const [selectedMilkCollectionId, setSelectedMilkCollectionId] = useState(null);
  const [isMilkCollectionDetails, setIsMilkCollectionDetails] = useState(false);
  const navigateToMilkCollectionDetails = (id) => {
    localStorage.setItem("selectedMilkCollectionId", id);
    const collectionData = milkCollections.find((data) => data.id === id)
    localStorage.setItem("collectionData", milkCollections.find((data) => data.id === id))
    localStorage.setItem("shift", collectionData.shift)
    localStorage.setItem("collectionDate", collectionData.collectionDateTime)
    localStorage.setItem("isMilkBillLocked", collectionData.isMilkBillLocked)
    console.log('is milk vill locked ? ', collectionData.isMilkBillLocked)
    setSelectedMilkCollectionId(id);
    setIsMilkCollectionDetails(true);
  };


  const items = [];
  {
    milkCollections?.map((val, ind) => {
      items.push({
        SlNo: ind + 1,
        id: val.id,
        collectionDate: moment(val.collectionDateTime).format("YYYY-MM-DD") || "",
        heading_1: val.shift == 'morning' ? 'Morning' : 'Evening',
        heading_2: val.status || " ",
        heading_3: moment(val.startedAt).format("YYYY-MM-DD  HH:mm") || "",
        heading_4: val.completedAt && moment(val.completedAt).isValid() ? moment(val.completedAt).format("YYYY-MM-DD  HH:mm") : "Pending",
        milkQuantity: val.totalWeight ? val.totalWeight : " ",
        enteredGT: val.status == 'completed' ? `${val.gtFat} : ${val.gtSnf}` : " ",
        calculatedGT: val.status == 'completed' ? `${val.calculatedFat} : ${val.calculatedSnf}` : " ",
        heading_5: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link to={`/milk-collection-details`}>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  navigateToMilkCollectionDetails(val.id);
                }}
              >
                Details
              </span>
            </Link>
          </div>
        ),
        heading_6: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => openModal(val.id)}
            >Complete Shift
            </span>
          </div>
        )
      })

      excelitem.push({
        'Sl. No': ind + 1,
        'Collection Date': moment(val.collectionDateTime).format("YYYY-MM-DD") || "",
        'Shift': val.shift == 'morning' ? 'Morning' : 'Evening',
        'Status': val.status || " ",
        'Shift Start TIme': moment(val.startedAt).format("YYYY-MM-DD  HH:mm") || "",
        'Shift Close Time': val.completedAt && moment(val.completedAt).isValid() ? moment(val.completedAt).format("YYYY-MM-DD  HH:mm") : "Pending",
        'Total Milk Quantity': val.totalWeight ? val.totalWeight : " ",
        'GT Entered': val.status == 'completed' ? `${val.gtFat} : ${val.gtSnf}` : " ",
        'GT Calculated': val.status == 'completed' ? `${val.calculatedFat} : ${val.calculatedSnf}` : " ",
      })
    });
  }

  const handleConfirm = () => {
    setShowConfirmModal1(false)
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${localStorage.getItem('startDate')} - ${localStorage.getItem('endDate')}-milk-collection.xlsx`);
  };

  const handleAddMilkCollection = (e) => {
    e.preventDefault();
    console.log(newCollectionData);
    CreateMilkCollection((res) => {
      let { status, message } = res;
      if (status === 200) {
        getMilkCollections();
        setAlertText(message);
      }
    }, newCollectionData);
    setShowAddModal(false);
  };

  const openModal = (id) => {
    setSelectedShiftId(id);
    setIsModalVisible(true);
    setFat("");
    setClr("");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setFat("");
    setClr("");
    console.log(fat,clr);
  };

  const handleCompleteShift = () => {
    const payload = {
      id: selectedShiftId,
      fat: fat,
      clr: clr,
      completedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      status: "completed"
    }
    setIsModalVisible(false);
    UpdateMilkCollection((res) => {
      let { status, message } = res;
      if (status === 200) {
        getMilkCollections();
        setAlertText(message);
      }
    }, payload);
  };

  return (
    <>
      {isMilkCollectionDetails ? (
        <CButton
          style={{ position: "absolute", right: 10, top: 50, height: "50px" }}
          onClick={() => setIsMilkCollectionDetails(!isMilkCollectionDetails)}
        >
          Back
        </CButton>
      ) : null}
      {isMilkCollectionDetails ? (
        <MilkCollectionDetails
          selectedMilkCollectionId={selectedMilkCollectionId}
        />
      ) : (
        <div className="milk-collection">
          <div className="milk-collection__container">
            <div className="milk-collection__header">
              <div className="milk-collection__header__section">
                <div className="milk-collection__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>Milk Collections</h4>
                </div>
                <div className="milk-collection__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            <div className="Cbody">
              <Paper elevation={3}>
                <div className="container">
                  <div>
                    <CForm method="post" onSubmit="">
                      <CRow>
                        <CCol lg={4}>
                          <CFormLabel>
                            Organization Unit
                            <span style={{ color: "red" }}>*</span>
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            onChange={(e) => {
                              setSelectedOrgUnitId(e.target.value);
                              localStorage.setItem('selectedOrgUnitId', e.target.value);
                            }}
                            value={localStorage.getItem('selectedOrgUnitId')}
                          >
                            {/* {console.log(localStorage.getItem('selectedOrgUnitId'))} */}
                            <option value={0}>Select Organization Unit</option>
                            {orgUnits?.length &&
                              orgUnits?.map((option, index) => {
                                return (
                                  <option key={index} value={option.id}>
                                    {option.name}
                                  </option>
                                );
                              })}
                          </CFormSelect>
                        </CCol>
                        <CCol lg={4}>
                          <CFormLabel>
                            Start Date
                          </CFormLabel>
                          <CFormInput
                            type="date"
                            name="startDate"
                            onChange={(e) => { setStartDate(e.target.value); localStorage.setItem('startDate', e.target.value) }}
                            style={{ height: 30, borderRadius: 3 }}
                            value={localStorage.getItem('startDate')}
                          />
                          <p style={{ color: "red", fontSize: "x-small" }}>
                            {startDate > endDate ? "Start date should be less than end date" : " "}
                          </p>
                        </CCol>
                        <CCol lg={4}>
                          <CFormLabel>
                            End Date
                          </CFormLabel>
                          <CFormInput
                            type="date"
                            name="endDate"
                            onChange={(e) => { setEndDate(e.target.value); localStorage.setItem('endDate', e.target.value) }}
                            style={{ height: 30, borderRadius: 3 }}
                            value={localStorage.getItem('endDate')}
                          />
                          <p style={{ color: "red", fontSize: "x-small" }}>
                            {endDate < startDate ? "End date should be greater than start date" : " "}
                          </p>
                        </CCol>
                      </CRow>
                      <div style={{ marginTop: "0.3vw", display: 'flex', justifyContent: 'space-between' }}>
                        <CButton
                          style={{
                            border: 0,
                            backgroundColor: "#0e419d",
                            "margin-right": "15px",
                          }}
                          target="_blank"
                          disabled={!hasPermission("Create")}
                          title={
                            !hasPermission("Create")
                              ? "No permission to Create"
                              : ""
                          }
                          className={
                            hasPermission("Create") ? "" : "disabled-button"
                          }
                          onClick={getMilkCollections}
                        >
                          Submit
                        </CButton>
                        <CButton style={{
                          border: 0,
                          backgroundColor: "#0e419d",
                          alignSelf: 'end'
                        }}
                          onClick={handleExportToExcel}>
                          Export to Excel
                        </CButton>
                      </div>
                    </CForm>
                  </div>
                </div>
              </Paper>
            </div>
            <CButton style={{
              border: 0,
              backgroundColor: "#0e419d",
              alignSelf: 'end',
              marginTop: "45px",
              marginRight: "20px"
            }}
              onClick={() => setShowAddModal(true)}>
              Add Milk Collection
            </CButton>
            <CModal
              visible={showAddModal}
              onClose={() => setShowAddModal(false)} // Close modal
            >
              <CModalHeader>
                <h5>Add Milk Collection</h5>
              </CModalHeader>
              <CModalBody>
                <CForm onSubmit={handleAddMilkCollection}>
                  <CRow>
                    <CCol lg={12} style={{ marginTop: "15px" }}>
                      <CFormLabel>
                        Shift
                        <span style={{ color: "red" }}>*</span>
                      </CFormLabel>
                      <CFormSelect
                        onChange={(e) => setNewCollectionData({ ...newCollectionData, shift: e.target.value })}
                        value={newCollectionData.shift}
                      >
                        <option>Select Shift</option>
                        <option value="morning">Morning</option>
                        <option value="evening">Evening</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setShowAddModal(false)}>
                  Close
                </CButton>
                <CButton style={{ backgroundColor: "#0e419d" }} onClick={handleAddMilkCollection}>
                  Start
                </CButton>
              </CModalFooter>
            </CModal>

            <CModal visible={isModalVisible} onClose={handleModalClose}>
              <CModalHeader>Complete Shift</CModalHeader>
              <CModalBody>
                <CFormInput
                  label="Fat"
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
                <CFormInput
                  label="CLR"
                  type="number"
                  value={clr}
                  onChange={(e) => setClr(e.target.value)}
                />
              </CModalBody>
              <CModalFooter>
                <CButton style={{ backgroundColor: "#0e419d" }} onClick={handleCompleteShift}>
                  Complete
                </CButton>
                <CButton color="secondary" onClick={handleModalClose}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>

            {isSubmitted && (
              <>
                <div className="milk-collection__table">
                  <div className="milk-collection__table__header">
                    <div className="milk-collection__table__header__section"></div>
                  </div>
                  <div
                    className="milk-collection__table__body"
                    style={{ height: "60vh", overflowY: "scroll" }}
                  >
                    {isLoading ? (
                      <Loader />
                    ) :
                      <>{milkCollections.length === 0 ? (
                        <div className="empty_data">
                          <Paper elevation={3}>
                            <h3>No Data Available</h3>
                          </Paper>
                        </div>
                      ) : (
                        <CTable
                          columns={columns}
                          items={items}
                          hover
                          className="striped-table"
                        />
                      )}</>}

                  </div>
                </div>
              </>
            )}
          </div>
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
      )}
    </>
  );
};

export default MilkCollection;