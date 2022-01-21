import React, { Component, createRef } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Switch,
  Radio,
  DatePicker,
  Space,
  Modal,
  Typography,
  message,
  Spin,
} from "antd";
import {
  ConsoleSqlOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  getContactList,
  newEventTag,
  newEvent,
  updateEventIdTags,
  newEventOccurance,
  newEventReceiver,
  updateEventReceiver,
  updateEventOccurance,
} from "./CommonHelper";
import "../css/common.css";
import NewContactList from "./NewContactList";
import moment from "moment";
import { tokenstore } from "../global/global";
var myself: any,
  startTime: any,
  endTime: any,
  counter: any,
  eventId: any,
  myform: any;
myform = createRef();
class NewEvent extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      hideToggle: "",
      locationToggle: "",
      daterequired: true,
      locationrequired: true,
      eventCategoryModal: false,
      newContactListModal: false,
      isSpinVisible: false,
      contactList: [],
      eventType: [],
      tagId: [],
      occuranceId: [],
      eventReceiverId: [],
    };
  }
  ContactListModal = () => {
    this.setState({ newContactListModal: true });
  };
  closeModel = () => {
    this.setState({ newContactListModal: false });
  };
  getcontactList = async () => {
    console.log("error");
    await getContactList()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({ contactList: response.data });
        }
        console.log("error");
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  componentDidMount = async () => {
    await this.getcontactList();
  };
  // createEvent = async (values: any) => {
  //   await newEvent(
  //     values,
  //     this.state.occuranceId,
  //     this.state.eventReceiverId,
  //     this.state.tagId
  //   )
  //     .then(async (response: any) => {
  //       if (response && response.data) {
  //         //fetch event id after event creation
  //         tokenstore.eventId = response.data.id;
  //         message.success("Data Added SuccesFully!");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       this.setState({ isSpinVisible: false });
  //     });
  // };
  onFinish = async (values: any) => {
    this.setState({ isSpinVisible: true });
    // for location and date of event
    if (values.locationGroup) {
      var location = values.locationGroup;
      await Promise.all(
        location.map(async (item: any) => {
          console.log(item);
          var location = item.location;
          counter = 0;
          var occurance = item.occurance;
          occurance.map(async (item1: any) => {
            if (counter == 0) {
              startTime = item1.format("MM-DD-YYYY HH:mm A");
              counter++;
            } else {
              endTime = item1.format("MM-DD-YYYY HH:mm A");
              counter--;
            }
          });
          await newEventOccurance(startTime, endTime, location).then(
            async (response: any) => {
              if (response && response.data) {
                await this.setState({
                  occuranceId: [...this.state.occuranceId, response.data.id],
                });
                console.log(this.state.occuranceId);
              }
            }
          );
        })
      );
    }
    // for event tags
    if (values.eventTag) {
      var tags = values.eventTag;
      await Promise.all(
        tags.map(async (item: any) => {
          console.log(item);
          await newEventTag(item)
            .then(async (response: any) => {
              if (response && response.data) {
                await this.setState({
                  tagId: [...this.state.tagId, response.data.id],
                });
                console.log(this.state.tagId);
              }
            })
            .catch((error) => {
              console.log(error);
              this.setState({ isSpinVisible: false });
            });
        })
      );
    }
    // for add event receiver
    if (values.eventReceiver) {
      var eventReceiver = values.eventReceiver;
      await Promise.all(
        eventReceiver.map(async (item: any) => {
          console.log(item);
          await newEventReceiver(values, eventId, item)
            .then(async (response: any) => {
              if (response && response.data) {
                await this.setState({
                  eventReceiverId: [
                    ...this.state.eventReceiverId,
                    response.data.id,
                  ],
                });
                console.log(this.state.eventReceiverId);
              }
            })
            .catch((error) => {
              console.log(error);
              this.setState({ isSpinVisible: false });
            });
        })
      );
    }
    //create event
    newEvent(
      values,
      this.state.occuranceId,
      this.state.eventReceiverId,
      this.state.tagId
    )
      .then(async (response: any) => {
        if (response && response.data) {
          //fetch event id after event creation
          tokenstore.eventId = response.data.id;
          message.success("Data Added SuccesFully!");
          myself.props.history.push("/dashboard/ownerEvents");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isSpinVisible: false });
      });
    //at the last we remove event id from store
    tokenstore.removeItem("eventId");
    this.setState({ isSpinVisible: false });
    myform.current.resetFields();
  };
  onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  render() {
    const { Title } = Typography;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    return (
      <Spin size="large" spinning={this.state.isSpinVisible}>
        <div>
          {/*Contact Model */}
          <Modal
            width={800}
            maskClosable={true}
            closable={false}
            destroyOnClose={true}
            footer={null}
            title={"Add Contact in List"}
            visible={this.state.newContactListModal}
          >
            <NewContactList parentUpdate={this.closeModel} />
          </Modal>
          {/*New Event Form*/}
          <Form
            ref={myform}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            initialValues={{
              locationGroup: [
                {
                  location: "",
                  occurance: [],
                },
              ],
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Title level={2}>Create a new event.</Title>
            <p>It's quick and easy.</p>
            <Form.Item
              name="category"
              label="Event Category"
              rules={[
                {
                  required: true,
                  message: "Please Select your Event Category!",
                },
              ]}
            >
              <Select
                style={{ float: "left" }}
                placeholder="Select Event Category"
              >
                <Option value="Corporate">Corporate</Option>
                <Option value="GalaorFundraiser">Gala or Fundraiser</Option>
                <Option value="ShoworPerformance">Show or Performance</Option>
                <Option value="Wedding">Wedding</Option>
                <Option value="Reunion">Reunion</Option>
                <Option value="HolidayParty">Holiday Party</Option>
                <Option value="Military">Military</Option>
                <Option value="BirthDay">BirthDay</Option>
                <Option value="FaithBased">Faith Based</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Event Name"
              name="name"
              rules={[
                { required: true, message: "Please input your Event Name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: "Please select Event Type!" }]}
            >
              <Select placeholder="Select Event Category">
                <Option value="Public">Public</Option>
                <Option value="Private">Private</Option>
              </Select>
            </Form.Item>
            <Form.Item className="location">
              <Form.List name="locationGroup">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key}>
                        <Form.Item
                          label="Date & Time"
                          {...restField}
                          name={[name, "occurance"]}
                          rules={[
                            {
                              required: true,
                              message: "Please input your Event Name!",
                            },
                          ]}
                        >
                          <RangePicker
                            showTime={{ use12Hours: true }}
                            format="YYYY-MM-DD HH:mm A"
                            disabledDate={(current) => {
                              return (
                                current && current < moment().add(-1, "days")
                              );
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Event Location"
                          name={[name, "location"]}
                          {...restField}
                          rules={[
                            {
                              required: this.state.locationrequired,
                              message: "Please input your Event Name!",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Time & Location
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label="Event Tag" name="eventTag">
              <Select
                mode="tags"
                placeholder="Please Type Tags and press Enter"
                style={{ width: "100%" }}
              ></Select>
            </Form.Item>
            <Form.Item label="Event receiver">
              <Input.Group>
                <Row>
                  <Col span={20}>
                    <Form.Item
                      name="eventReceiver"
                      rules={[
                        {
                          required: true,
                          message: "Please Select your Event Receiver!",
                        },
                      ]}
                    >
                      <Select
                        style={{ width: "100%", float: "left" }}
                        mode="multiple"
                        placeholder="Please select"
                      >
                        {this.state.contactList?.map((item: any) => {
                          return (
                            <Option value={item.id}>
                              {item.attributes.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button
                      onClick={() => {
                        this.ContactListModal();
                      }}
                      className="addCategory"
                      type="primary"
                    >
                      Add Contact
                    </Button>
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>

            <Form.Item>
              <Row>
                <Col span={12}></Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    );
  }
}
export default NewEvent;
