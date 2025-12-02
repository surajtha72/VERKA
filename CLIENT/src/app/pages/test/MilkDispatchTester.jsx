import React, { useEffect, useState } from "react";

const defaultStop = {
  bmcId: "",
  sequence: 1,
  qty: 0,
  fat: "",
  snf: "",
  clr: "",
  arrivedAt: "",
  leftAt: "",
};

function getLocalDateTimeForInput() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mi = pad(now.getMinutes());
  // format suitable for <input type="datetime-local">
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function MilkDispatchTester() {
  const [apiBase] = useState("http://localhost:7000/api/v1");
  const [token, setToken] = useState("");
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [dispatchedAt, setDispatchedAt] = useState(getLocalDateTimeForInput());

  // tanker start quality
  const [tankerStartFat, setTankerStartFat] = useState("");
  const [tankerStartSnf, setTankerStartSnf] = useState("");
  const [tankerStartClr, setTankerStartClr] = useState("");

  const [stops, setStops] = useState([{ ...defaultStop }]);
  const [routesData, setRoutesData] = useState([]);
  const [selectedRouteVehicleIndex, setSelectedRouteVehicleIndex] =
    useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // on mount: read token & user details; fetch BMC-specific routes
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserDetails = localStorage.getItem("userDetails");

    if (storedToken) {
      setToken(storedToken);

      // prefill first stop BMC ID if orgUnitId is stored
      if (storedUserDetails) {
        try {
          const user = JSON.parse(storedUserDetails);
          const orgUnitId = user.organizationUnitId || user.orgUnitId;
          if (orgUnitId) {
            setStops([
              {
                ...defaultStop,
                bmcId: orgUnitId,
                sequence: 1,
              },
            ]);
          }
        } catch (e) {
          // ignore parse errors
        }
      }

      // fetch only routes/vehicles for this BMC
      fetch(`${apiBase}/milk_dispatch/bmc-routes`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.status === 200 && data?.data) {
            setRoutesData(data.data);
          } else {
            console.warn("bmc-routes error:", data);
          }
        })
        .catch((err) => console.error("bmc-routes fetch error", err));
    }
  }, [apiBase]);

  const updateStop = (index, field, value) => {
    const copy = [...stops];
    copy[index] = { ...copy[index], [field]: value };
    setStops(copy);
  };

  const addStop = () => {
    setStops([...stops, { ...defaultStop, sequence: stops.length + 1 }]);
  };

  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleRouteVehicleChange = (e) => {
    const idx = e.target.value;
    setSelectedRouteVehicleIndex(idx);

    if (idx === "") {
      setRouteId("");
      setVehicleId("");
      return;
    }

    const item = routesData[idx];
    if (item) {
      setRouteId(item.route?.id);
      setVehicleId(item.vehicle?.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const dispatchedAtIso = dispatchedAt
        ? new Date(dispatchedAt).toISOString()
        : undefined;

      const payload = {
        routeId,
        transporterVehicleId: vehicleId,
        dispatchedAt: dispatchedAtIso,
        tankerStartFat: tankerStartFat ? Number(tankerStartFat) : 0,
        tankerStartSnf: tankerStartSnf ? Number(tankerStartSnf) : 0,
        tankerStartClr: tankerStartClr ? Number(tankerStartClr) : 0,
        stops: stops.map((s) => ({
          bmcId: s.bmcId,
          sequence: Number(s.sequence),
          qty: Number(s.qty),
          fat: s.fat ? Number(s.fat) : undefined,
          snf: s.snf ? Number(s.snf) : undefined,
          clr: s.clr ? Number(s.clr) : undefined,
          arrivedAt: s.arrivedAt || undefined,
          leftAt: s.leftAt || undefined,
        })),
      };

      const res = await fetch(`${apiBase}/milk_dispatch/with-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !!routeId && !!vehicleId && !loading;

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h2>Milk Dispatch – Tanker Dispatch (Step 3 Only)</h2>

      <form onSubmit={handleSubmit}>
        {/* Route + Vehicle */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Route + Vehicle (for this BMC):
            <select
              style={{ marginLeft: 8, width: 400 }}
              value={selectedRouteVehicleIndex}
              onChange={handleRouteVehicleChange}
            >
              <option value="">-- Select --</option>
              {routesData.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.route?.routeName} - {item.vehicle?.registrationNo}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Dispatch date-time (auto current) */}
        <div style={{ marginBottom: 10 }}>
          <label>
            Dispatched At:
            <input
              type="datetime-local"
              style={{ marginLeft: 8, width: 250 }}
              value={dispatchedAt}
              onChange={(e) => setDispatchedAt(e.target.value)}
            />
          </label>
          <span style={{ marginLeft: 8, fontSize: 12, color: "#555" }}>
            (Auto-filled with current date & time, editable)
          </span>
        </div>

        {/* Tanker start quality */}
        <h3>Tanker Start Quality</h3>
        <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
          <label>
            Start Fat:
            <input
              type="number"
              step="0.01"
              style={{ marginLeft: 8, width: 80 }}
              value={tankerStartFat}
              onChange={(e) => setTankerStartFat(e.target.value)}
            />
          </label>
          <label>
            Start SNF:
            <input
              type="number"
              step="0.01"
              style={{ marginLeft: 8, width: 80 }}
              value={tankerStartSnf}
              onChange={(e) => setTankerStartSnf(e.target.value)}
            />
          </label>
          <label>
            Start CLR:
            <input
              type="number"
              step="0.01"
              style={{ marginLeft: 8, width: 80 }}
              value={tankerStartClr}
              onChange={(e) => setTankerStartClr(e.target.value)}
            />
          </label>
        </div>

        {/* Stops – this BMC + others */}
        <h3>BMC Stops in this Route</h3>
        {stops.map((s, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
            }}
          >
            <div>
              <strong>Stop #{i + 1}</strong>
              {stops.length > 1 && (
                <button
                  type="button"
                  style={{ marginLeft: 10 }}
                  onClick={() => removeStop(i)}
                >
                  Remove
                </button>
              )}
            </div>
            <div>
              <label>
                BMC Id:
                <input
                  style={{ marginLeft: 8, width: 250 }}
                  value={s.bmcId}
                  onChange={(e) => updateStop(i, "bmcId", e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Sequence:
                <input
                  type="number"
                  style={{ marginLeft: 8, width: 80 }}
                  value={s.sequence}
                  onChange={(e) => updateStop(i, "sequence", e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Qty (L):
                <input
                  type="number"
                  style={{ marginLeft: 8, width: 100 }}
                  value={s.qty}
                  onChange={(e) => updateStop(i, "qty", e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Fat:
                <input
                  type="number"
                  step="0.01"
                  style={{ marginLeft: 8, width: 80 }}
                  value={s.fat}
                  onChange={(e) => updateStop(i, "fat", e.target.value)}
                />
              </label>
              <label style={{ marginLeft: 10 }}>
                SNF:
                <input
                  type="number"
                  step="0.01"
                  style={{ marginLeft: 8, width: 80 }}
                  value={s.snf}
                  onChange={(e) => updateStop(i, "snf", e.target.value)}
                />
              </label>
              <label style={{ marginLeft: 10 }}>
                CLR:
                <input
                  type="number"
                  step="0.01"
                  style={{ marginLeft: 8, width: 80 }}
                  value={s.clr}
                  onChange={(e) => updateStop(i, "clr", e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Arrived At:
                <input
                  type="datetime-local"
                  style={{ marginLeft: 8, width: 200 }}
                  value={s.arrivedAt}
                  onChange={(e) => updateStop(i, "arrivedAt", e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Left At:
                <input
                  type="datetime-local"
                  style={{ marginLeft: 8, width: 200 }}
                  value={s.leftAt}
                  onChange={(e) => updateStop(i, "leftAt", e.target.value)}
                />
              </label>
            </div>
          </div>
        ))}

        <button type="button" onClick={addStop}>
          + Add Another BMC Stop
        </button>

        <div style={{ marginTop: 20 }}>
          <button type="submit" disabled={!canSubmit}>
            {loading ? "Submitting..." : "Submit Dispatch"}
          </button>
        </div>
      </form>

      <hr />

      <h3>Response</h3>
      <pre
        style={{
          background: "#f5f5f5",
          padding: 10,
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {response ? JSON.stringify(response, null, 2) : "No response yet"}
      </pre>
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import {
//   GetMilkCollections,
//   GetTransitlossGainReports,
//   GetVehicles,
//   GetOrganization1,
// } from "../../utils/apiCalls"; // adjust path if needed

// function getTodayDateForInput() {
//   const now = new Date();
//   const pad = (n) => n.toString().padStart(2, "0");
//   const yyyy = now.getFullYear();
//   const mm = pad(now.getMonth() + 1);
//   const dd = pad(now.getDate());
//   return `${yyyy}-${mm}-${dd}`;
// }

// // safely extract YYYY-MM-DD from various date/datetime strings
// function extractDatePart(value) {
//   if (!value) return null;
//   const str = String(value);
//   if (str.length >= 10) {
//     // "2025-11-29T07:07:00.000Z" or "2025-11-29 07:07:00"
//     return str.slice(0, 10);
//   }
//   return str; // if API already sends "2025-11-29"
// }

// export default function BmcReconciliationTester() {
//   const [token, setToken] = useState("");

//   const [vehicleId, setVehicleId] = useState("");
//   const [fromDate, setFromDate] = useState(getTodayDateForInput());
//   const [toDate, setToDate] = useState(getTodayDateForInput());

//   const [bmcOptions, setBmcOptions] = useState([]);
//   const [vehicleOptions, setVehicleOptions] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [summaryRows, setSummaryRows] = useState([]);
//   const [rawMilkCollections, setRawMilkCollections] = useState(null);
//   const [rawTransitReports, setRawTransitReports] = useState(null);
//   const [error, setError] = useState("");

//   // read token & user details; load BMCs and Vehicles
//   useEffect(() => {
//     const storedToken =
//       localStorage.getItem("token") || localStorage.getItem("authToken");
//     if (storedToken) {
//       setToken(storedToken);
//     }

//     // load BMC (org units) – same as MilkCollection (GetOrganization1(..., 4))
//     GetOrganization1((res) => {
//       if (res.status === 200 && Array.isArray(res.data)) {
//         setBmcOptions(res.data);
//       }
//     }, 4);

//     // load vehicles – same as your TransitLossGainReportS
//     GetVehicles((res) => {
//       if (res.status === 200 && Array.isArray(res.data)) {
//         setVehicleOptions(res.data);
//       }
//     });
//   }, []);

//   const canSubmit =
//     !!vehicleId &&
//     !!fromDate &&
//     !!toDate &&
//     !loading;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!canSubmit) return;

//     setLoading(true);
//     setError("");
//     setSummaryRows([]);
//     setRawMilkCollections(null);
//     setRawTransitReports(null);

//     // helper map: BMC id -> name (from GetOrganization1)
//     const bmcNameById = {};
//     bmcOptions.forEach((b) => {
//       if (b.id != null) {
//         bmcNameById[String(b.id)] = b.name || String(b.id);
//       }
//     });

//     // 1) Get transit loss/gain reports (vehicle/tanker side)
//     GetTransitlossGainReports(
//       async (transitRes) => {
//         setRawTransitReports(transitRes);

//         if (transitRes.status !== 200) {
//           setLoading(false);
//           setError(
//             `transit_loss_gain_reports error: ${
//               transitRes.message || "Unknown error"
//             }`
//           );
//           return;
//         }

//         const transitData = Array.isArray(transitRes.data)
//           ? transitRes.data
//           : [];

//         if (!transitData.length) {
//           setSummaryRows([]);
//           setLoading(false);
//           return;
//         }

//         // 2) Collect unique BMC IDs from this transit data
//         const bmcIdSet = new Set();
//         for (const item of transitData) {
//           if (Array.isArray(item.BmcStockSummary)) {
//             for (const b of item.BmcStockSummary) {
//               const id = b.OrganizationUnitId != null ? b.OrganizationUnitId : b.BmcId;
//               if (id != null) bmcIdSet.add(id);
//             }
//           }
//           if (Array.isArray(item.Dispatches)) {
//             for (const d of item.Dispatches) {
//               if (d.BmcId != null) bmcIdSet.add(d.BmcId);
//             }
//           }
//         }

//         const bmcIdArray = Array.from(bmcIdSet);
//         if (!bmcIdArray.length) {
//           // nothing to reconcile
//           setSummaryRows([]);
//           setLoading(false);
//           return;
//         }

//         // 3) For each BMC, call GetMilkCollections(bmcId, fromDate, toDate)
//         const milkPromises = bmcIdArray.map(
//           (id) =>
//             new Promise((resolve) => {
//               GetMilkCollections(
//                 (milkRes) => resolve({ bmcId: id, res: milkRes }),
//                 id,
//                 fromDate,
//                 toDate
//               );
//             })
//         );

//         const allMilk = await Promise.all(milkPromises);
//         // debug: array of {bmcId, res}
//         setRawMilkCollections(allMilk);

//         // 4) Build collected map: per BMC + per date (+ shift) how much was collected
//         // structure: { [bmcId]: { [date]: { totalCollected, shifts: { [shift]: kg } } } }
//         const collectedByBmcAndDate = {};

//         for (const { bmcId, res } of allMilk) {
//           if (!res || res.status !== 200 || !Array.isArray(res.data)) continue;

//           const bKey = String(bmcId);
//           if (!collectedByBmcAndDate[bKey]) {
//             collectedByBmcAndDate[bKey] = {};
//           }

//           for (const item of res.data) {
//             const dt =
//               item.collectionDateTime ||
//               item.collection_date_time ||
//               item.collectionDate ||
//               item.CollectionDateTime ||
//               item.CollectionDate;

//             const dateKey = extractDatePart(dt);
//             if (!dateKey) continue;

//             const weight =
//               item.totalWeight != null
//                 ? Number(item.totalWeight)
//                 : item.total_weight != null
//                 ? Number(item.total_weight)
//                 : item.weight != null
//                 ? Number(item.weight)
//                 : item.Weight != null
//                 ? Number(item.Weight)
//                 : 0;

//             if (!Number.isFinite(weight) || weight === 0) continue;

//             const shiftRaw =
//               item.shift ||
//               item.Shift ||
//               item.collectionShift ||
//               item.CollectionShift ||
//               "";
//             const shiftKey = shiftRaw ? String(shiftRaw).toUpperCase() : "NA";

//             if (!collectedByBmcAndDate[bKey][dateKey]) {
//               collectedByBmcAndDate[bKey][dateKey] = {
//                 totalCollected: 0,
//                 shifts: {},
//               };
//             }

//             const bucket = collectedByBmcAndDate[bKey][dateKey];
//             bucket.totalCollected += weight;
//             bucket.shifts[shiftKey] =
//               (bucket.shifts[shiftKey] || 0) + weight;
//           }
//         }

//         // 5) Combine into final per-day-per-BMC rows
//         const rows = [];

//         for (const item of transitData) {
//           const reportDateKey = extractDatePart(item.ReportDate);
//           if (!reportDateKey) continue;

//           const bmcStockSummary = Array.isArray(item.BmcStockSummary)
//             ? item.BmcStockSummary
//             : [];

//           for (const b of bmcStockSummary) {
//             const rawBmcId =
//               b.OrganizationUnitId != null ? b.OrganizationUnitId : b.BmcId;
//             if (rawBmcId == null) continue;

//             const bKey = String(rawBmcId);
//             const opening = Number(b.OpeningWeight ?? 0);
//             const dispatched = Number(b.DispatchedWeight ?? 0);

//             const collectedBucket =
//               collectedByBmcAndDate[bKey] &&
//               collectedByBmcAndDate[bKey][reportDateKey];
//             const collected = collectedBucket
//               ? collectedBucket.totalCollected
//               : 0;

//             const closing = opening + collected - dispatched;

//             const shiftsArray =
//               collectedBucket && collectedBucket.shifts
//                 ? Object.entries(collectedBucket.shifts).map(
//                     ([shift, wt]) => ({
//                       shift,
//                       collectedKg: Number(wt.toFixed(2)),
//                     })
//                   )
//                 : [];

//             rows.push({
//               slNo: rows.length + 1,
//               date: reportDateKey,
//               bmcId: bKey,
//               bmcName: bmcNameById[bKey] || bKey,
//               openingKg: Number(opening.toFixed(2)),
//               collectedKg: Number(collected.toFixed(2)),
//               dispatchedKg: Number(dispatched.toFixed(2)),
//               closingKg: Number(closing.toFixed(2)),
//               shifts: shiftsArray,
//             });
//           }
//         }

//         // sort rows by date then BMC id (optional but nice)
//         rows.sort((a, b) => {
//           if (a.date < b.date) return -1;
//           if (a.date > b.date) return 1;
//           if (a.bmcId < b.bmcId) return -1;
//           if (a.bmcId > b.bmcId) return 1;
//           return 0;
//         });

//         setSummaryRows(rows);
//         setLoading(false);
//       },
//       fromDate,
//       toDate,
//       vehicleId
//     );
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 1200 }}>
//       <h2>BMC Milk Reconciliation Tester</h2>
//       <p style={{ fontSize: 13, color: "#555" }}>
//         Inputs:
//         <br />
//         • <b>Vehicle</b> + <b>From / To dates</b>
//         <br />
//         Logic:
//         <br />
//         • Call{" "}
//         <code>GetTransitlossGainReports(fromDate, toDate, vehicleId)</code> to
//         get <b>per-BMC dispatched &amp; opening</b> (via{" "}
//         <code>BmcStockSummary</code> &amp; <code>Dispatches[].BmcId</code>).
//         <br />
//         • For every <b>BMC ID</b> found, call{" "}
//         <code>GetMilkCollections(bmcId, fromDate, toDate)</code> to get{" "}
//         <b>collected</b> milk (day/shift-wise).
//         <br />
//         • For each <b>Day + BMC</b> compute:{" "}
//         <code>Closing = Opening + Collected − Dispatched</code>.
//       </p>

//       <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
//         {/* Vehicle dropdown */}
//         <div style={{ marginBottom: 10 }}>
//           <label>
//             Vehicle:{" "}
//             <select
//               style={{ marginLeft: 8, minWidth: 250 }}
//               value={vehicleId}
//               onChange={(e) => setVehicleId(e.target.value)}
//             >
//               <option value="">-- Select Vehicle --</option>
//               {vehicleOptions.map((v) => (
//                 <option key={v.id ?? v.Id} value={v.id ?? v.Id}>
//                   {v.registrationNumber ||
//                     v.registrationNo ||
//                     v.RegistrationNo ||
//                     v.Id}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </div>

//         {/* Date range */}
//         <div style={{ marginBottom: 10 }}>
//           <label>
//             From Date:{" "}
//             <input
//               type="date"
//               style={{ marginLeft: 8 }}
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </label>
//         </div>

//         <div style={{ marginBottom: 10 }}>
//           <label>
//             To Date:{" "}
//             <input
//               type="date"
//               style={{ marginLeft: 8 }}
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </label>
//         </div>

//         <button type="submit" disabled={!canSubmit}>
//           {loading ? "Loading..." : "Fetch Reconciliation"}
//         </button>
//         {!canSubmit && !loading && (
//           <span style={{ marginLeft: 8, fontSize: 12, color: "#c00" }}>
//             (Vehicle, From &amp; To dates are required)
//           </span>
//         )}
//       </form>

//       {error && (
//         <div style={{ color: "red", marginBottom: 10 }}>Error: {error}</div>
//       )}

//       {/* Summary table */}
//       {summaryRows.length > 0 && (
//         <>
//           <h3>Per-Day, Per-BMC Stock Summary</h3>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               marginBottom: 20,
//               fontSize: 13,
//             }}
//           >
//             <thead>
//               <tr>
//                 <th style={{ border: "1px solid #ccc", padding: 4 }}>#</th>
//                 <th style={{ border: "1px solid #ccc", padding: 4 }}>Date</th>
//                 <th style={{ border: "1px solid #ccc", padding: 4 }}>BMC</th>
//                 <th style={{ border: "1px solid #ccc", padding: 4 }}>
//                   Opening (Kg)
//                 </th>
//                 <th style={{ border: "1px solid #ccc", padding: 4 }}>
//                   Collected (Kg)
//                 </th>
//                 <th style={{ border: "1px solid #ccc", padding: 4 }}>
//                   Dispatched (Kg)
//                 </th>
//                 <th style={{ border: "1px solid #ccc", padding: 4 }}>
//                   Closing / Remaining (Kg)
//                 </th>
//                 <th style={{ border: "1px solid #ccc", padding: 4 }}>
//                   Shift-wise Collected
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {summaryRows.map((row) => (
//                 <tr key={row.slNo}>
//                   <td style={{ border: "1px solid #ccc", padding: 4 }}>
//                     {row.slNo}
//                   </td>
//                   <td style={{ border: "1px solid #ccc", padding: 4 }}>
//                     {row.date}
//                   </td>
//                   <td style={{ border: "1px solid #ccc", padding: 4 }}>
//                     {row.bmcName} ({row.bmcId})
//                   </td>
//                   <td style={{ border: "1px solid #ccc", padding: 4 }}>
//                     {row.openingKg}
//                   </td>
//                   <td style={{ border: "1px solid #ccc", padding: 4 }}>
//                     {row.collectedKg}
//                   </td>
//                   <td style={{ border: "1px solid #ccc", padding: 4 }}>
//                     {row.dispatchedKg}
//                   </td>
//                   <td style={{ border: "1px solid #ccc", padding: 4 }}>
//                     {row.closingKg}
//                   </td>
//                   <td style={{ border: "1px solid #ccc", padding: 4 }}>
//                     {row.shifts && row.shifts.length
//                       ? row.shifts
//                           .map((s) => `${s.shift}: ${s.collectedKg} Kg`)
//                           .join(", ")
//                       : "-"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}

//       {/* Debug raw JSONs */}
//       <h3>Raw GetTransitlossGainReports response</h3>
//       <pre
//         style={{
//           background: "#f5f5f5",
//           padding: 10,
//           maxHeight: 200,
//           overflow: "auto",
//         }}
//       >
//         {rawTransitReports
//           ? JSON.stringify(rawTransitReports, null, 2)
//           : "No data yet"}
//       </pre>

//       <h3>Raw GetMilkCollections responses (per BMC)</h3>
//       <pre
//         style={{
//           background: "#f5f5f5",
//           padding: 10,
//           maxHeight: 200,
//           overflow: "auto",
//         }}
//       >
//         {rawMilkCollections
//           ? JSON.stringify(rawMilkCollections, null, 2)
//           : "No data yet"}
//       </pre>
//     </div>
//   );
// }
