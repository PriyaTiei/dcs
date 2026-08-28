import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import { DefectFormScreen } from "./screens/DefectFormScreen";
import DefectTraceabilityScreen from "./screens/DefectTraceabilityScreen";
import { AppSidebar } from "./components/Sidebar";
import ContentWrapper from "./components/ContentWrapper";
import ChangePoints from "./components/changePoints/ChangePoints";
import MainPage from "./components/engno/MainPage";
import SupplierPartDeatils from "./components/engno/DetailTraceability.js";
import SearchReworkImages from "./components/reworkImage/SearchReworkImages";
import CrankInfo from "./components/crank/CrankInfo.js";
// import EditToolDetails from './components/EditToolDetails';
import EditToolDetails from './components/editToolDetails/editToolDetails.js';
import Loading from "./components/engno/Loading";
import "./styles/styles.css";

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      <Navbar />
      <AppSidebar>
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<MainPage />} />

            <Route
              path="/supplierPartDeatils"
              element={<SupplierPartDeatils />}
            />
           <Route 
           path="/edit-tool-details"
            element={<EditToolDetails />} />

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
            <Route
              path="/crank"
              element={<CrankInfo />}
            />
          </Routes>
        </ContentWrapper>
      </AppSidebar>
    </>
  );
}



