import { NavLink } from "react-router-dom";
import { Menu, Sidebar, Icon, Image } from "semantic-ui-react";
import logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { navBarSlice } from "../redux/slices/navbarSlice";
import {getChangePoints} from "../redux/slices/changepoints/changePointActions"

export function AppSidebar({ children }) {
  const { visible } = useSelector((state) => state.navBar);
  const { activeItem } = useSelector((state) => state.navBar);
  const dispatch = useDispatch();

  const handleItemClick = (value) => {
    
    dispatch(navBarSlice.actions.setActiveItem(value));
    
  };
  const handleChagePoints = (value) => {
    dispatch(getChangePoints())  
  };

  return (
    <Sidebar.Pushable style={{   minHeight : "100vh" }}>
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
            title="Supplier Part Details"
            value="supplierPartDetails"
            icon={"add"}            
            handleItemClick={handleItemClick}
            href="/supplierPartDeatils"
          />
          <SidebarTile
            title="Add Assy Checksheet"
            value="add_assy_checksheet"
            icon={"add"}   
            activeItem={activeItem}
            handleItemClick={handleItemClick}       
           
            href="/add-form"
          />
          <SidebarTile
            title="Change Point Management"
            value="Change_Point_Management"
            icon={"add"}
            handleItemClick={handleChagePoints }   
            href="/changePoints"
          />
          <SidebarTile
            title="TraceabilityForm"
            value="traceabilityForm"
            icon={"add"}            
            handleItemClick={handleItemClick}
            href="/traceability"
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
          {children} 
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
      key={value}
    >
      {title}
      <Icon name={icon} />
    </Menu.Item>
  );
};
