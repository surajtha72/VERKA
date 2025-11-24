const BaseURL = {
  BASE_URL: `${process.env.REACT_APP_BASE_URL}`,
  // BASE_URL: `http://65.0.181.208:8080/api/v1`,
  // BASE_URL: `http://65.0.181.208:8081/api/v1`,
  // BASE_URL: `http://65.0.181.208:9001/api/v1`,
  // BASE_URL: `http://65.0.181.208:9002/api/v1`,
};

// {console.log('backend url: ',BaseURL)}

export const API_CONSTANTS = {
  LOGIN: `${BaseURL.BASE_URL}/login`,
  CHANGE_PASSWORD: `${BaseURL.BASE_URL}/login/change_password`,
  GET_ROLES: `${BaseURL.BASE_URL}/roles`,
  CREATE_ROLES: `${BaseURL.BASE_URL}/roles`,
  ENTITY_AND_PERMISSION: `${BaseURL.BASE_URL}/roles/entity_and_permissions`,
  DELETE_ROLES: `${BaseURL.BASE_URL}/roles/`,
  UPDATE_ROLES: `${BaseURL.BASE_URL}/roles`,
  GET_USER: `${BaseURL.BASE_URL}/user`,
  DELETE_USERS: `${BaseURL.BASE_URL}/user/`,
  UPDATE_USER: `${BaseURL.BASE_URL}/user`,

  GET_TRANSPORTERS: `${BaseURL.BASE_URL}/transporters`,
  CREATE_TRANSPORTERS: `${BaseURL.BASE_URL}/transporters`,
  UPDATE_TRANSPORTERS: `${BaseURL.BASE_URL}/transporters`,
  DELETE_TRANSPORTERS: `${BaseURL.BASE_URL}/transporters/`,

  GET_VEHICLES: `${BaseURL.BASE_URL}/transporters/vehicles`,
  CREATE_VEHICLES: `${BaseURL.BASE_URL}/transporters/vehicles`,
  UPDATE_VEHICLES: `${BaseURL.BASE_URL}/transporters/vehicles`,
  DELETE_VEHICLES: `${BaseURL.BASE_URL}/transporters/vehicles/`,
  GET_CONTRACTS: `${BaseURL.BASE_URL}/transporters/contracts`,
  CREATE_CONTRACTS: `${BaseURL.BASE_URL}/transporters/contracts`,
  UPDATE_CONTRACTS: `${BaseURL.BASE_URL}/transporters/contracts`,
  DELETE_CONTRACTS: `${BaseURL.BASE_URL}/transporters/contracts/`,

  GET_PROCUREMENT: `${BaseURL.BASE_URL}/procurement_center_characteristics`,
  CREATE_PROCUREMENT: `${BaseURL.BASE_URL}/procurement_center_characteristics`,
  UPDATE_PROCUREMENT: `${BaseURL.BASE_URL}/procurement_center_characteristics`,
  DELETE_PROCUREMENT: `${BaseURL.BASE_URL}/procurement_center_characteristics/`,
  GET_DROPDOWNPAYROLL: `${BaseURL.BASE_URL}/dropdown/payroll_types`,
  GET_DROPDOWNPROCUREMENT: `${BaseURL.BASE_URL}/dropdown/procurement_center_types`,
  GET_DROPDOWN_COLLECTTYPE: `${BaseURL.BASE_URL}/dropdown/default_collection_type`,
  GET_DROPDOWN_ROUTE: `${BaseURL.BASE_URL}/routes/route_type`,
  GET_DROPDOWN_OUTLET_TYPES: `${BaseURL.BASE_URL}/dropdown/outlet_types`,
  GET_DROPDOWN_ORGANIZATION_TYPES: `${BaseURL.BASE_URL}/dropdown/organization_unit_types`,
  GET_DROPDOWN_ORGANIZATION_TYPES1: `${BaseURL.BASE_URL}/dropdown/organization_unit_types`,
  GET_ORGANIZATION: `${BaseURL.BASE_URL}/organizations`,
  GET_DROPDOWN_ORGANIZATION_BMC: `${BaseURL.BASE_URL}/organizations`,
  GET_ORGANIZATION1: `${BaseURL.BASE_URL}/organizations`,
  CREATE_ORGANIZATION: `${BaseURL.BASE_URL}/organizations`,
  UPDATE_ORGANIZATION: `${BaseURL.BASE_URL}/organizations`,
  DELETE_ORGANIZATION: `${BaseURL.BASE_URL}/organizations/`,
  GET_ALL_ORGANIZATIONS: `${BaseURL.BASE_URL}/all_organizations/`, 

  GET_DROPDOWN_STATE: `${BaseURL.BASE_URL}/states`,
  GET_DROPDOWN_DISTRICT: `${BaseURL.BASE_URL}/district/`,
  GET_DROPDOWN_TALUKAS: `${BaseURL.BASE_URL}/talukas`,

  CREATE_STATE: `${BaseURL.BASE_URL}/states`,
  UPDATE_STATES: `${BaseURL.BASE_URL}/states`,
  DELETE_STATES: `${BaseURL.BASE_URL}/states/`,
  CREATE_DISTRICT: `${BaseURL.BASE_URL}/district`,
  DELETE_DISTRICTS: `${BaseURL.BASE_URL}/district/`,
  UPDATE_DISTRICT: `${BaseURL.BASE_URL}/district`,
  GET_TALUKAS: `${BaseURL.BASE_URL}/talukas/`,
  CREATE_TALUKAS: `${BaseURL.BASE_URL}/talukas`,
  DELETE_TALUKAS: `${BaseURL.BASE_URL}/talukas/`,
  UPDATE_TALUKAS: `${BaseURL.BASE_URL}/talukas`,
  GET_DISTRICTS: `${BaseURL.BASE_URL}/district`,

  GET_RATE_MASTER: `${BaseURL.BASE_URL}/rate_master`,
  GET_SHIFT_APPLICABLE: `${BaseURL.BASE_URL}/dropdown/shifts_applicable`,
  DELETE_RATE_MASTER: `${BaseURL.BASE_URL}/rate_master/`,
  CREATE_RATE_MASTER: `${BaseURL.BASE_URL}/rate_master`,
  UPDATE_RATE_MASTER: `${BaseURL.BASE_URL}/rate_master`,
  CREATE_USERS: `${BaseURL.BASE_URL}/user`,

  GET_PRODUCTS: `${BaseURL.BASE_URL}/products`,
  CREATE_PRODUCTS: `${BaseURL.BASE_URL}/products`,
  UPDATE_PRODUCTS: `${BaseURL.BASE_URL}/products`,
  DELETE_PRODUCTS: `${BaseURL.BASE_URL}/products/`,

  GET_FINYEAR: `${BaseURL.BASE_URL}/financial_year`,
  CREATE_FINYEAR: `${BaseURL.BASE_URL}/financial_year`,
  UPDATE_FINYEAR: `${BaseURL.BASE_URL}/financial_year`,
  DELETE_FINYEAR: `${BaseURL.BASE_URL}/financial_year/`,
  GET_DROPDOWN_FINYEAR: `${BaseURL.BASE_URL}/financial_year`,

  GET_CYCLE: `${BaseURL.BASE_URL}/cycle_master`,
  CREATE_CYCLE: `${BaseURL.BASE_URL}/cycle_master`,
  UPDATE_CYCLE: `${BaseURL.BASE_URL}/cycle_master`,
  DELETE_CYCLE: `${BaseURL.BASE_URL}/cycle_master/`,
  GET_BILL:`${BaseURL.BASE_URL}/cycle_master/get_bill`,
  GET_BILL_BMC:`${BaseURL.BASE_URL}/cycle_master/get_bill_bmc`,
  GET_BILL_BMC_ROUTE:`${BaseURL.BASE_URL}/cycle_master/get_bill_bmc_routes`,

  GET_ROUTE_STOPS: `${BaseURL.BASE_URL}/route_stops`,
  CREATE_ROUTE_STOP: `${BaseURL.BASE_URL}/route_stops`,
  UPDATE_ROUTE_STOP: `${BaseURL.BASE_URL}/route_stops`,
  DELETE_ROUTE_STOP: `${BaseURL.BASE_URL}/route_stops/`,

  GET_ROUTE_MASTER: `${BaseURL.BASE_URL}/route_master`,
  CREATE_ROUTE_MASTER: `${BaseURL.BASE_URL}/route_master`,
  UPDATE_ROUTE_MASTER: `${BaseURL.BASE_URL}/route_master`,
  DELETE_ROUTE_MASTER: `${BaseURL.BASE_URL}/route_master/`,

  GET_ROUTE_TYPE: `${BaseURL.BASE_URL}/routes/route_type`,
  CREATE_ROUTE_TYPE: `${BaseURL.BASE_URL}/routes/route_type`,
  DELETE_ROUTE_TYPE: `${BaseURL.BASE_URL}/routes/route_type/`,
  UPDATE_ROUTE_TYPE: `${BaseURL.BASE_URL}/routes/route_type`,

  GET_BANK: `${BaseURL.BASE_URL}/banks`,
  CREATE_BANK: `${BaseURL.BASE_URL}/banks`,
  DELETE_BANK: `${BaseURL.BASE_URL}/banks/`,
  UPDATE_BANK: `${BaseURL.BASE_URL}/banks`,

  GET_BANK_BRANCHES: `${BaseURL.BASE_URL}/bank/branches/`,
  CREATE_BANK_BRANCHES: `${BaseURL.BASE_URL}/bank/branches`,
  DELETE_BANK_BRANCHES: `${BaseURL.BASE_URL}/bank/branches/`,
  UPDATE_BANK_BRANCHES: `${BaseURL.BASE_URL}/bank/branches`,

  GET_INCENTIVE_MASTER: `${BaseURL.BASE_URL}/incentive_master`,
  CREATE_INCENTIVE_MASTER: `${BaseURL.BASE_URL}/incentive_master`,
  UPDATE_INCENTIVE_MASTER: `${BaseURL.BASE_URL}/incentive_master`,
  DELETE_INCENTIVE_MASTER: `${BaseURL.BASE_URL}/incentive_master/`,

  GET_INCENTIVE_SLABS: `${BaseURL.BASE_URL}/incentive_slab`,
  CREATE_INCENTIVE_SLABS: `${BaseURL.BASE_URL}/incentive_slab`,
  UPDATE_INCENTIVE_SLABS: `${BaseURL.BASE_URL}/incentive_slab`,
  DELETE_INCENTIVE_SLABS: `${BaseURL.BASE_URL}/incentive_slab/`,

  GET_RATE_APPLIED: `${BaseURL.BASE_URL}/rate_applied`,
  CREATE_RATE_APPLIED: `${BaseURL.BASE_URL}/rate_applied`,
  DELETE_RATE_APPLIED: `${BaseURL.BASE_URL}/rate_applied/`,
  UPDATE_RATE_APPLIED: `${BaseURL.BASE_URL}/rate_applied`,

  GET_MILK_COLLECTIONS: `${BaseURL.BASE_URL}/milk_collections/portal`,
  GET_MILK_COLLECTION_DETAILS: `${BaseURL.BASE_URL}/milk_collection_details/`,
  CREATE_MILK_COLLECTION_DETAILS: `${BaseURL.BASE_URL}/milk_collection_details`,
  UPDATE_MILK_COLLECTION_DETAILS: `${BaseURL.BASE_URL}/milk_collection_details`,
  DELETE_MILK_COLLECTION_DETAILS: `${BaseURL.BASE_URL}/milk_collection_details/`,

  GET_PRODUCT_CATEGORY: `${BaseURL.BASE_URL}/product_category`,
  CREATE_PRODUCT_CATEGORY: `${BaseURL.BASE_URL}/product_category`,
  DELETE_PRODUCT_CATEGORY: `${BaseURL.BASE_URL}/product_category/`,
  UPDATE_PRODUCT_CATEGORY: `${BaseURL.BASE_URL}/product_category`,

  GET_PRODUCT_MASTER: `${BaseURL.BASE_URL}/product_master`,
  CREATE_PRODUCT_MASTER: `${BaseURL.BASE_URL}/product_master`,
  DELETE_PRODUCT_MASTER: `${BaseURL.BASE_URL}/product_master/`,
  UPDATE_PRODUCT_MASTER: `${BaseURL.BASE_URL}/product_master`,

  GET_PRODUCT_SUPPLY: `${BaseURL.BASE_URL}/product_supply`,
  CREATE_PRODUCT_SUPPLY: `${BaseURL.BASE_URL}/product_supply`,
  DELETE_PRODUCT_SUPPLY: `${BaseURL.BASE_URL}/product_supply/`,
  UPDATE_PRODUCT_SUPPLY: `${BaseURL.BASE_URL}/product_supply`,

  GET_PRODUCT_SUPPLY_INDENT: `${BaseURL.BASE_URL}/product_supply_indent`,
  UPDATE_PRODUCT_SUPPLY_INDENT: `${BaseURL.BASE_URL}/product_supply_indent`,

  GET_PRODUCT_PURCHASE: `${BaseURL.BASE_URL}/product_purchase`,
  CREATE_PRODUCT_PURCHASE: `${BaseURL.BASE_URL}/product_purchase`,
  DELETE_PRODUCT_PURCHASE: `${BaseURL.BASE_URL}/product_purchase/`,
  UPDATE_PRODUCT_PURCHASE: `${BaseURL.BASE_URL}/product_purchase`,

  GET_WEIGH_BRIDGE: `${BaseURL.BASE_URL}/weigh_bridge`,
  CREATE_WEIGH_BRIDGE: `${BaseURL.BASE_URL}/weigh_bridge`,
  DELETE_WEIGH_BRIDGE: `${BaseURL.BASE_URL}/weigh_bridge/`,
  UPDATE_WEIGH_BRIDGE: `${BaseURL.BASE_URL}/weigh_bridge`,
  CREATE_WEIGH_BRIDGE_VEHICLE: `${BaseURL.BASE_URL}/weigh_bridge/vehicle`,

  GET_DROPDOWN_PRODUCT: `${BaseURL.BASE_URL}/product_master/`,

  GET_DROPDOWN_TRANSPORTVEHICLE: `${BaseURL.BASE_URL}/transporters/`,

  GET_PRODUCT_SUPPLY_DISPATCH: `${BaseURL.BASE_URL}/product_supply_dispatch`,
  CREATE_PRODUCT_SUPPLY_DISPATCH: `${BaseURL.BASE_URL}/product_supply_dispatch`,
  DELETE_PRODUCT_SUPPLY_DISPATCH: `${BaseURL.BASE_URL}/product_supply_dispatch/`,
  UPDATE_PRODUCT_SUPPLY_DISPATCH: `${BaseURL.BASE_URL}/product_supply_dispatch`,

  GET_PRODUCT_SUPPLY_RECEIVED: `${BaseURL.BASE_URL}/product_supply_received`,
  UPDATE_PRODUCT_SUPPLY_RECEIVED: `${BaseURL.BASE_URL}/product_supply_received`,

  GET_SAMPLE: `${BaseURL.BASE_URL}/composite_sample`,
  CREATE_SAMPLE: `${BaseURL.BASE_URL}/composite_sample`,
  DELETE_SAMPLE: `${BaseURL.BASE_URL}/composite_sample/`,
  UPDATE_SAMPLE: `${BaseURL.BASE_URL}/composite_sample`,

  GET_DASHBOARD_MILK_DETAILS: `${BaseURL.BASE_URL}/get_milk_details_weight`,
  GET_DASHBOARD_BAR_CHART: `${BaseURL.BASE_URL}/get_milk_details_weight/bargraph_data`,
  GET_DASHBOARD_LINE_CHART: `${BaseURL.BASE_URL}/get_milk_details_weight/linegraph_data`,

  GET_WEIGH_BRIDGE_DATA: `${BaseURL.BASE_URL}/weighbridge_data`,
  GET_MANUAL_ENTRY_PERMISSION: `${BaseURL.BASE_URL}/manual_entry`,

  GET_MILK_DISPATCH: `${BaseURL.BASE_URL}/milk_dispatch`,

  GET_INDENT_PRODUCTS: `${BaseURL.BASE_URL}/indent_products`,
  CREATE_INDENT_PRODUCTS: `${BaseURL.BASE_URL}/indent_products`,
  UPDATE_INDENT_PRODUCTS: `${BaseURL.BASE_URL}/indent_products`,
  DELETE_INDENT_PRODUCTS: `${BaseURL.BASE_URL}/indent_products`,
  GET_MANUAL_ENTRY: `${BaseURL.BASE_URL}/allow_manual_entry`,
  CREATE_MANUAL_ENTRY: `${BaseURL.BASE_URL}/allow_manual_entry`,
  UPDATE_MANUAL_ENTRY: `${BaseURL.BASE_URL}/allow_manual_entry`,
  DELETE_MANUAL_ENTRY: `${BaseURL.BASE_URL}/allow_manual_entry`,

  GET_REMOTE_WEIGHBRIDGE_DATA: `${BaseURL.BASE_URL}/get_weighbridge_data`,
  GET_REMOTE_WEIGHBRIDGE_DATA_LAB: `${BaseURL.BASE_URL}/get_weighbridge_data/lab`,

  GET_PRODUCT_SALES_TO_AGENT: `${BaseURL.BASE_URL}/product_sales_to_agent`,
  CREATE_PRODUCT_SALES_TO_AGENT: `${BaseURL.BASE_URL}/product_sales_to_agent`,
  UPDATE_PRODUCT_SALES_TO_AGENT: `${BaseURL.BASE_URL}/product_sales_to_agent`,
  DELETE_PRODUCT_SALES_TO_AGENT: `${BaseURL.BASE_URL}/product_sales_to_agent/`,

  GET_RATE_CHART: `${BaseURL.BASE_URL}/get_rate_chart/ratechart`,
  GET_BANK_ADVICE: `${BaseURL.BASE_URL}/cycle_master/get_bank_advice`,
  GET_BANK_LETTER: `${BaseURL.BASE_URL}/cycle_master/get_bank_letter_amount`,

  GET_BMC_RECONCILLATION: `${BaseURL.BASE_URL}/cycle_master/get_bmc_snf_reconcillation`,
  GET_AGENT_MILKCOLLECTION: `${BaseURL.BASE_URL}/cycle_master/get_agent_milk_collection`,
  GET_BMC_WISE_COLLECTION: `${BaseURL.BASE_URL}/cycle_master/get_bmc_wise_milk_collection`,
  GET_DATEWISE_RECONCILLATION: `${BaseURL.BASE_URL}/cycle_master/get_date_bmc_wise_milk_collection`,
  GET_AGENT_RECONCILLATION: `${BaseURL.BASE_URL}/cycle_master/get_date_wise_agent_collection`,
  GET_ROUTE_WISE_COLLECTION: `${BaseURL.BASE_URL}/cycle_master/get_route_wise_bmc_milk_collection`,
  GET_PAYMENT_CHECKLIST: `${BaseURL.BASE_URL}/cycle_master/get_payout_check_list`,
  GET_AGENT_LEDGER: `${BaseURL.BASE_URL}/cycle_master/get_agent_ledger`,

  GET_MILK_COLLECTIONS_ROUTES: `${BaseURL.BASE_URL}/milk_collections/routes`,  
  GET_INWARD_TRANSPORTATION: `${BaseURL.BASE_URL}/inward_transportation`,
  GET_KRISHIBAZAR_REPORT: `${BaseURL.BASE_URL}/cycle_master/krishibazar_report`,

  GET_COMPLAINTS: `${BaseURL.BASE_URL}/complaints`,
  CREATE_COMPLAINTS: `${BaseURL.BASE_URL}/complaints`,
  UPDATE_COMPLAINTS: `${BaseURL.BASE_URL}/complaints`,
  LOCK_MILK_BILL: `${BaseURL.BASE_URL}/milk_collections/lock_milk_bill`,
  GET_UNLOCKED_BILLING_CYCLES: `${BaseURL.BASE_URL}/milk_collections/unlocked_billing_cycles`,

  GET_PRODUCT_STOCK : `${BaseURL.BASE_URL}/product_stock`,
  CREATE_PRODUCT_STOCK: `${BaseURL.BASE_URL}/product_stock`,
  UPDATE_PRODUCT_STOCK: `${BaseURL.BASE_URL}/product_stock`,

  GET_TRANSIT_LOSS_GAIN_REPORTS: `${BaseURL.BASE_URL}/weigh_bridge/get_transit_loss_gain_reports`,

  GET_ALL_NON_AGENTS: `${BaseURL.BASE_URL}/non-agents/`, 
  CREATE_NON_AGENTS: `${BaseURL.BASE_URL}/non-agents`,
  UPDATE_NON_AGENTS: `${BaseURL.BASE_URL}/non-agents`,
  DELETE_NON_AGENTS: `${BaseURL.BASE_URL}/non-agents/`,

  CREATE_MILK_COLLECTION: `${BaseURL.BASE_URL}/milk_collections`,
  UPDATE_MILK_COLLECTION: `${BaseURL.BASE_URL}/milk_collections`,

  LOCK_CYCLE: `${BaseURL.BASE_URL}/cycle_master/lock_cycle`,
  GET_VEHICLE_ATTENDANCE: `${BaseURL.BASE_URL}/inward_transportation/vehicle_attendance`,
  GET_COLLECTION_ENTRY: `${BaseURL.BASE_URL}/collection_entry`,
  CREATE_COLLECTION_ENTRY: `${BaseURL.BASE_URL}/collection_entry`,
  UPDATE_COLLECTION_ENTRY: `${BaseURL.BASE_URL}/collection_entry`,
  DELETE_COLLECTION_ENTRY: `${BaseURL.BASE_URL}/collection_entry`,

  GET_ALL_FARMERS: `${BaseURL.BASE_URL}/farmers/`, 
  CREATE_FARMERS: `${BaseURL.BASE_URL}/farmers`,
  UPDATE_FARMERS: `${BaseURL.BASE_URL}/farmers`,
  DELETE_FARMERS: `${BaseURL.BASE_URL}/farmers/`,
};
export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  UPDATE: "UPDATE",
  PUT: "PUT",
};
