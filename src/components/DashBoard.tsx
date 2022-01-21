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
import { Link, useRouteMatch } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import NewEvent from "./NewEvent";
import EditEvent from "./EditEvent";
import NewContactList from "./NewContactList";
import OwnerEvents from "./OwnerEvents";
import "../css/common.css";
import ContactList from "./ContactList";
import DashBoardDefault from "./DashBoardDefault";
// import { v4 as uuidv4 } from "uuid";
import PublicEventsDashboard from "./PublicEventsDashboard";
import AppMenu from "./AppMenu";
import { GlobalVars } from "../global/global";
import { tokenstore } from "../global/global";
var myself: any;
class DashBoard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      current: "1",
    };
  }
  componentDidMount = async () => {
    // GlobalVars.publicEventId = "249d8508-f4d8-49a6-b995-e92241fbe950";
    console.log(GlobalVars.publicEventId);
  };
  async logout(e: any) {
    tokenstore.clear();
    myself.props.history.push("/");
  }
  render() {
    // console.log(window.location);
    // console.log(GlobalVars.publicEventId);
    const { TabPane } = Tabs;
    const handleClick = (e: any) => {
      this.setState({ current: e.key });
    };
    const { Meta } = Card;
    const { Header, Content, Sider } = Layout;
    const { current } = this.state;
    return (
      <Layout>
        <AppMenu />
        <Layout className="layoutColor">
          <Route path="/dashboard/newEvent" component={NewEvent} />
          <Route exact path="/dashboard" component={DashBoardDefault} />
          <Route path="/dashboard/contactList" component={ContactList} />
          <Route path="/dashboard/editContact" component={NewContactList} />
          <Route path="/dashboard/ownerEvents" component={OwnerEvents} />
          <Route path="/dashboard/EditEvent" component={EditEvent} />
          <Route
            path={`/dashboard/publicEvent/${GlobalVars.publicEventId}`}
            component={PublicEventsDashboard}
          />
        </Layout>
      </Layout>
    );
  }
}
export default DashBoard;
