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
  message,
  Modal,
} from "antd";
import { deleteContactList, getContactList } from "./CommonHelper";
import "../css/common.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { tokenstore } from "../global/global";
var myself: any;
class ContactList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      hideToggle: "",
      locationToggle: "",
      daterequired: true,
      locationrequired: true,
      contactList: [],
      editContactListModal: true,
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
  editcontactList = (id: any) => {
    tokenstore.contactId = id;
    myself.props.history.push("/dashboard/editContact");
  };
  deletecontactList = async (id: any) => {
    await deleteContactList(id)
      .then(async (response: any) => {
        if (response && response.data) {
          message.success("Data Delete SuccessFully!");
          this.getcontactList();
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  render() {
    const { Option } = Select;
    const columns: any = [
      {
        title: "id",
        dataIndex: "id",
        key: "id",
      },
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
        title: "Action",
        key: "action",
        render: (text: any, record: any) => (
          <Space size="middle">
            <Tooltip placement="top" title="edit">
              <a>
                {" "}
                <EditOutlined
                  onClick={() => this.editcontactList(record.id)}
                  style={{ fontSize: "16px", color: "#4f4fff" }}
                />{" "}
              </a>{" "}
            </Tooltip>
            <Tooltip placement="top" title="delete">
              <Popconfirm
                onConfirm={() => this.deletecontactList(record.id)}
                title="Are You Sure"
                okText="yes"
                cancelText="no"
              >
                <a>
                  <DeleteOutlined
                    style={{ fontSize: "16px", color: "#ff3a3a" }}
                  />{" "}
                </a>{" "}
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];
    return (
      <>
        <Table
          columns={columns}
          rowKey={"id"}
          dataSource={this.state.contactList}
        />
      </>
    );
  }
}
export default ContactList;
