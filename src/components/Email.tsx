import React, { Component } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Row,
  Col,
  DatePicker,
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { getContactList } from "./CommonHelper";
import "../css/common.css";
import ManualEmail from "./ManualEmail";
import Title from "antd/lib/typography/Title";
import moment from "moment";
var myself: any;
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Joe Black",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Jim Green",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];
class Email extends Component<any, any> {
  searchInput: any;
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      searchText: "",
      searchedColumn: "",
      selectedKeys: [],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      contactList: [],
      manualEmail: false,
      confirmModel: false,
      visibleDateTime: false,
      formItem: "none",
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
      });
  };
  componentDidMount = async () => {
    this.getcontactList();
  };
  start = () => {
    this.setState({ loading: true });
    this.setState({
      confirmModel: true,
      loading: false,
    });
  };

  onSelectChange = (selectedRowKeys: any) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: (confirm: any, clearFilters: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={this.state.selectedKeys}
          onChange={(e: any) => this.setState({ selectedKeys: e.target.value })}
          onPressEnter={() =>
            this.handleSearch(this.state.selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              this.handleSearch(this.state.selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              // confirm({ closeDropdown: false });
              this.setState({
                searchText: this.state.selectedKeys,
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    console.log(selectedKeys);
    // confirm();
    this.setState({
      searchText: selectedKeys,
      searchedColumn: dataIndex,
    });
  };
  closeModel = () => {
    console.log("asas");
    this.setState({ confirmModel: false });
  };
  handleReset = (clearFilters: any) => {
    // clearFilters();
    this.setState({ searchText: "", selectedKeys: [] });
  };
  manualEmailModel = () => {
    this.setState({ manualEmail: true });
  };
  onCancel = () => {
    this.setState({ manualEmail: false });
  };
  visibleDateTime = () => {
    if (this.state.formItem == "none") {
      this.setState({ formItem: " " });
    } else {
      this.setState({ formItem: "none" });
    }
  };
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns: any = [
      {
        title: "Name",
        dataIndex: ["attributes", "name"],
        key: "name",
        width: "40%",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Email",
        dataIndex: ["attributes", "email"],
        key: "email",
        width: "30%",
        ...this.getColumnSearchProps("email"),
      },
      {
        title: "Phone",
        dataIndex: ["attributes", "phone"],
        key: "phone",
        width: "30%",
        ...this.getColumnSearchProps("phone"),
      },
    ];
    const { RangePicker } = DatePicker;
    return (
      <div>
        <Modal
          width={800}
          maskClosable={true}
          closable={false}
          destroyOnClose={true}
          footer={null}
          visible={this.state.manualEmail}
        >
          <ManualEmail parentUpdate={this.onCancel} />
        </Modal>
        <Modal
          width={800}
          maskClosable={true}
          destroyOnClose={true}
          footer={null}
          visible={this.state.confirmModel}
        >
          <Space>
            <Title level={4}>
              <Button onClick={this.visibleDateTime} type="primary">
                Schedule Later
              </Button>
            </Title>
            <Title level={4}>
              <Button type="primary">Send</Button>
            </Title>
          </Space>
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 12 }}
            // onFinish={this.onFinish}
            // onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              style={{ display: this.state.formItem }}
              label="Date & Time"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Please Select Date!",
                },
              ]}
            >
              <DatePicker
                showTime={{ use12Hours: true }}
                format="YYYY-MM-DD HH:mm A"
                disabledDate={(current) => {
                  return current && current < moment().add(-1, "days");
                }}
              />
            </Form.Item>
            <Form.Item style={{ display: this.state.formItem }}>
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
        </Modal>
        <Title className="modelTitle" level={2}>
          Event Overview
        </Title>
        <div>
          <div style={{ marginBottom: 16, float: "left" }}>
            <Button
              type="primary"
              onClick={this.start}
              disabled={!hasSelected}
              loading={loading}
            >
              Send Email
            </Button>
            <span style={{ marginLeft: 8, marginRight: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
            <Button
              type="primary"
              onClick={() => {
                this.manualEmailModel();
              }}
            >
              Invite Manually
            </Button>
          </div>
          <Table
            rowSelection={rowSelection}
            rowKey="id"
            columns={columns}
            dataSource={this.state.contactList}
          />
        </div>
      </div>
    );
  }
}
export default Email;
