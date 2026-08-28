import React from "react";
import DefectForm from "../components/DefectForm/DefectForm";  
import PQCSTable from "../components/DefectForm/PQCSTable";
import DefectImage from "../components/DefectForm/DefectImage";

export const DefectFormScreen = () => {
  return (
    <div style={{ maxWidth: "1350px", margin: "0 auto" }}>
      <div className="defect-form-container">
        {/* Left Column: Offline Treatment Form */}
        <div>
          <DefectForm />
        </div>

        {/* Right Column: Visual Evidence & Process Quality Confirmation Sheet (PQCS) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <DefectImage />
          <PQCSTable />
        </div>
      </div>
    </div>
  );
};

export default DefectFormScreen;
