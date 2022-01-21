import {
  CopyOutlined,
  DashboardOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Divider,
  Input,
  message,
  Popconfirm,
  Popover,
  Row,
  Tabs,
  Tooltip,
} from "antd";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { convertCompilerOptionsFromJson } from "typescript";
import "../css/LogIn.css";
import { tokenstore } from "../global/global";
import {
  getCurrentEvents,
  getPastEvents,
  getPublicEvents,
  deleteEvent,
  deleteEventOccurance,
  deleteEventreceiver,
  deleteEventTags,
} from "./CommonHelper";
import { GlobalVars } from "../global/global";
var myself: any;
class OwnerEvents extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      currentEventsList: [],
      pastEventsList: [],
      publicEventsList: [],
      pastEventIsPresent: false,
      currentEventIsPresent: false,
      publicEventIsPresent: false,
      deleteMyEvent: [],
    };
  }
  currentEventsList = async () => {
    await getCurrentEvents()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({ currentEventsList: response.data });
          if (this.state.currentEventsList.length >= 1) {
            console.log(this.state.currentEventsList);
            this.setState({ currentEventIsPresent: true });
          }
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  getPastEvents = async () => {
    await getPastEvents()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({
            pastEventsList: response.data,
          });
          if (this.state.pastEventsList.length >= 1) {
            console.log(this.state.pastEventsList);
            this.setState({ pastEventIsPresent: true });
          }
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  getPublicEvents = async () => {
    await getPublicEvents()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({
            publicEventsList: response.data,
          });
          if (this.state.publicEventsList.length >= 1) {
            console.log(this.state.publicEventsList);
            this.setState({ publicEventIsPresent: true });
          }
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  componentDidMount = async () => {
    this.currentEventsList();
    this.getPastEvents();
    this.getPublicEvents();
  };
  setEventId = (id: any, eventUId: any) => {
    GlobalVars.publicEventId = eventUId;
    tokenstore.eventId = id;

    // myself.props.history.push(
    //   `/dashboard/publicEvent/${GlobalVars.publicEventId}`
    // );
  };
  setPublicEventId = (id: any, eventUId: any) => {
    GlobalVars.publicEventId = eventUId;
    tokenstore.eventId = id;
    myself.props.history.push(
      `/dashboard/publicEvent/${GlobalVars.publicEventId}`
    );
  };
  deleteEvent = async () => {
    deleteEvent()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({ deleteMyEvent: response.data });
          message.success("Data Deleted SuccessFully!");
          // delete event occurances
          this.state.deleteMyEvent.attributes.eventoccurances.data.map(
            async (item: any) => {
              // delete event occurance
              await deleteEventOccurance(item.id)
                .then(async (response: any) => {
                  if (response && response.data) {
                  }
                })
                .catch(async (error) => {
                  console.log(error);
                });
            }
          );
          //delete tags
          this.state.deleteMyEvent.attributes.eventtags.data.map(
            async (item: any) => {
              // delete event tags
              await deleteEventTags(item.id)
                .then(async (response: any) => {
                  if (response && response.data) {
                  }
                })
                .catch(async (error) => {
                  console.log(error);
                });
            }
          );
          //delete event receiver
          this.state.deleteMyEvent.attributes.eventreceivers.data.map(
            async (item: any) => {
              // delete event tags
              await deleteEventreceiver(item.id)
                .then(async (response: any) => {
                  if (response && response.data) {
                    this.currentEventsList();
                    this.getPastEvents();
                  }
                })
                .catch(async (error) => {
                  console.log(error);
                });
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  copyLink = () => {};
  copyPublicEventLink = async () => {
    var eventUrl =
      window.location.host +
      "/dashboard/publicEvent/" +
      GlobalVars.publicEventId;
    console.log(eventUrl);
  };
  render() {
    const pastEventIsPresent = this.state.pastEventIsPresent;
    const currentEventIsPresent = this.state.currentEventIsPresent;
    const publicEventIsPresent = this.state.publicEventIsPresent;

    const onSearch = (value: any) => console.log(value);
    function callback(key: any) {}
    const { TabPane } = Tabs;
    const { Meta } = Card;
    const { Search } = Input;
    const ownerContent = (
      <div>
        <div className="cardStripe">
          <span>
            <CopyOutlined />
            <span className="cardStripeText" onClick={this.copyLink}>
              {" "}
              Copy Link
            </span>
          </span>
        </div>
        <div className="cardStripe">
          <span>
            <DeleteOutlined />
            <Popconfirm
              title="Are you sure to delete this Event?"
              onConfirm={this.deleteEvent}
              okText="Yes"
              cancelText="No"
            >
              <span className="cardStripeText">Delete Event</span>
            </Popconfirm>
          </span>
        </div>
      </div>
    );
    const publicContent = (
      <div>
        <div className="cardStripe">
          <span>
            <CopyOutlined />
            <span onClick={this.copyPublicEventLink} className="cardStripeText">
              {" "}
              Copy Link
            </span>
          </span>
        </div>
      </div>
    );
    return (
      <div>
        <Title className="modelTitle" level={2}>
          Events.
        </Title>
        <Row>
          <Col span={5}>
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
            />
          </Col>
        </Row>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Current Events" key="1">
            <Row>
              <Divider>
                <Title level={4}>My Events</Title>
              </Divider>
              {(() => {
                if (currentEventIsPresent) {
                  return this.state.currentEventsList.map((item: any) => {
                    return (
                      <Col span={6}>
                        <Card
                          hoverable
                          key={item.id}
                          style={{ width: 300, marginTop: "20px" }}
                          cover={
                            <img
                              alt="example"
                              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                          }
                          actions={[
                            <Tooltip placement="top" title={"Details"}>
                              <Link to="/eventDashboard">
                                <DashboardOutlined
                                  onClick={() =>
                                    this.setEventId(
                                      item.id,
                                      item.attributes.eventUId
                                    )
                                  }
                                  key="dashboard"
                                />
                              </Link>
                            </Tooltip>,
                            <Tooltip placement="top" title={"Edit Event"}>
                              <Link to="/dashboard/EditEvent">
                                <EditOutlined
                                  onClick={() =>
                                    this.setEventId(
                                      item.id,
                                      item.attributes.eventUId
                                    )
                                  }
                                  key={item.id}
                                />
                              </Link>
                            </Tooltip>,
                            <Popover
                              placement="topRight"
                              content={ownerContent}
                              trigger="click"
                            >
                              <EllipsisOutlined
                                onClick={() =>
                                  this.setEventId(
                                    item.id,
                                    item.attributes.eventUId
                                  )
                                }
                                key="ellipsis"
                              />
                            </Popover>,
                          ]}
                        >
                          <Meta
                            avatar={
                              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            }
                            title={item.attributes.name}
                            description={item.attributes.type}
                          />
                        </Card>
                      </Col>
                    );
                  });
                } else {
                  return <div>No Current Event Available</div>;
                }
              })()}
            </Row>
            <Row>
              <Divider>
                <Title level={4}>Public Events</Title>
              </Divider>
              {(() => {
                if (publicEventIsPresent) {
                  return this.state.publicEventsList.map((item: any) => {
                    return (
                      <Col span={6}>
                        <Card
                          hoverable
                          key={item.id}
                          style={{ width: 300, marginTop: "20px" }}
                          cover={
                            <img
                              alt="example"
                              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                          }
                          actions={[
                            <Tooltip placement="top" title={"Details"}>
                              {/* <Link
                              to={`/dashboard/publicEvent/${GlobalVars.publicEventId}`}
                            > */}
                              <DashboardOutlined
                                onClick={() =>
                                  this.setPublicEventId(
                                    item.id,
                                    item.attributes.eventUId
                                  )
                                }
                                key="dashboard"
                              />
                              {/* </Link> */}
                            </Tooltip>,
                            <Popover
                              placement="topRight"
                              content={publicContent}
                              trigger="click"
                            >
                              <EllipsisOutlined
                                onClick={() =>
                                  this.setEventId(
                                    item.id,
                                    item.attributes.eventUId
                                  )
                                }
                                key="ellipsis"
                              />
                            </Popover>,
                          ]}
                        >
                          <Meta
                            avatar={
                              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            }
                            title={item.attributes.name}
                            description={item.attributes.type}
                          />
                        </Card>
                      </Col>
                    );
                  });
                } else {
                  return <div>No Public Event Available</div>;
                }
              })()}
            </Row>
          </TabPane>
          <TabPane tab="Past Events" key="2">
            <Row>
              {(() => {
                if (pastEventIsPresent) {
                  return this.state.pastEventsList.map((item: any) => {
                    return (
                      <Col span={6}>
                        <Card
                          key={item.id}
                          style={{ width: 300 }}
                          cover={
                            <img
                              alt="example"
                              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                          }
                          actions={[
                            <Link to="/eventDashboard">
                              <DashboardOutlined key="dashboard" />
                            </Link>,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                          ]}
                        >
                          <Meta
                            avatar={
                              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            }
                            title={item.attributes.name}
                            description={item.attributes.description}
                          />
                        </Card>
                      </Col>
                    );
                  });
                } else {
                  return <div>No Past Event present</div>;
                }
              })()}
              {/* {pastEventIsPresent ? <div>prsent</div> : <div>not present</div>} */}
            </Row>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default OwnerEvents;
