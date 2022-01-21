import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import overview from "./Overview";
import Email from "./Email";
import { tokenstore } from "../global/global";
import AppMenu from "./AppMenu";
var myself: any;
class EventDashBoard extends Component {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {};
  }
  async logout(e: any) {
    tokenstore.clear();
    myself.props.history.push("/");
  }
  render() {
    const { SubMenu } = Menu;
    const { Header, Content, Sider } = Layout;
    const onFinish = (values: any) => {
      console.log("Received values of form: ", values);
    };
    const handleClick = (e: any) => {
      console.log("click ", e);
      this.setState({ current: e.key });
    };
    return (
      <Layout>
        <AppMenu />
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                icon={<DashboardOutlined />}
                title="DashBoard"
              >
                <Menu.Item key="1">
                  <Link to="/eventDashboard/overview">overview</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/eventDashboard/email">Email</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Route path="/eventDashboard/overview" component={overview} />
              <Route path="/eventDashboard/email" component={Email} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
export default EventDashBoard;
