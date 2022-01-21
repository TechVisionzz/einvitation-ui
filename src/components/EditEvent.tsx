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
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getContactList,
  newEventTag,
  newEvent,
  updateEventIdTags,
  newEventOccurance,
  newEventReceiver,
  updateEventReceiver,
  updateEventOccurance,
  getEditEvent,
  deleteEventOccurances,
  newEventOccuranceUpdate,
  deleteEventTags,
  newEventTagUpdate,
  EditEventUpdate,
  newEventReceiverUpdate,
  deleteEventreceiver,
} from "./CommonHelper";
import "../css/common.css";
import NewContactList from "./NewContactList";
import moment from "moment";
import { tokenstore } from "../global/global";
var myself: any,
  locationGroups: any,
  startTime: any,
  endTime: any,
  counter: any,
  eventId: any,
  myform: any;
myform = createRef();
class EditEvent extends Component<any, any> {
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
      editEventList: {},
      editEventTag: [],
      editEventReceiver: [],
      editEventOccurance: [],
      editEventOccuranceId: [],
      editEventTagId: [],
      editEventReceiverId: [],
    };
  }

  ContactListModal = () => {
    this.setState({ newContactListModal: true });
  };
  closeModel = () => {
    this.setState({ newContactListModal: false });
  };
  getEditEvent = async () => {
    await getEditEvent()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({ editEventList: response.data });
          console.log(this.state.editEventList);
          //set edit event tag
          await this.state.editEventList.attributes.eventtags.data.map(
            async (item: any) => {
              console.log(item);
              await this.setState({
                editEventTag: [
                  ...this.state.editEventTag,
                  item.attributes.name,
                ],
                editEventTagId: [...this.state.editEventTagId, item.id],
              });
              console.log(this.state.editEventTag);
            }
          );
          //set  event occurance for delete
          await this.state.editEventList.attributes.eventoccurances.data.map(
            async (item: any) => {
              console.log(item.attributes.startTime);
              console.log(item.attributes.endTime);
              console.log(item.attributes.location);
              await this.setState({
                editEventOccuranceId: [
                  ...this.state.editEventOccuranceId,
                  item.id,
                ],
              });
              console.log(this.state.editEventOccuranceId);
            }
          );
          //set  event receiver
          await this.state.editEventList.attributes.eventreceivers.data.map(
            async (item: any) => {
              await this.setState({
                editEventReceiver: [
                  ...this.state.editEventReceiver,
                  item.attributes.contactId.data.id,
                ],
                editEventReceiverId: [
                  ...this.state.editEventReceiverId,
                  item.id,
                ],
              });
              console.log(this.state.editEventReceiver);
              console.log(this.state.editEventReceiverId);
            }
          );
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  getcontactList = async () => {
    await getContactList()
      .then(async (response: any) => {
        if (response && response.data) {
          console.log(response.data);
          await this.setState({ contactList: response.data });
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  componentDidMount = async () => {
    this.getcontactList();
    this.getEditEvent();
  };
  deletePreviousTags = async () => {
    for (var i = 0; i < this.state.editEventTagId.length; i++) {
      await deleteEventTags(this.state.editEventTagId[i]).then(
        (response: any) => {
          if (response && response.data) {
            console.log(this.state.tagId);
          }
        }
      );
    }
  };
  deletePreviousEventReceiver = async () => {
    for (var i = 0; i < this.state.editEventReceiverId.length; i++) {
      await deleteEventreceiver(this.state.editEventReceiverId[i]).then(
        (response: any) => {
          if (response && response.data) {
            console.log(response.data);
          }
        }
      );
    }
  };
  deletePreviousEventsOccurance = async () => {
    for (var i = 0; i < this.state.editEventOccuranceId.length; i++) {
      await deleteEventOccurances(this.state.editEventOccuranceId[i]).then(
        (response: any) => {
          if (response && response.data) {
            console.log(response.data);
          }
        }
      );
    }
  };
  createEventOccurances = async (locationGroup: any) => {
    var locationgroup = locationGroup;
    for (var i = 0; i < locationgroup.length; i++) {
      var location = locationgroup[i].location;
      counter = 0;
      var occurance = locationgroup[i].occurance;
      console.log(location);
      console.log(occurance);
      for (var j = 0; j < occurance.length; j++) {
        if (counter == 0) {
          startTime = occurance[j].format("MM-DD-YYYY HH:mm A");
          counter++;
        } else {
          endTime = occurance[j].format("MM-DD-YYYY HH:mm A");
          counter--;
        }
      }
      await newEventOccuranceUpdate(startTime, endTime, location).then(
        async (response: any) => {
          if (response && response.data) {
            await this.setState({
              occuranceId: [...this.state.occuranceId, response.data.id],
            });
            console.log(this.state.occuranceId);
          }
        }
      );
    }
  };
  createEventTags = async (eventTag: any) => {
    var tags = eventTag;
    for (var i = 0; i < tags.length; i++) {
      await newEventTagUpdate(tags[i])
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
    }
  };
  createEventReceiver = async (eventReceiver: any) => {
    var eventReceiver = eventReceiver;
    for (var i = 0; i < eventReceiver.length; i++) {
      await newEventReceiverUpdate(eventReceiver[i])
        .then(async (response: any) => {
          if (response && response.data) {
            console.log(response.data);
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
    }
  };
  onFinish = async (values: any) => {
    this.setState({ isSpinVisible: true });
    // for location and date of event
    if (values.locationGroup) {
      //delete previous eVentOccurances
      await this.deletePreviousEventsOccurance();
      //  create new eVentOccurances
      await this.createEventOccurances(values.locationGroup);
    }
    // for event tags
    if (values.eventTag) {
      //delete previous event tags
      await this.deletePreviousTags();
      // create new event tags
      await this.createEventTags(values.eventTag);
    }
    // //for add event receiver
    if (values.eventReceiver) {
      // delete previous event receiver
      await this.deletePreviousEventReceiver();
      // create  new event receiver
      await this.createEventReceiver(values.eventReceiver);
    }
    // //create event
    await EditEventUpdate(
      values,
      this.state.occuranceId,
      this.state.eventReceiverId,
      this.state.tagId
    )
      .then((response: any) => {
        if (response && response.data) {
          message.success("Data Updated SuccesFully!");
          this.setState({ isSpinVisible: false });
          tokenstore.removeItem("eventId");
          myself.props.history.push("/dashboard/ownerEvents");
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isSpinVisible: false });
      });
  };
  onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  render() {
    const { editEventList, editEventTag, editEventReceiver } = this.state;
    if (tokenstore.eventId) {
      if (
        !editEventList ||
        !editEventList.attributes ||
        editEventReceiver.length == 0
      ) {
        return (
          <div>
            <Spin
              style={{ margin: "20px" }}
              size="large"
              tip="Loading..."
            ></Spin>
            ,
          </div>
        );
      }
    } else {
      return <div>Id Not Found...</div>;
    }
    locationGroups = [];
    this.state.editEventList.attributes.eventoccurances.data.map(
      (item: any) => {
        var a = item.attributes.startTime.split("-");
        var b = a[2].split(" ");
        var startTime =
          b[0] + "-" + a[0] + "-" + a[1] + " " + b[1] + " " + b[2];
        // end time
        var a = item.attributes.endTime.split("-");
        var b = a[2].split(" ");
        var endTime = b[0] + "-" + a[0] + "-" + a[1] + " " + b[1] + " " + b[2];
        if (item.attributes.startTime) {
          var locationGroup = {
            location: item.attributes.location,
            occurance: [
              moment(startTime, "YYYY-MM-DD HH:mm A"),
              moment(endTime, "YYYY-MM-DD HH:mm A"),
            ],
          };

          locationGroups.push(locationGroup);
        }
      }
    );
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
              remember: true,
              category: tokenstore.eventId
                ? editEventList.attributes.category
                : " ",
              name: tokenstore.eventId ? editEventList.attributes.name : " ",
              description: tokenstore.eventId
                ? editEventList.attributes.description
                : " ",
              type: tokenstore.eventId ? editEventList.attributes.type : " ",
              eventTag: tokenstore.eventId ? editEventTag : " ",
              eventReceiver: tokenstore.eventId ? editEventReceiver : " ",
              locationGroup: tokenstore.eventId ? locationGroups : " ",
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Title level={2}>Edit event.</Title>
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
                <Option value="1">Corporate</Option>
                <Option value="2">Gala or Fundraiser</Option>
                <Option value="3">Show or Performance</Option>
                <Option value="4">Wedding</Option>
                <Option value="5">Reunion</Option>
                <Option value="6">Holiday Party</Option>
                <Option value="7">Military</Option>
                <Option value="8">BirthDay</Option>
                <Option value="9">Faith Based</Option>
                <Option value="10">Other</Option>
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
                              message: "Please Select Event Date!",
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
                        // defaultValue={editEventReceiver}
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
export default EditEvent;
