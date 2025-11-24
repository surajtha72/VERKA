import React, { useState } from "react";
import {
  CButton,
  CRow,
  CFormInput,
  CCol,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTableHead,
  CTable,
  CTableBody,
  CModal,
  CInputGroup,
  CFormLabel,
  CFormSelect,
  CForm,
  CModalBody,
} from "@coreui/react";

const Routes = () => {
  const [showStopForm, setShowStopForm] = useState(false);
  return (
    <div className="container">
      <br />
      <br />
      <br />

      <CRow>
        <CCol lg="10">
          <CFormInput
            style={{ width: 300, border: "solid gray 1px" }}
            type="text"
            placeholder="Search"
          />
        </CCol>
        <CCol lg="2">
          <CButton>
            <a className="dropdown-item" href="routes/addRoute">
              Add New Route
            </a>
          </CButton>
        </CCol>

        <CCol lg="2">
          <br />
          <CButton
            className="modal-button"
            onClick={() => setShowStopForm(!showStopForm)}
          >
            Add Stops
          </CButton>
        </CCol>
      </CRow>
      <br />

      <CModal
        alignment="center"
        visible={showStopForm}
        onClose={() => setShowStopForm(false)}
      >
        <CModalBody>
          <CForm method="post" onSubmit="">
            <CRow>
              <CCol lg={4}>
                <CInputGroup>
                  <CFormLabel htmlFor="nf-email">Route Id</CFormLabel>
                </CInputGroup>
              </CCol>
              <CCol lg={8}>
                <CInputGroup>
                  <CFormSelect>
                    <option>Select Route</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol lg={4}>
                <CInputGroup>
                  <CFormLabel>Sequence No.</CFormLabel>
                </CInputGroup>
              </CCol>
              <CCol lg={8}>
                <CInputGroup>
                  <CFormInput
                    type="text"
                    id="seq"
                    name="seq"
                    placeholder="Enter Sequence No."
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol lg={4}>
                <CInputGroup>
                  <CFormLabel>Stop Id</CFormLabel>
                </CInputGroup>
              </CCol>
              <CCol lg={8}>
                <CInputGroup>
                  <CFormInput
                    type="text"
                    id="stopId"
                    name="stopId"
                    placeholder="Enter Stop Id"
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol lg={4}>
                <CInputGroup>
                  <CFormLabel>KMs Travelled</CFormLabel>
                </CInputGroup>
              </CCol>
              <CCol lg={8}>
                <CInputGroup>
                  <CFormInput
                    type="text"
                    placeholder="Enter Total Kms Travelled"
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <br></br>

            <br></br>
            <div>
              <CButton
                color="primary mr-3"
                target="_blank"
                style={{ backgroundColor: "gray", marginRight: "15px" }}
                onClick=""
              >
                Clear
              </CButton>
              <CButton
                //color="primary"
                style={{
                  backgroundColor: "#0060f1",
                }}
                target="_blank"
                onClick=""
              >
                Save
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>

      <CTable hover>
        <CTableHead color="primary">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>

            <CTableHeaderCell scope="col">Route Name</CTableHeaderCell>

            <CTableHeaderCell scope="col">Stop Id</CTableHeaderCell>

            <CTableHeaderCell scope="col">Route Code</CTableHeaderCell>

            <CTableHeaderCell scope="col">Route Owner</CTableHeaderCell>

            <CTableHeaderCell scope="col">Trip Type</CTableHeaderCell>

            <CTableHeaderCell scope="col"></CTableHeaderCell>

            <CTableHeaderCell scope="col"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row">1</CTableHeaderCell>

            <CTableDataCell>Mark</CTableDataCell>

            <CTableDataCell>Otto</CTableDataCell>

            <CTableDataCell>@mdo</CTableDataCell>

            <CTableDataCell>@mdo</CTableDataCell>

            <CTableDataCell>@mdo</CTableDataCell>

            <CTableDataCell>
              <CButton
                style={{
                  color: "green",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                Edit
              </CButton>
            </CTableDataCell>

            <CTableDataCell>
              <CButton
                style={{
                  color: "red",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                Delete
              </CButton>
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell scope="row">2</CTableHeaderCell>

            <CTableDataCell>Jacob</CTableDataCell>

            <CTableDataCell>Thornton</CTableDataCell>

            <CTableDataCell>@fat</CTableDataCell>

            <CTableDataCell>@mdo</CTableDataCell>

            <CTableDataCell>@mdo</CTableDataCell>

            <CTableDataCell>
              <CButton
                style={{
                  color: "green",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                Edit
              </CButton>
            </CTableDataCell>

            <CTableDataCell>
              <CButton
                style={{
                  color: "red",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                Delete
              </CButton>
            </CTableDataCell>
          </CTableRow>

          <CTableRow>
            <CTableHeaderCell scope="row">3</CTableHeaderCell>

            <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>

            <CTableDataCell>@twitter</CTableDataCell>

            <CTableDataCell>@mdo</CTableDataCell>

            <CTableDataCell>@mdo</CTableDataCell>

            <CTableDataCell>
              <CButton
                style={{
                  color: "green",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                Edit
              </CButton>
            </CTableDataCell>

            <CTableDataCell>
              <CButton
                style={{
                  color: "red",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                Delete
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </div>
  );
};

export default Routes;
