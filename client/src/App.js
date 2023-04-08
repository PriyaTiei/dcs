import { ToastContainer } from "react-toastify";
import {  Routes, Route } from "react-router-dom";
import { DefectFormScreen } from "./screens/DefectFormScreen";
import DefectScreen from "./screens/DefectScreen";
import { AppSidebar } from "./components/Sidebar";
import ContentWrapper from './components/ContentWrapper'

export default function App() {
  return (
  <>
      <ToastContainer />
      <AppSidebar>
          <ContentWrapper>
            <Routes>
              <Route path="/" element={<DefectScreen />} />
              <Route path="/add-form" element={<DefectFormScreen />} /> 
            </Routes>
          </ContentWrapper>
        </AppSidebar> 
        </>
  );
}
