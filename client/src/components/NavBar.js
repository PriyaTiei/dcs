import { useDispatch, useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { navBarSlice } from "../redux/slices/navbarSlice";
import './fonts.css';
import engine2 from "../assets/engine2.png";
export default function Navbar() {
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.navBar);

  const handleMenuClick = () => {
    dispatch(navBarSlice.actions.toggleVisible());
  };

  return (
    <Menu fixed="top">
      <Menu.Item onClick={handleMenuClick}>
        <Icon name={visible ? "close" : "bars"} size="large" />
        
      </Menu.Item>
      <h1 className="mx-auto custom-font-text ">Engine Traceability <span className="mr-0"><img src={engine2} style={{height:"40px"}}></img></span></h1>
    </Menu>
  );
}
