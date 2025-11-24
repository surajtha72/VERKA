import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CFormTextarea,
  CContainer,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import "./RolesList.scss";
import { CPagination, CPaginationItem } from "@coreui/react";
import { Card } from "@mui/material";
import {
  CreateRoles,
  DeleteRoles,
  EntityandPermission,
  GetRoles,
  UpdateRoles,
} from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import { Switch } from "antd";
import Header from "../../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../../../components/loader";
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
    label: "Role Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Description",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialRoles = {
  roleName: "",
  roleShortDescription: "",
};

const RolesList = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);

  useEffect(() => {
    if (userAuthData) {
      const RolesPermissions = userAuthData?.permissions?.find(
        (val) => val?.Roles
      );
      setPermission(RolesPermissions?.Roles);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const [filteredData, setFilteredData] = useState([]);
  const [rolesTableData, setRolesTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entityList, SetEntityList] = useState([]);
  const [isCreateRoles, setIsCreateRoles] = useState(false);
  const [switchValues, setSwitchValues] = useState([]);
  const [isId, setIsId] = useState();
  const [rolesData, setRolesData] = useState(initialRoles);
  const [rolesDataErr, setRolesDataErr] = useState(initialRoles);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  const items = [];
  let switchValue = [];

  const clearData = () => {
    setRolesData(initialRoles);
    setRolesDataErr(initialRoles);
  };

  useEffect(() => {
    getRoles();
    handleGetEntity();
  }, []);

  const getRoles = () => {
    setIsLoading(true); // Show the loading spinner
    GetRoles((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setRolesTableData(data);
        setFilteredData(data);
        setIsLoading(false); // Hide the loading spinner
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

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(rolesTableData);
    } else {
      const filteredData = rolesTableData.filter((item) =>
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
        heading_1: val?.name ? val?.name : "--",
        heading_2: val?.description ? val?.description : "--",
        heading_3: (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              background: "none",
              alignItems: "flex-start",
            }}
          >
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
              onClick={() => handleEdit(val?.id)}
            >
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
      DeleteRoles((res) => {
        let { status, message, data } = res;
        if (status === 200) {
          getRoles();
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
        } else if (message = "Invalid access token") {
          setAlertText("User Session has Expired");
          setShowConfirmModal1(true);
          setSessionOk(true);
        }
      }, payload);
    }
  };

  const handleGetEntity = () => {
    EntityandPermission((res) => {
      SetEntityList(res.data);
    });
    // console.log(entityList);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRoles = () => {
    setIsCreateRoles(!isCreateRoles);
    setRolesData({
      roleName: "",
      roleShortDescription: "",
    });
    setIsId(null);
    setSwitchValues({});
  };

  const handleCancelRole = () => {
    setIsCreateRoles(!isCreateRoles);
    clearData();
    setIsId(null);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRolesData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  switchValue = Object.keys(switchValues)
    .filter((id) => switchValues[id])
    .map((id) => parseInt(id));

  const handleSwitchChange = (id) => {
    setSwitchValues((prevValues) => ({
      ...prevValues,
      [id]: !prevValues[id],
    }));
  };

  const validateFields = () => {
    let errObj = { ...initialRoles };
    if (!rolesData.roleName) {
      errObj.roleName = "This field is required";
    } else {
      errObj.roleName = "";
    }
    if (!rolesData.roleShortDescription) {
      errObj.roleShortDescription = "This field is required";
    } else {
      errObj.roleShortDescription = "";
    }
    setRolesDataErr((prev) => ({ ...prev, ...errObj }));
    const data = Object.values(errObj).every((x) => x === "" || x === null);
    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateFields();
    if (isValid) {
      const payload = {
        name: rolesData?.roleName,
        description: rolesData?.roleShortDescription,
        permissionIds: switchValue,
      };
      if (isId) {
        payload.id = isId;
        // console.log(payload);
        UpdateRoles((res) => {
          let { status, message } = res;
          if (status === 200) {
            getRoles();
            clearData();
            setIsId(null);
            setIsCreateRoles(!isCreateRoles);
            setAlertText(message);
            setShowConfirmModal1(true);
            setRolesDataErr(initialRoles);
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
      } else {
        CreateRoles((res) => {
          let { status, message } = res;
          if (status === 200) {
            getRoles();
            clearData();
            setIsId(null);
            setIsCreateRoles(!isCreateRoles);
            setSwitchValues({});
            setAlertText(message);
            setShowConfirmModal1(true);
            setRolesDataErr(initialRoles);
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
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateRoles(isCreateRoles);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleEdit = (id) => {
    setIsCreateRoles(!isCreateRoles);
    setRolesData({
      roleName: rolesTableData.find((role) => role.id === id)?.name || "",
      roleShortDescription:
        rolesTableData.find((role) => role.id === id)?.description || "",
    });
    setIsId(rolesTableData.find((role) => role.id === id)?.id);
    const payload = {
      id: rolesTableData.find((role) => role.id === id)?.id,
    };
    EntityandPermission((res) => {
      // console.log(res.data);
      SetEntityList(res.data);
      const switchValues = {};
      res.data.forEach((entity) => {
        entity.permissions.forEach((permission) => {
          switchValues[permission.id] = permission.valid;
        });
      });
      setSwitchValues(switchValues);
    }, payload);
  };

  return (
    <>
      {token ? (
        <div className="roles">
          <div className="roles__container">
            <div className="roles__header">
              <div className="roles__header__section">
                <div className="roles__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`UAM - ${isCreateRoles
                    ? isId
                      ? "Edit Role"
                      : "Create Role"
                    : "Roles"
                    }`}</h4>
                </div>
                <div className="roles__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            {isCreateRoles ? (
              <>
                <div className="Cbody">
                  <div className="container">
                    <br />
                    <CContainer style={{ width: "900px" }}>
                      <CRow>
                        <CCol xs={4}>Role Details</CCol>
                        <CCol xs={8}>
                          <Card sx={{ padding: "10px" }}>
                            <CRow>
                              <CCol lg={12}>
                                <CFormLabel htmlFor="nf-email">
                                  Role Name{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  type="Name"
                                  name="roleName"
                                  value={rolesData?.roleName}
                                  onChange={handleInputChange}
                                  placeholder="Enter  Role Name.."
                                  aria-label="default input example"
                                />
                                <p
                                  style={{ color: "red", fontSize: "x-small" }}
                                >
                                  {rolesDataErr.roleName}
                                </p>
                              </CCol>

                              <CCol lg={12}>
                                <CFormTextarea
                                  label="Role Short Description "
                                  placeholder="Enter Short Description.."
                                  rows={2}
                                  name="roleShortDescription"
                                  value={rolesData.roleShortDescription}
                                  onChange={handleInputChange}
                                >
                                  {" "}
                                </CFormTextarea>
                                <p
                                  style={{ color: "red", fontSize: "x-small" }}
                                >
                                  {rolesDataErr.roleShortDescription}
                                </p>
                              </CCol>
                            </CRow>
                          </Card>
                        </CCol>
                      </CRow>
                      <hr style={{ height: "2px" }} />
                    </CContainer>
                    <CContainer style={{ width: "900px" }}>
                      <CRow>
                        <CCol xs={4}>
                          Permissions
                          <br />
                          <p>Select actions which this role can perform</p>
                        </CCol>
                        <CCol xs={8}>
                          <CForm>
                            <Card sx={{ padding: "5px", marginBottom: "10px" }}>
                              <CRow>
                                {entityList?.map((entity, index) => {
                                  return (
                                    <>
                                      <h6>{(entity?.name).replace(/([a-z])([A-Z])/g, '$1 $2')}</h6>
                                      {entity?.permissions?.map((val) => {
                                        return (
                                          <>
                                            <CCol lg={3} key={val?.id}>
                                              <Switch
                                                checked={switchValues[val?.id]}
                                                onClick={() =>
                                                  handleSwitchChange(val?.id)
                                                }
                                              />
                                              <CFormLabel htmlFor="nf-email">
                                                &nbsp;&nbsp;{val?.action}
                                              </CFormLabel>
                                            </CCol>
                                          </>
                                        );
                                      })}
                                    </>
                                  );
                                })}
                              </CRow>
                            </Card>
                          </CForm>
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
                          onClick={handleCancelRole}
                        >
                          Cancel
                        </CButton>
                      </div> <br />
                    </CContainer>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="roles__table">
                  <div className="roles__table__header">
                    <div className="roles__table__header__section">
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
                        onClick={handleRoles}
                        disabled={!hasPermission("Create")}
                        title={
                          !hasPermission("Create")
                            ? "No permission to Create"
                            : ""
                        }
                        className={
                          hasPermission("Create") ? "" : "disabled-button"
                        }
                      >
                        Add Roles
                      </button>
                    </div>
                  </div>
                  <div
                    className="roles__table__body"
                    style={{ height: "59vh", overflowY: "scroll" }}
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
            )}
          </div>
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
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default RolesList;
