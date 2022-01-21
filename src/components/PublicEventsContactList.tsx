import React, { Component, createRef } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Spin,
  Row,
  Col,
  Space,
  Modal,
  Select,
} from "antd";
import {
  logIn,
  getEditContactList,
  EditContactList,
  newContactList,
  getUserDetails,
  newPublicContactList,
} from "./CommonHelper";
import { message } from "antd";
import "../css/LogIn.css";
import Title from "antd/lib/typography/Title";
import { tokenstore } from "../global/global";
var myself: any, myform: any;
myform = createRef();
class PublicEventsContactList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      userDetail: {},
    };
  }

  componentDidMount = async () => {};
  onFinishFailed = (errorInfo: any) => {
    this.setState({ isSpinVisible: false });
  };
  onFinish = async (values: any) => {
    this.setState({ isSpinVisible: true });
    const eventId = myself.props.eventId;
    const ownerId = myself.props.ownerId;
    console.log(eventId);
    console.log(ownerId);
    await newPublicContactList(values, ownerId).then((response) => {
      if (response && response.data) {
        this.setState({ isSpinVisible: false });
        message.success("Request Submitted Successfully!");
        myform.current.resetFields();
      }
    });
  };
  closeModel = () => {
    myself.props.parentUpdate();
  };
  render() {
    return (
      <Spin size="large" spinning={this.state.isSpinVisible}>
        <Form
          ref={myform}
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 12 }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          autoComplete="off"
        >
          <Title className="modelTitle" level={3}>
            Add Number
          </Title>
          <Form.Item
            name="contactPhone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
                min: 10,
              },
              {
                pattern: /^[3]{1}[0-9]{9}/,
                message: "eg:3008090100",
              },
            ]}
          >
            <Input addonBefore={"+92"} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Row>
              <Col span={14}></Col>
              <Col>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Join Event
                  </Button>
                  <Button onClick={this.closeModel}>Cancel</Button>
                </Space>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}
export default PublicEventsContactList;
