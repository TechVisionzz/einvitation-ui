import React, { Component } from "react";
import {
  Layout,
  Menu,
  Card,
  Avatar,
  Badge,
  Calendar,
  Row,
  Col,
  Tabs,
  Input,
} from "antd";
import "../css/common.css";
import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";
import { tokenstore } from "../global/global";
var myself: any;
class AppMenu extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      current: "1",
    };
  }
  logout = async () => {
    tokenstore.clear();
    myself.props.history.push("/");
  };
  render() {
    const { Header, Content, Sider } = Layout;
    const handleClick = (e: any) => {
      this.setState({ current: e.key });
    };
    return (
      <Header className="header">
        <Menu
          theme="dark"
          onClick={handleClick}
          defaultSelectedKeys={["1"]}
          mode="horizontal"
        >
          <Menu.Item key="1">
            <Link to="/dashboard">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/dashboard/ownerEvents">All Events</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/dashboard/newEvent">Create New Event</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/dashboard/contactList">Contact List detail</Link>
          </Menu.Item>
          <Menu.Item
            style={{ marginLeft: "auto" }}
            onClick={() => this.logout}
            key="5"
          >
            Log Out
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}
export default AppMenu;
