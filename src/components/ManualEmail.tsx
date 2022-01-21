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
} from "./CommonHelper";
import { message } from "antd";
import "../css/LogIn.css";
import Title from "antd/lib/typography/Title";
import { tokenstore } from "../global/global";
var myself: any, myform: any;
myform = createRef();
class ManualEmail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      editId: tokenstore.contactId,
      editContactDetail: {},
      phone: "",
      manualEmail: false,
    };
  }
  getEditContactList = async () => {
    await getEditContactList(tokenstore.contactId)
      .then(async (response: any) => {
        if (response && response.data) {
          var a = response.data.attributes.phone.split("3");
          response.data.attributes.phone = "3" + a[1];
          console.log(response.data.attributes.phone);
          await this.setState({ editContactDetail: response.data });
          console.log(this.state.editContactDetail);
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  componentDidMount = () => {
    if (tokenstore.contactId) {
      this.getEditContactList();
    }
  };
  onFinishFailed = (errorInfo: any) => {
    this.setState({ isSpinVisible: false });
  };
  onFinish = async (values: any) => {
    console.log(values);
    this.setState({ isSpinVisible: true });
    if (!this.state.editId) {
      await newContactList(values)
        .then((response) => {
          if (response && response.data) {
            this.setState({ isSpinVisible: false });
            message.success("Data Added Successfully!");
            myform.current.resetFields();
          }
        })
        .catch(async (error: any) => {
          console.log(error);
          this.setState({ isSpinVisible: false });
        });
    }
    if (this.state.editId) {
      await EditContactList(values)
        .then((response) => {
          if (response && response.data) {
            this.setState({ isSpinVisible: false });
            message.success("Data Edit Successfully!");
            myform.current.resetFields();
            tokenstore.removeItem("contactId");
            myself.props.history.push("/dashboard/contactList");
          }
        })
        .catch(async (error: any) => {
          console.log(error);
          this.setState({ isSpinVisible: false });
        });
    }
  };
  closeModel = () => {
    myself.props.parentUpdate();
  };
  render() {
    const { editId, phone, editContactDetail } = this.state;
    const { Option } = Select;
    if (editId) {
      if (!editContactDetail || !editContactDetail.attributes) {
        return <div>Loading...</div>;
      }
    }
    return (
      <Spin size="large" spinning={this.state.isSpinVisible}>
        <Form
          ref={myform}
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 12 }}
          initialValues={{
            remember: true,
            contactName: editId ? editContactDetail.attributes.name : " ",
            contactEmail: editId ? editContactDetail.attributes.email : " ",
            contactPhone: editId ? editContactDetail.attributes.phone : " ",
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          autoComplete="off"
        >
          <Title className="modelTitle" level={3}>
            Invite Member
          </Title>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Row>
              <Col span={14}></Col>
              <Col>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Send
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
export default ManualEmail;
