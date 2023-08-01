import { ToastContainer } from "react-toastify";
import {  Routes, Route } from "react-router-dom";
import { DefectFormScreen } from "./screens/DefectFormScreen";
import DefectTraceabilityScreen from "./screens/DefectTraceabilityScreen";
import { AppSidebar } from "./components/Sidebar";
import ContentWrapper from './components/ContentWrapper'
import ChangePoints from "./components/changePoints/ChangePoints";
import EngNo from "./components/engno/EngNo";
import SupplierPartDeatils from "./components/engno/SupplierPartDetails.js"

export default function App() {
  return (
  <>
      <ToastContainer />
      <AppSidebar>
          <ContentWrapper>
            <Routes>
              <Route path="/" element={<EngNo />} />
              <Route path="/supplierPartDeatils" element={<SupplierPartDeatils/>} />
              <Route   path="/traceability" element={<DefectTraceabilityScreen />} />
              <Route path="/add-form" element={<DefectFormScreen />} /> 
              <Route path="/changePoints" element={<ChangePoints />} />
           
              
            </Routes>
          </ContentWrapper>
        </AppSidebar> 
        </>
  );
}
