import { fetchCall, fetchLoginCall, fetchNoCall } from "./ajax";
import { API_CONSTANTS, API_METHODS } from "./api-constant";

export const UserLogin = (callback, payload) => {
  const url = `${API_CONSTANTS.LOGIN}`;
  return fetchCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const getRefreshToken = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_REFRESH_TOKEN}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const ChangePassword = (callback, payload) => {
  const url = `${API_CONSTANTS.CHANGE_PASSWORD}`;
  return fetchCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetRoles = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_ROLES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const DeleteRoles = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_ROLES + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const CreateRoles = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_ROLES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const EntityandPermission = (callback, payload) => {
  const queryString = `?id=${payload?.id}`;
  const url = `${API_CONSTANTS.ENTITY_AND_PERMISSION + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateRoles = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_ROLES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetUser = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_USER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const DeleteUsers = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_USERS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetProcurement = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PROCUREMENT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateProcurement = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PROCUREMENT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const DeleteProcurement = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_PROCUREMENT + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetTransporters = (callback, payload) => {
  // const url = `${API_CONSTANTS.GET_TRANSPORTERS}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
  const url = `${API_CONSTANTS.GET_TRANSPORTERS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateTransporters = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_TRANSPORTERS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateTransporters = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_TRANSPORTERS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const UpdateProcurement = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PROCUREMENT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteTransporters = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_TRANSPORTERS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetDropDownPayroll = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWNPAYROLL}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetVehicles = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_VEHICLES}`;

  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetVehicleWithRegNumber = (callback, vehicleNo) => {
  const url = `${API_CONSTANTS.GET_VEHICLES}?vehicleNo=${vehicleNo}`;

  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const CreateVehicles = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_VEHICLES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateVehicles = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_VEHICLES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteVehicles = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_VEHICLES + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetRateMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_RATE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetShiftApplicable = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_SHIFT_APPLICABLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const DeleteRateMaster = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_RATE_MASTER + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const CreateRateMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_RATE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateRateMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_RATE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetDropDownOrganizationTypes = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_ORGANIZATION_TYPES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetDropDownOrganizationTypes1 = (callback, selectedOption) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_ORGANIZATION_TYPES1}?isProcurementCenter=${selectedOption}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetDropDownOrganizationBmc = (callback, selectedOption) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_ORGANIZATION_BMC}?organization=${selectedOption}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const CreateUsers = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_USERS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetDropDownProcurement = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWNPROCUREMENT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetDropDownCollectType = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_COLLECTTYPE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetDropDownRoute = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_ROUTE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetDropDownState = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_STATE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetDropDownOutletTypes = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_OUTLET_TYPES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetOrganization = (callback, pageSize, pageIndex) => {
  const url = `${API_CONSTANTS.GET_ORGANIZATION}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
  // const url = `${API_CONSTANTS.GET_ORGANIZATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetAllAgents = (callback, orgUnitType) => {
  const url = `${API_CONSTANTS.GET_ALL_ORGANIZATIONS}?orgUnitType=${orgUnitType}`;
  // const url = `${API_CONSTANTS.GET_ORGANIZATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetAgents = (callback, pageSize, pageIndex, orgUnitType) => {
  const url = `${API_CONSTANTS.GET_ORGANIZATION}?pageIndex=${pageIndex}&pageSize=${pageSize}&orgUnitType=${orgUnitType}`;
  // const url = `${API_CONSTANTS.GET_ORGANIZATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};



export const GetDropDownOrganization = (callback, orgType) => {
  const url = `${API_CONSTANTS.GET_ALL_ORGANIZATIONS}?orgType=${orgType}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  )
}

export const GetOrganization1 = (callback, selectedOption) => {
  const url = `${API_CONSTANTS.GET_ALL_ORGANIZATIONS}?organization=${selectedOption}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetDropDownDistrict = (callback, stateId) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_DISTRICT}?StateId=${stateId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetDropDownTalukas = (callback, districtId) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_TALUKAS}?DistrictId=${districtId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetAllOrganization = (callback, payload) => {
  // const url = `${API_CONSTANTS.GET_ORGANIZATION}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
  const url = `${API_CONSTANTS.GET_ALL_ORGANIZATIONS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateOrganization = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_ORGANIZATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateOrganization = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_ORGANIZATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteOrganization = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_ORGANIZATION + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const CreateState = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_STATE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const DeleteStates = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_STATES + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const UpdateStates = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_STATES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const CreateDistrict = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_DISTRICT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const DeleteDistrict = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_DISTRICTS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const UpdateDistrict = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_DISTRICT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetTalukas = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_TALUKAS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateTalukas = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_TALUKAS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const DeleteTalukas = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_TALUKAS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const UpdateTalukas = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_TALUKAS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const UpdateUser = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_USER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetProducts = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PRODUCTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateProducts = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateProducts = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteProducts = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_PRODUCTS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetFinyear = (callback, pageSize, pageIndex) => {
  const url = `${API_CONSTANTS.GET_FINYEAR}`;
  console.log(url);
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const CreateFinyear = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_FINYEAR}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateFinyear = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_FINYEAR}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteFinyear = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_FINYEAR + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetDropDownFinYear = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_FINYEAR}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetCycle = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_CYCLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetBillingCycle = (callback, currentDate) => {
  const url = `${API_CONSTANTS.GET_CYCLE}?currentDate=${currentDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const CreateCycle = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_CYCLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateCycle = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_CYCLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteCycle = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_CYCLE + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetContracts = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_CONTRACTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetRouteStops = (callback, selectRouteMasterId) => {
  const url = `${API_CONSTANTS.GET_ROUTE_STOPS}?routeMasterId=${selectRouteMasterId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const CreateContracts = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_CONTRACTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateContracts = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_CONTRACTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteContracts = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_CONTRACTS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetDropDownTalukas1 = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_TALUKAS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetDistricts = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DISTRICTS}`;

  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetRouteMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_ROUTE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetRouteType = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_ROUTE_TYPE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateRouteType = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_ROUTE_TYPE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const DeleteRouteType = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_ROUTE_TYPE + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const UpadteRouteType = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_ROUTE_TYPE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetIncentiveMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_INCENTIVE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetCurrentIncentiveMaster = (callback, currentDate) => {
  const url = `${API_CONSTANTS.GET_INCENTIVE_MASTER}?currentDate${currentDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,);
};

export const CreateIncentiveMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_INCENTIVE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const DeleteIncentiveMaster = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_INCENTIVE_MASTER + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const UpadteIncentiveMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_INCENTIVE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetIncentiveSlab = (callback, incentiveId) => {
  const url = `${API_CONSTANTS.GET_INCENTIVE_SLABS}?incentiveId=${incentiveId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const CreateIncentiveSlab = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_INCENTIVE_SLABS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const DeleteIncentiveSlab = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_INCENTIVE_SLABS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const UpadteIncentiveSlab = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_INCENTIVE_SLABS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetTransporterContracts = (callback, transporterId) => {
  const url = `${API_CONSTANTS.GET_CONTRACTS}?TransporterId=${transporterId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetTransporterVehicles = (callback, TransporterId) => {
  const url = `${API_CONSTANTS.GET_VEHICLES}?TransporterId=${TransporterId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetBanks = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_BANK}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateBank = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_BANK}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateBank = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_BANK}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteBank = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_BANK + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const CreateRouteMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_ROUTE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpadteRouteMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_ROUTE_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteRouteMaster = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_ROUTE_MASTER + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetOrganizationFrom = (callback, selectedOption1) => {
  const url = `${API_CONSTANTS.GET_ALL_ORGANIZATIONS}?organization=${selectedOption1}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetRouteStopsDropdownList = (callback, selectedOption1) => {
  const url = `${API_CONSTANTS.GET_ALL_ORGANIZATIONS}?orgTypeId=${selectedOption1}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const CreateRouteStop = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_ROUTE_STOP}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateRouteStop = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_ROUTE_STOP}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteRouteStop = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_ROUTE_STOP + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetBankBranches = (callback, bankId) => {
  const url = `${API_CONSTANTS.GET_BANK_BRANCHES}?BankId=${bankId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const CreateBankBranch = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_BANK_BRANCHES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateBankBranch = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_BANK_BRANCHES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteBankBranch = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_BANK_BRANCHES + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetRateApplied = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_RATE_APPLIED}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateRateApplied = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_RATE_APPLIED}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateRateApplied = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_RATE_APPLIED}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteRateApplied = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_RATE_APPLIED + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetMilkCollections = (
  callback,
  organizationUnitId,
  startDate,
  endDate
) => {
  const url = `${API_CONSTANTS.GET_MILK_COLLECTIONS}?organizationUnitId=${organizationUnitId}&startDate=${startDate}&endDate=${endDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetMilkCollectionDetails = (callback, milkCollectionId) => {
  const url = `${API_CONSTANTS.GET_MILK_COLLECTION_DETAILS}?milkCollectionId=${milkCollectionId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetPreviousMilkData = (callback, startDate, endDate, minFatLimit, minSnfLimit, bmcId) => {
  const url = `${API_CONSTANTS.GET_MILK_COLLECTION_DETAILS}?startDate=${startDate}&endDate=${endDate}&minFatLimit=${minFatLimit}&minSnfLimit=${minSnfLimit}&bmcId=${bmcId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetProductCategory = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_CATEGORY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateProductCategory = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCT_CATEGORY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateProductCategory = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_CATEGORY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteProductCategory = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_PRODUCT_CATEGORY + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetProductMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateProductMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCT_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetProductSupRate = (callback, productId) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCT_MASTER}?id=${productId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const UpdateProductMaster = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_MASTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteProductMaster = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_PRODUCT_MASTER + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetProductPurchase = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_PURCHASE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateProductPurchase = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCT_PURCHASE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateProductPurchase = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_PURCHASE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteProductPurchase = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_PRODUCT_PURCHASE + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetProductSupply = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_SUPPLY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateProductSupply = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCT_SUPPLY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateProductSupply = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_SUPPLY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const UpdateProductSupplyIndent = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_SUPPLY_INDENT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteProductSupply = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_PRODUCT_SUPPLY + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetProductSupplyIndent = (callback, indentStatus) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_SUPPLY_INDENT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetIndentPlacedProductSupplyIndent = (callback, indentStatus) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_SUPPLY_INDENT}?indentStatus=${indentStatus}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetApprovedProductSupplyIndent = (callback, indentStatus) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_SUPPLY_INDENT}?indentStatus=${indentStatus}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetWeighBridge = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_WEIGH_BRIDGE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetWeighBridgeReport = (callback, testDate) => {
  const url = `${API_CONSTANTS.GET_WEIGH_BRIDGE}?testDate=${testDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const CreateWeighBridge = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_WEIGH_BRIDGE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const CreateWeighBridgeVehicle = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_WEIGH_BRIDGE_VEHICLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateWeighBridge = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_WEIGH_BRIDGE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteWeighBridge = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_WEIGH_BRIDGE + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetDropDownProduct = (callback, productCatId) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_PRODUCT}?productCategId=${productCatId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetDropDownTransportVehicle = (callback, id) => {
  const url = `${API_CONSTANTS.GET_DROPDOWN_TRANSPORTVEHICLE}?id=${id}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetBill = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_BILL}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetBillBmc = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_BILL_BMC}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetBillBmcRoute = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_BILL_BMC_ROUTE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetProductSupplyDispatch = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_SUPPLY_DISPATCH}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateProductSupplyDispatch = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCT_SUPPLY_DISPATCH}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateProductSupplyDispatch = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_SUPPLY_DISPATCH}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteProductSupplyDispatch = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_PRODUCT_SUPPLY_DISPATCH + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetProductSupplyReceived = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_SUPPLY_RECEIVED}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const UpdateProductSupplyReceived = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_SUPPLY_RECEIVED}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetSample = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_SAMPLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateSample = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_SAMPLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateSample = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_SAMPLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteSample = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_SAMPLE + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetDashboardMilkDetails = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DASHBOARD_MILK_DETAILS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetWeighBridgeData = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_WEIGH_BRIDGE_DATA}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetManualEntryPermission = (callback, userId, aadhaarNo) => {
  const url = `${API_CONSTANTS.GET_MANUAL_ENTRY_PERMISSION}?userId=${userId}&aadhaarNo=${aadhaarNo}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetWeighbridgeReportData = (callback, testDate) => {
  const url = `${API_CONSTANTS.GET_SAMPLE}?testDate=${testDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetWBVehicleDropdown = (callback, vehicleNo) => {
  const url = `${API_CONSTANTS.GET_WEIGH_BRIDGE}?vehicleNo=${vehicleNo}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetCSTVehicleDropdown = (callback, vehicleNo) => {
  const url = `${API_CONSTANTS.GET_MILK_DISPATCH}?vehicleNo=${vehicleNo}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetIndentProducts = (callback, indentId) => {
  const url = `${API_CONSTANTS.GET_INDENT_PRODUCTS}?indentId=${indentId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const CreateIndentProducts = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_INDENT_PRODUCTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateIndentProducts = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_INDENT_PRODUCTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteIndentProducts = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_INDENT_PRODUCTS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetWaitingVehicles = (callback, currentDate) => {
  const url = `${API_CONSTANTS.GET_WEIGH_BRIDGE}?currentDate=${currentDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetManualEntry = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_MANUAL_ENTRY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateManualEntry = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_MANUAL_ENTRY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateManualEntry = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_MANUAL_ENTRY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteManualEntry = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_MANUAL_ENTRY + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetRemoteWeighbridgeData = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_REMOTE_WEIGHBRIDGE_DATA}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetProductSalesToAgent = (callback, startDate, endDate) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_SALES_TO_AGENT}?startDate=${startDate}&endDate=${endDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetProductSalesToAgentPerBMC = (callback, startDate, endDate, bmcId) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_SALES_TO_AGENT}?startDate=${startDate}&endDate=${endDate}&bmcId=${bmcId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const CreateProductSalesToAgent = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCT_SALES_TO_AGENT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateProductSalesToAgent = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_SALES_TO_AGENT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteProductSalesToAgent = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_PRODUCT_SALES_TO_AGENT + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};


export const GetRateChart = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_RATE_CHART}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetMilkDispatchWithVehicleNo = (callback,  vehicleNo, fromDate, toDate) => {
  const url = `${API_CONSTANTS.GET_MILK_DISPATCH}?vehicleId=${vehicleNo}&fromDate=${fromDate}&toDate=${toDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetMilkDispatch = (callback, fromDate, toDate) => {
  const url = `${API_CONSTANTS.GET_MILK_DISPATCH}?fromDate=${fromDate}&toDate=${toDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetTransitlossWeighbridgeData = (callback, fromDate, toDate) => {
  const url = `${API_CONSTANTS.GET_WEIGH_BRIDGE}?fromDate=${fromDate}&toDate=${toDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetTransitlossGainReports = (callback, fromDate, toDate ,vehicleNo) => {
  const url = `${API_CONSTANTS.GET_TRANSIT_LOSS_GAIN_REPORTS}?vehicleId=${vehicleNo}&fromDate=${fromDate}&toDate=${toDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};



export const GetTransitlossWeighbridgeDataWithVehicleNo = (callback, vehicleNo, fromDate, toDate) => {
  const url = `${API_CONSTANTS.GET_WEIGH_BRIDGE}?vehicleId=${vehicleNo}&fromDate=${fromDate}&toDate=${toDate}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET
  );
};

export const GetBmcBankAdvice = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_BANK_ADVICE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetBankLetter = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_BANK_LETTER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetBmcReconcillation = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_BMC_RECONCILLATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetAgentMilkCollection = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_AGENT_MILKCOLLECTION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetAgentReconcillation = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_AGENT_RECONCILLATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetBmcWiseCollection = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_BMC_WISE_COLLECTION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetDateWiseReconcillation = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DATEWISE_RECONCILLATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetRouteWiseCollection = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_ROUTE_WISE_COLLECTION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetPaymentChecklist = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PAYMENT_CHECKLIST}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetAgentLedger = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_AGENT_LEDGER}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetMilkCollectionRoutes = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_MILK_COLLECTIONS_ROUTES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateMilkCollectionDetails = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_MILK_COLLECTION_DETAILS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateMilkCollectionDetails = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_MILK_COLLECTION_DETAILS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteMilkCollectionDetails = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_MILK_COLLECTION_DETAILS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetInwardTransportation = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_INWARD_TRANSPORTATION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetKrishibazarReport = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_KRISHIBAZAR_REPORT}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetDashboardBarChart = (callback, date) => {
  const url = `${API_CONSTANTS.GET_DASHBOARD_BAR_CHART}?date=${date}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const GetDashboardLineChart = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_DASHBOARD_LINE_CHART}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetWeighbridgeLabData = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_REMOTE_WEIGHBRIDGE_DATA_LAB}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetComplaints = (callback, billingCycleId) => {
  const url = `${API_CONSTANTS.GET_COMPLAINTS}?billingCycleId=${billingCycleId}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
  );
};

export const CreateComplaint = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_COMPLAINTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateComplaint = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_COMPLAINTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const LockMilkBill = (callback, payload) => {
  const url = `${API_CONSTANTS.LOCK_MILK_BILL}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetUnlockedBillingCycles = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_UNLOCKED_BILLING_CYCLES}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const GetProductStock = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_PRODUCT_STOCK}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const UpdateProductStock = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_PRODUCT_STOCK}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const CreateProductStock = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_PRODUCT_STOCK}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetAllNonAgents = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_ALL_NON_AGENTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateNonAgents = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_NON_AGENTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateNonAgents = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_NON_AGENTS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteNonAgents = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_NON_AGENTS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const CreateMilkCollection = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_MILK_COLLECTION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateMilkCollection = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_MILK_COLLECTION}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const LockCycle = (callback, payload) => {
  const url = `${API_CONSTANTS.LOCK_CYCLE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const GetVehicleAttendance = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_VEHICLE_ATTENDANCE}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const GetCollectionEntry = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_COLLECTION_ENTRY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateCollectionEntry = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_COLLECTION_ENTRY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateCollectionEntry = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_COLLECTION_ENTRY}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteCollectionEntry = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_COLLECITON_ENTRY + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};

export const GetAllFarmers = (callback, payload) => {
  const url = `${API_CONSTANTS.GET_ALL_FARMERS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.GET,
    payload
  );
};

export const CreateFarmers = (callback, payload) => {
  const url = `${API_CONSTANTS.CREATE_FARMERS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.POST,
    payload
  );
};

export const UpdateFarmers = (callback, payload) => {
  const url = `${API_CONSTANTS.UPDATE_FARMERS}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.PUT,
    payload
  );
};

export const DeleteFarmers = (callback, payload) => {
  const queryString = `${payload.id}`;
  const url = `${API_CONSTANTS.DELETE_FARMERS + queryString}`;
  return fetchLoginCall(
    (response) => {
      callback(response);
    },
    url,
    API_METHODS.DELETE,
    payload
  );
};