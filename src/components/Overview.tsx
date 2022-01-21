import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Tooltip,
  Popconfirm,
  Table,
  Row,
  Col,
  Card,
} from "antd";
import { getContactList } from "./CommonHelper";
import "../css/common.css";
import {
  CheckCircleTwoTone,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
var myself;
class Overview extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      hideToggle: "",
      locationToggle: "",
      daterequired: true,
      locationrequired: true,
      contactList: [],
    };
  }
  getcontactList = async () => {
    await getContactList()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({ contactList: response.data });
          console.log(this.state.contactList);
        }
      })
      .catch(async (error) => {
        console.log(error);
        //  await doLogout();
      });
  };
  componentDidMount = async () => {
    this.getcontactList();
  };
  editcontactList = (id: any) => {};
  deletecontactList = (id: any) => {};
  render() {
    const onSearch = (value: any) => console.log(value);
    function callback(key: any) {
      console.log(key);
    }
    const { Search } = Input;
    const { Option } = Select;
    const columns: any = [
      {
        title: "name",
        dataIndex: ["attributes", "name"],
        key: ["attributes", "name"],
        responsive: ["md"],
      },
      {
        title: "Email",
        dataIndex: ["attributes", "email"],
        key: ["attributes", "email"],
        responsive: ["md"],
      },
      {
        title: "name",
        dataIndex: ["attributes", "phone"],
        key: ["attributes", "phone"],
        responsive: ["md"],
      },
      {
        title: "Reply",
        key: "action",
        render: (text: any, record: any) => (
          <Space>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <div> Attending</div>
          </Space>
          // <Space>
          //   <CloseCircleOutlined />
          //   <div> Not Attending</div>
          // </Space>
        ),
      },
    ];
    return (
      <>
        <Title className="modelTitle" level={2}>
          Event Overview
        </Title>
        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col span={6}>
              <Card hoverable bordered={false}>
                <CheckCircleTwoTone
                  className="iconSize"
                  twoToneColor="#52c41a"
                />
                <Title level={3}>5</Title>
                <div>Attending</div>
              </Card>
            </Col>
            <Col span={6}>
              <Card hoverable bordered={false}>
                <CloseCircleOutlined className="iconSize" />
                <Title level={3}>0</Title>
                <div> Not Attending</div>
              </Card>
            </Col>
          </Row>
        </div>
        <Row>
          <Col span={5}>
            <Search
              className="searchbar"
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          rowKey={"id"}
          dataSource={this.state.contactList}
        />
      </>
    );
  }
}
export default Overview;
