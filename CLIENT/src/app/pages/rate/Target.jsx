import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CTable,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { CPagination, CPaginationItem } from "@coreui/react";
import { Navigate } from "react-router-dom";

const initialTarget = {
  start_target: "",
  end_target: "",
};

const Target = () => {
  const token = localStorage.getItem("token");

  const userAuthData = JSON.parse(localStorage.getItem("userData"));

  const columns = [
    {
      key: "heading_1",
      label: "Base Start Target %",
      _props: { scope: "col" },
    },
    {
      key: "heading_2",
      label: "Base End Target %",
      _props: { scope: "col" },
    },
    {
      key: "heading_3",
      label: "Incentive Rs",
      _props: { scope: "col" },
    },
    {
      key: "heading_4",
      label: "Actions",
      _props: { scope: "col" },
    },
    {
      key: "heading_5",
      label: "Actions",
      _props: { scope: "col" },
    },
  ];
  const items = [
    {
      id: 1,
      heading_1: "Otto",
      heading_2: "@mdo",
      heading_3: "@mdo",
      heading_4: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "green" }}>Edit</span>
        </div>
      ),
      heading_5: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "red" }}>Delete</span>
        </div>
      ),
      _cellProps: { id: { scope: "row" } },
    },
    {
      id: 2,
      heading_1: "Thornton",
      heading_2: "@fat",
      heading_3: "Thornton",
      heading_4: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "green" }}>Edit</span>
        </div>
      ),
      heading_5: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "red" }}>Delete</span>
        </div>
      ),
      _cellProps: { id: { scope: "row" } },
    },
    {
      id: 3,
      heading_1: "@twitter",
      heading_2: "@twitter",
      heading_3: "@twitter",
      heading_4: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "green" }}>Edit</span>
        </div>
      ),
      heading_5: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "red" }}>Delete</span>
        </div>
      ),
      _cellProps: { id: { scope: "row" } },
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateRoutes, setIsCreateRoutes] = useState(false);

  const [visible, setVisible] = useState(false);
  const [targetData, setTargetData] = useState(initialTarget);
  const [targetDataErr, setTargetDataErr] = useState(initialTarget);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Perform search logic or update search results
  };

  const clearDataErr = () => {
    setTargetDataErr(initialTarget);
  };

  const clearData = () => {
    setTargetData(initialTarget);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setTargetData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTargetDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCreateRoute = () => {
    setIsCreateRoutes(!isCreateRoutes);
  };

  const handleCancelRoute = () => {
    setIsCreateRoutes(!isCreateRoutes);
    clearData();
    clearDataErr();
  };

  const validateFields = () => {
    let errObj = { ...initialTarget };

    if (!targetData.start_target) {
      errObj.start_target = "This field is required";
    } else {
      errObj.start_target = "";
    }
    if (!targetData.end_target) {
      errObj.end_target = "This field is required";
    } else {
      errObj.end_target = "";
    }

    setTargetDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleSubmit = () => {
    // console.log(validateFields());
  };

  return (
    <>
      {token ? (
        <div className="routes">
          <div className="routes__container">
            <div className="routes__header">
              <div className="routes__header__section">
                <div className="routes__header__section__main">
                  <h5>Company: Verka</h5>
                  <h5>
                    Hello {userAuthData?.username}, Logged in as:{" "}
                    {userAuthData?.roleName}
                  </h5>
                </div>
                <div className="routes__header__section__bottom">
                  <h4>{`${isCreateRoutes ? "Add Target" : "Target List"}`}</h4>
                </div>
              </div>
            </div>
            {isCreateRoutes ? (
              <>
                <div className="Cbody" style={{ width: "80%" }}>
                  {/* <Header /><br></br> */}
                  <div className="container">
                    <br></br>
                    <div>
                      <CForm method="post">
                        <CRow>
                          <CCol lg={2}>
                            <CInputGroup>
                              <CFormLabel htmlFor="nf-email">
                                Base Start Target %
                              </CFormLabel>
                            </CInputGroup>
                          </CCol>
                          <CCol lg={4}>
                            <CInputGroup>
                              <CFormInput
                                type="Name"
                                value={targetData.start_target}
                                onChange={handleInput}
                                id="start_target"
                                name="start_target"
                                placeholder="Enter Base Start Target.."
                                aria-label="default input example"
                              />
                            </CInputGroup>
                            <span style={{ color: "red" }}>
                              {targetDataErr.start_target}
                            </span>
                          </CCol>
                          <CCol lg={2}>
                            <CInputGroup>
                              <CFormLabel htmlFor="nf-email">
                                Base End Target %
                              </CFormLabel>
                            </CInputGroup>
                          </CCol>
                          <CCol lg={4}>
                            <CInputGroup>
                              <CFormInput
                                type="Name"
                                value={targetData.end_target}
                                onChange={handleInput}
                                id="end_target"
                                name="end_target"
                                placeholder="Enter Base End Target.."
                                aria-label="default input example"
                              />
                            </CInputGroup>
                            <span style={{ color: "red" }}>
                              {targetDataErr.end_target}
                            </span>
                          </CCol>
                        </CRow>
                        <br />

                        <div>
                          <CButton
                            //color="primary"
                            style={{
                              backgroundColor: "#0060f1",
                              marginRight: "15px",
                            }}
                            target="_blank"
                            onClick={handleSubmit}
                          >
                            Submit
                          </CButton>
                          <CButton
                            color="primary mr-3"
                            target="_blank"
                            style={{
                              backgroundColor: "gray",
                            }}
                            onClick={handleCancelRoute}
                          >
                            Cancel
                          </CButton>
                        </div>
                      </CForm>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="routes__table">
                  <div className="routes__table__header">
                    <div className="routes__table__header__section">
                      <CFormInput
                        type="text"
                        aria-label="default input example"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <button onClick={handleCreateRoute}>Add Target</button>
                    </div>
                  </div>
                  <CTable
                    hover
                    columns={columns}
                    items={items}
                    // className="striped hover"
                  />
                  <CPagination
                    activepage={1}
                    pages={1}
                    // onactivepageChange={handlePageChange}
                  >
                    <CPaginationItem>Previous</CPaginationItem>
                    <CPaginationItem>Next</CPaginationItem>
                  </CPagination>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default Target;
