import React, { Component } from "react";
import { Form, Input, Button, Checkbox, Spin } from "antd";
import { Link } from "react-router-dom";
import { logIn, isLoggedIn } from "./CommonHelper";
import { message } from "antd";
import { createBrowserHistory } from "history";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../css/LogIn.css";
var myself: any;
class Login extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
    };
  }
  render() {
    const onFinish = async (values: any) => {
      this.setState({ isSpinVisible: true });
      await logIn(values)
        .then((response) => {
          if (isLoggedIn()) {
            this.setState({ isSpinVisible: false });
            myself.props.history.push("/dashboard");
          }
        })
        .catch(async (error) => {
          console.log(error);
          this.setState({ isSpinVisible: false });
        });
    };
    return (
      <div className="logIn">
        <Spin size="large" spinning={this.state.isSpinVisible}>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              <Link to="/signup"> register now!</Link>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    );
  }
}
export default Login;
