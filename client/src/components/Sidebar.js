import { NavLink } from "react-router-dom";
import { Menu, Sidebar, Icon, Image } from "semantic-ui-react";
import logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { navBarSlice } from "../redux/slices/navbarSlice";

export function AppSidebar({ children }) {
  const { visible } = useSelector((state) => state.navBar);
  const { activeItem } = useSelector((state) => state.navBar);
  const dispatch = useDispatch();

  const handleItemClick = (value) => {
    dispatch(navBarSlice.actions.setActiveItem(value));
  };

  return (
    <Sidebar.Pushable style={{ height: "100vh" }}>
      <Sidebar animation="push" visible={visible}>
        <Menu
          inverted
          vertical
          pointing
          style={{
            height: "inherit",
            width: "254px",
          }}
        >
          <Menu.Item>
            <Image
              src={logo}
              centered
              size={"small"}
              style={{ margin: "16px 0px" }}
            />
          </Menu.Item>
          <SidebarTile
            title="Traceability"
            value="traceability"
            icon={"home"}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/"
          />
          <SidebarTile
            title="Add Assy Checksheet"
            value="add_assy_checksheet"
            icon={"add"}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/add-form"
          />
        </Menu>
      </Sidebar>

      <Sidebar.Pusher
        style={{
          maxWidth: visible ? "86.3vw" : "100vw",
          transition: "0.4s ease-in-out",
        }}
      >
        <div
          style={{
            paddingLeft: 40,
            paddingRight: 60,
          }}
        >
          {children}{" "}
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

const SidebarTile = ({ title, value, activeItem, handleItemClick, icon, href }) => {
  return (
    <Menu.Item
      as={NavLink}
      to={href}
      exact="true"
      style={{
        fontSize: "13px",
      }}
      position="left"
      name={value}
      active={activeItem === value}
      onClick={() => handleItemClick(value)}
    >
      {title}
      <Icon name={icon} />
    </Menu.Item>
  );
};
