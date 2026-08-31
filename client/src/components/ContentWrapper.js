import Navbar from "./NavBar";

export default function ContentWrapper({ children }) {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "60px" }}>{children}</div>
    </div>
  );
}
