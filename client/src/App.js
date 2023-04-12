import { ToastContainer } from "react-toastify";
import {  Routes, Route } from "react-router-dom";
import { DefectFormScreen } from "./screens/DefectFormScreen";
import DefectTraceabilityScreen from "./screens/DefectTraceabilityScreen";
import { AppSidebar } from "./components/Sidebar";
import ContentWrapper from './components/ContentWrapper'

export default function App() {
  return (
  <>
      <ToastContainer />
      <AppSidebar>
          <ContentWrapper>
            <Routes>
              <Route   path="/" element={<DefectTraceabilityScreen />} />
              <Route path="/add-form" element={<DefectFormScreen />} /> 
            </Routes>
          </ContentWrapper>
        </AppSidebar> 
        </>
  );
}
