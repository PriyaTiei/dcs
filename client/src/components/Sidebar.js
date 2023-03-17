import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Sidebar, Segment, Icon, Image } from "semantic-ui-react";
import logo from "../assets/logo.png";

export const AppSidebar = ({ children }) => {
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Sidebar.Pushable style={{ height: "100vh" }}>
      <Sidebar visible style={{ width: "220px" }}>
        <Menu
          inverted
          vertical
          pointing
          style={{
            height: "inherit",
          }}
        >
          <Menu.Item>
            <Image src={logo} size={"small"} style={{ margin: "16px 0px" }} />
          </Menu.Item>
          <SidebarTile
            title="Home"
            value="home"
            icon={"home"}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/"
          />

          <SidebarTile
            title="Add DCS Form"
            value="add_dcs_form"
            icon={"add"}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/add-form"
          />
        </Menu>
      </Sidebar>

      <Sidebar.Pusher>
        <Segment basic>{children}</Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

const SidebarTile = ({
  title,
  value,
  activeItem,
  handleItemClick,
  icon,
  href,
}) => {
  return (
    <NavLink to={href}>
      <Menu.Item
        style={{
          "font-size": "13px",
        }}
        position="left"
        name={value}
        active={activeItem === value}
        onClick={handleItemClick}
        link={false}
      >
        {title}
        <Icon name={icon} />
      </Menu.Item>
    </NavLink>
  );
};
