import { useDispatch, useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { navBarSlice } from "../redux/slices/navbarSlice";

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
    </Menu>
  );
}
