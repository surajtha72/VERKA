import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confirm from "../confirmModal/confirm";

function TokenVerify() {

    const currentTime = Date.now();
    const expires = localStorage.getItem("expires");
    const [sessionOk, setSessionOk] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [showConfirmModal1, setShowConfirmModal1] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (expires && currentTime > expires) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
        }
    }, [])

    const handleConfirm = () => {
        setShowConfirmModal1(false);
        if (sessionOk) {
            localStorage.clear();
            navigate("/");
        }
    };

    return (
        <>
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
        </>
    );
}

export default TokenVerify;
