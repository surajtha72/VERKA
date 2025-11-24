import React, { useEffect, useRef, useState } from "react";
import "./BankLetter.scss";
import { GetBankLetter, GetBmcBankAdvice, GetCurrentIncentiveMaster, GetIncentiveSlab, GetPaymentChecklist, GetPreviousMilkData } from "../../../utils/apiCalls";
import html2pdf from "html2pdf.js";
import Download from "../../../../assets/images/icons/download.png";
import { IconButton, Paper } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import moment from 'moment';
import Loader from "../../../components/loader";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

const BankLetter = () => {
    const token = localStorage.getItem("token");
    const [billDetails, setBillDetails] = useState([]);
    const navigate = useNavigate();
    const [soldProducts, setSoldProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bmcName, setBmcName] = useState('');
    const handleCycle = () => {
        navigate("/cycle-list-bank-letter");
    };
    let startEndDate = localStorage.getItem("start-end-date");
    const dateParts = startEndDate.split(" - ");


    const generatePDF = () => {
        const invoiceElements = document.querySelectorAll(".letter");
        const htmlContents = [];

        invoiceElements?.forEach((content) => {
            htmlContents.push(content.innerHTML);
        });

        const combinedHTML = htmlContents.join("<div style='page-break-before:always'></div>");

        const html2pdfOptions = {
            margin: 10,
            filename: "bank advice",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 1 },
            jsPDF: { unit: "mm", format: "a3", orientation: "portrait" },
        };

        html2pdf().from(combinedHTML).set(html2pdfOptions).save();
    };

    useEffect(() => {
        setBmcName(localStorage.getItem('bmcName'));
        getBill();
    }, []);

    const getBill = () => {
        const dateRange = localStorage.getItem("start-end-date");
        const dateParts = dateRange?.split(" - ");
        const payload = {
            startDate: dateParts[0],
            endDate: dateParts[1],
            bmcId: localStorage.getItem("BMCId"),
        };
        GetBmcBankAdvice((res) => {
            setIsLoading(true); // Show the loading spinner
            let { status, data } = res;
            if (status === 200) {
                setBillDetails(data);
                // console.log("bank advice w routes--> ", data)
                setIsLoading(false); // Hide the loading spinner
            }
        }, payload);
    };


    var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    let n;
    function inWords(num) {
        if ((num = num.toString()).length > 9) return 'overflow';
        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? '' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' And Zero Paise Only ' : '';
        return str;
    }


    let grandNetPayable = 0;
    billDetails?.map((val, ind) => {
        if (val.amount > 1000 && val.organization.ifscCode == null && val.organization.accNumber != null) {
            grandNetPayable += Math.round(val.amount);
            // console.log('-----------------------------');
            // console.log(Math.round(val.amount));
        }
    }
    )

    const bankLetterRef = useRef();
    const Print = () => {
        const printContents = bankLetterRef.current?.innerHTML;
        if (printContents) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        } else {
            // console.error('Element with ref "bankLetterRef" not found.');
        }
    };

    const generateWordDocument = () => {
        const content = document.querySelector(".letter").innerHTML;
        const converted = htmlDocx.asBlob(content);

        saveAs(converted, `${bmcName} - ${dateParts[0]}/${dateParts[1]} bank_letter.docx`);
    };


    return (
        <>
            {token ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "scroll",
                        position: "relative",
                        width: "calc(100% - 18vw)",
                    }}
                >
                    <div className="back">
                        <IconButton onClick={handleCycle}>
                            <img src={images} alt="back" />
                        </IconButton>
                    </div>
                    {billDetails ? (
                        <>
                            <div style={{ width: '2vw', height: '2vw', position: 'absolute', right: '8vw', top: '.5vw' }}>
                                <IconButton onClick={generateWordDocument}>
                                    <FontAwesomeIcon style={{ height: '2vw', width: '2vw', color: 'black' }} icon={faFileWord} />
                                </IconButton>
                            </div>
                            <div style={{ width: '2vw', height: '2vw', position: 'absolute', right: '2vw', top: '.5vw' }}>
                                <IconButton onClick={generatePDF}>
                                    <FontAwesomeIcon style={{ height: '2vw', width: '2vw', color: 'black' }} icon={faFilePdf} />
                                </IconButton>
                            </div>
                            <div style={{ width: '2vw', height: '2vw', position: 'absolute', right: '5vw', top: '.5vw' }}>
                                <IconButton onClick={Print}>
                                    <FontAwesomeIcon style={{ height: '2vw', width: '2vw', color: 'black' }} icon={faPrint} />
                                </IconButton>
                            </div>
                        </>
                    ) : (
                        ""
                    )}

                    {isLoading ? (
                        <Loader />
                    ) : billDetails ? (
                        <div ref={bankLetterRef}>
                            <div className="letter">
                                <div className="letter__header">
                                    <div className="letter__header__heading">
                                        <p>A/C / MILK PAYMENT /</p>
                                        <p>0</p>
                                        <p>ADVICE</p>
                                        <p>Date:&nbsp;&nbsp;{moment(new Date()).format("DD/MM/YYYY")}</p>
                                    </div>
                                </div>
                                <div className="letter__table__header">
                                    <p style={{fontFamily: "Courier New"}} >To,</p>
                                    <p style={{fontFamily: "Courier New"}} >
                                        The Branch Manager<br />
                                        STATE BANK OF INDIA<br />
                                        B.F.T. BRANCH, BEGUSARAI<br />
                                        SUB : Credit/Debit of Accounts<br />
                                    </p>
                                </div>

                                <div className="letter__table__content">
                                    <p style={{fontFamily: "Courier New"}} >
                                        Dear Sir,<br />
                                        Please Debit my Bank Account Ganga Dairy Ltd. Account No.30090248421 with a sum<br />
                                        of Rs. <b>{parseFloat(grandNetPayable).toFixed(0)}</b><br />
                                        <b>{`Rs. ${inWords(parseFloat(grandNetPayable).toFixed(0))}`}</b><br />
                                        You are requested to credit the amount to the sundary account holders detail<br />
                                        attached with the letter.<br /><br />
                                        Thank You
                                    </p>
                                </div>
                                <div className="letter__footer">
                                    <p style={{ fontFamily: "Courier New" }}>For, Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                                    <br /><br />
                                    <p>Managing Director / Authorized Signatory</p>
                                </div>
                            </div>
                        </div>
                        // })
                    ) : (
                        <div className="empty_data">
                            <Paper elevation={3}>
                                <h1>No Data Available</h1>
                                <h3>For This Record.</h3>
                            </Paper>
                        </div>
                    )}
                </div >
            ) : (
                <Navigate to={"/"} />
            )}
        </>
    );
};

export default BankLetter;
