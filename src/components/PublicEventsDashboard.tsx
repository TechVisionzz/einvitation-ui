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
  PageHeader,
  Descriptions,
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
  getEventDetails,
  getUserDetails,
} from "./CommonHelper";
import "../css/common.css";
import { GlobalVars, tokenstore } from "../global/global";
import NewContactList from "./NewContactList";
import PublicEventsContactList from "./PublicEventsContactList";
var myself: any;
class PublicEventsDashboard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      eventList: {},
      newContactListModal: false,
      publicEventId: 0,
      userDetail: {},
    };
  }
  getEventDetails = async () => {
    await getEventDetails(tokenstore.eventId)
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({ eventList: response.data });
          console.log(this.state.eventList);
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  componentDidMount = async () => {
    await this.getEventDetails();
    console.log(GlobalVars.publicEventId);
  };
  joinEvent = async (id: any) => {
    this.setState({ newContactListModal: true });
    await this.setState({ publicEventId: id });
    console.log(this.state.publicEventId);
  };
  closeModel = () => {
    this.setState({ newContactListModal: false });
  };
  render() {
    const { eventList, userDetail } = this.state;
    if (!eventList.attributes) {
      return (
        <div>
          <Spin style={{ margin: "20px" }} size="large" tip="Loading..."></Spin>
        </div>
      );
    }
    return (
      <Spin size="large" spinning={this.state.isSpinVisible}>
        <Modal
          width={800}
          maskClosable={true}
          closable={false}
          destroyOnClose={true}
          footer={null}
          title={"Add Contact in List"}
          visible={this.state.newContactListModal}
        >
          <PublicEventsContactList
            eventId={this.state.publicEventId}
            ownerId={this.state.eventList.attributes.ownerId.data.id}
            parentUpdate={this.closeModel}
          />
        </Modal>
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={eventList.attributes.name}
            extra={[
              <Button
                onClick={() => {
                  this.joinEvent(eventList.id);
                }}
                key="1"
                type="primary"
              >
                Join Event
              </Button>,
            ]}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item span={24} label="Category">
                {eventList.attributes.category}
              </Descriptions.Item>
              {eventList.attributes.eventoccurances.data.map((item: any) => {
                return (
                  <>
                    <Descriptions.Item label="Start Time">
                      {item.attributes.startTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="End Time">
                      {item.attributes.endTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                      {item.attributes.location}
                    </Descriptions.Item>
                  </>
                );
              })}
              <Descriptions.Item span={24} label="Description">
                {eventList.attributes.description}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </div>
      </Spin>
    );
  }
}
export default PublicEventsDashboard;
