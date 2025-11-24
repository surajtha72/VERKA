import React from 'react'
import {
    CButton,
    CRow,
    CInputGroup,
    CFormInput,
    CFormLabel,
    CCol,
    CForm,
    CFormSelect,
} from '@coreui/react'

const AddRoute = () => {
  return (
    <div className="container">

                {/* Add Transporter */}
                <br /><br />
                <CForm method="post" onSubmit="">
                    <CRow>
                        <CCol lg={2}>
                            <CInputGroup>
                                <CFormLabel htmlFor="nf-email">
                                    Route Name
                                    {/* <i style={{ color: "red" }}>*</i> */}
                                </CFormLabel>
                            </CInputGroup>
                        </CCol>
                        <CCol lg={4}>
                            <CInputGroup>
                                <CFormInput
                                    type="Name"
                                    // value={code}
                                    //onChange={onChangeText}
                                    id="code"
                                    name="code"
                                    placeholder="Enter Route Name"
                                    aria-label="default input example"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol lg={2}>
                            <CInputGroup>
                                <CFormLabel>
                                    Route Owner
                                    {/* <i style={{ color: "red" }}>*</i> */}
                                </CFormLabel>
                            </CInputGroup>
                        </CCol>

                        <CCol lg={4}>
                            <CInputGroup>
                                <CFormInput
                                    type="Name"
                                    // value={name}
                                    //onChange={onChangeText}
                                    id="name"
                                    name="name"
                                    placeholder="Enter Route Owner Name"
                                />
                            </CInputGroup>
                        </CCol>
                        </CRow>
                        <br/>
                        <CRow>
                        <CCol lg={2}>
                            <CInputGroup>
                                <CFormLabel>
                                    Route Type
                                    {/* <i style={{ color: "red" }}>*</i> */}
                                </CFormLabel>
                            </CInputGroup>
                        </CCol>
                        <CCol lg={4}>
                            <CInputGroup>
                                <CFormSelect>
                                    <option>Select Route Type</option>
                                </CFormSelect>
                            </CInputGroup>
                        </CCol>
                        <CCol lg={2}>
                            <CInputGroup>
                                <CFormLabel htmlFor="nf-email">Route Code</CFormLabel>
                            </CInputGroup>
                        </CCol>
                        <CCol lg={4}>
                            <CInputGroup>
                                <CFormInput
                                    type="text"
                                    // value={name}
                                    //onChange={onChangeText}
                                
                                    placeholder="Enter Route Code"
                                />
                            </CInputGroup>
                        </CCol>
                        </CRow>
                        <br/>
                        <CRow>
                        <CCol lg={2}>
                            <CInputGroup>
                                <CFormLabel htmlFor="nf-email">Trip Type</CFormLabel>
                            </CInputGroup>
                        </CCol>
                        <CCol lg={4}>
                            <CInputGroup>
                                <CFormSelect>
                                    <option>
                                        Select Trip Type
                                    </option>
                                </CFormSelect>
                            </CInputGroup>
                        </CCol>

                        
                        </CRow>
                        <br/>
                        <CRow>
                        <CCol lg={2}>
                            <CInputGroup>
                                <CFormLabel htmlFor="nf-email">Morning Shift Time</CFormLabel>
                            </CInputGroup>
                        </CCol>
                        <CCol lg={4}>
                            <CInputGroup>
                                <CFormInput
                                    type="time"
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol lg={2}>
                            <CInputGroup>
                                <CFormLabel htmlFor="nf-email">Evening Shift Time</CFormLabel>
                            </CInputGroup>
                        </CCol>
                        <CCol lg={4}>
                            <CInputGroup>
                                <CFormInput
                                    type='time'
                                />
                            </CInputGroup>
                        </CCol>
                        </CRow>

                    <br></br>
                    <div>
                        <CButton
                            color="primary mr-3"
                            target="_blank"
                            style={{ backgroundColor: "gray", "marginRight": "15px" }}
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
                    <br />
                </CForm>

                <br />
                <div>
            </div>
        </div>
  )
}

export default AddRoute