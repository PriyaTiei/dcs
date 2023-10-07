import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import { DefectFormScreen } from "./screens/DefectFormScreen";
import DefectTraceabilityScreen from "./screens/DefectTraceabilityScreen";
import { AppSidebar } from "./components/Sidebar";
import ContentWrapper from "./components/ContentWrapper";
import ChangePoints from "./components/changePoints/ChangePoints";
import MainPage from "./components/engno/MainPage";
import SupplierPartDeatils from "./components/engno/DetailTraceability.js";
import SearchReworkImages from "./components/reworkImage/SearchReworkImages";
import Loading from "./components/engno/Loading";

export default function App() {
  return (
    <>
      <ToastContainer  autoClose={500}/>
      <AppSidebar>
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<MainPage />} />
         
            <Route
              path="/supplierPartDeatils"
              element={<SupplierPartDeatils />}
            />
            <Route
              path="/traceability"
              element={<DefectTraceabilityScreen />}
            />
            <Route path="/add-form" element={<DefectFormScreen />} />
            <Route path="/changePoints" element={<ChangePoints />} />
            <Route
              path="/searchReworkImages"
              element={<SearchReworkImages />}
            />
          </Routes>
        </ContentWrapper>
      </AppSidebar>
    </>
  );
}
