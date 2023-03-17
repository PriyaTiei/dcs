import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DefectFormScreen } from "./screens/DefectFormScreen";
import DefectScreen from "./screens/DefectScreen";
import { AppSidebar } from "./components/Sidebar";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <AppSidebar>
        <Routes>
          <Route exact path="/" element={<DefectScreen />} />
          <Route exact path="/add-form" element={<DefectFormScreen />} />
        </Routes>
      </AppSidebar>
    </BrowserRouter>
  );
}
