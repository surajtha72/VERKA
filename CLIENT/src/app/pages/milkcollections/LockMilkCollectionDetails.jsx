import { CTable, CFormSelect, CButton } from "@coreui/react";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Navigate, useNavigate } from "react-router-dom";
import { GetBillingCycle, GetUnlockedBillingCycles, LockMilkBill } from "../../utils/apiCalls";
import Header from "../../components/header/Header";
import Confirm from "../../components/confirmModal/confirm";

const columns = [
    {
        key: "heading_1",
        label: "Select Cycle",
        _props: { scope: "col" },
    },
    {
        key: "heading_2",
        label: " ",
        _props: { scope: "col" },
    },
];

const LockMilkCollectionDetails = () => {
    const token = localStorage.getItem("token");
    const items = [];
    const [cycleTableData, setCycleTableData] = useState([]);
    const [date, setDate] = useState("");
    const [sessionOk, setSessionOk] = useState(false);
    const [showConfirmModal1, setShowConfirmModal1] = useState(false);
    const [alertText, setAlertText] = useState("");
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const currentDate = moment(new Date()).format('YYYY-MM-DD')
    // useEffect(() => {
    //     getCycle();
    // }, [currentDate]);

    // const getCycle = () => {
    //     GetBillingCycle((result) => {
    //         setCycleTableData(result.data);
    //     }, currentDate);
    // };

    useEffect(() => {
        getunlockerBillingCycles()
    }, [])
    const getunlockerBillingCycles = () => {
        GetUnlockedBillingCycles((result) => {
            setCycleTableData(result.data);
            console.log(result.data)
        });
    };

    const newData = cycleTableData?.map((item, ind) => {
        console.log('cycletabledata',item)
        return {
            ...item,
            appendDate: `${moment(item.StartDate).format('YYYY-MM-DD')} - ${moment(item.EndDate).format('YYYY-MM-DD')
                }`,
        };
    });
    console.log('newData', newData)

    const handleConfirm = () => {
        setShowConfirmModal1(false)
        if (sessionOk) {
            localStorage.clear();
            navigate("/");
        }
    };

    const handleLockMilkData = () => {
        setShowConfirmModal(true);
        // console.log(id);
    };

    const handleOk = () => {
        const dateParts = date.split(' - ');
        console.log(dateParts)
        const payload = {
            startDate: moment(dateParts[0]).format('YYYY-MM-DD'),
            endDate: moment(dateParts[1]).format('YYYY-MM-DD')
        };

        LockMilkBill((res) => {
            let { status, message, data } = res;
            if (status === 200) {
                getunlockerBillingCycles();
                setShowConfirmModal(false);
                setAlertText(message);
                setShowConfirmModal1(true);
            } else {
                setShowConfirmModal(false);
                setAlertText("Something wrong happened in API");
                setShowConfirmModal1(true);
            }
        }, payload);
    };

    {
        items?.push({
            heading_1: (
                <CFormSelect
                    size="sm"
                    onChange={(e) => {
                        setDate(e.target.value);
                        console.log('selected cyclce', e.target.value)
                    }}
                >
                    <option value={0}>Select Date</option>
                    {newData?.length &&
                        newData?.map((option, index) => {
                            // console.log(option);
                            return (
                                <option key={index} value={option.appendDate}>
                                    {option.appendDate}
                                </option>
                            );
                        })}
                </CFormSelect>
            ),
            heading_2: (
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleLockMilkData}>Lock Milk BIll</span>
            ),
        });
    }

    return (
        <>
            {token ? <div className="cyclebmc">
                <div className="cyclebmc__container">
                    <div className="cyclebmc__header">
                        <div className="cyclebmc__header__section">
                            <div className="cyclebmc__header__section__main">
                                <h5>Company: Verka</h5>
                                <h4>{`${"Finalize Milk Payroll"}`}</h4>
                            </div>
                            <div className="cyclebmc__header__section__bottom">
                                <Header />
                            </div>
                        </div>
                    </div>
                    <div className="cyclebmc__table">
                        <div
                            className="cyclebmc__table__body"
                            style={{ height: "70vh", overflowY: "scroll" }}
                        >
                            <CTable
                                columns={columns}
                                items={items}
                                hover
                                className="striped-table" />
                        </div>
                    </div>
                </div>
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
            </div> : <Navigate to={"/"} />
            }
        </>
    );
};

export default LockMilkCollectionDetails;
