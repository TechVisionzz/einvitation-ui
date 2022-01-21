// @ts-nocheck
import React, { Component } from "react";
import { Alert, Menu, Calendar, Badge } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "../css/common.css";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import {
  getCurrentEvents,
  attendeeContactList,
  checkContactList,
} from "./CommonHelper";
import { promises } from "stream";
var myself: any;
var a: any, b: any;
let eventListData = [];
let receiverListData = [];
class DashBoardDefault extends Component<any, any> {
  constructor(props: any) {
    super(props);
    myself = this;
    this.state = {
      isSpinVisible: false,
      value: "",
      selectedValue: "",
      ownerEventsList: [],
      receiverEventsList: [],
      attendeeEventsList: [],
    };
  }
  ownerEventsList = async () => {
    await getCurrentEvents()
      .then(async (response: any) => {
        if (response && response.data) {
          Promise.all(
            response.data.map(async (item: any) => {
              await item.attributes.eventoccurances.data.map(
                async (item1: any) => {
                  //change start date format
                  var a = item1.attributes.startTime.split("-");
                  var b = a[2].split(" ");
                  var c = b[0] + "-" + a[0] + "-" + a[1];
                  item1.attributes.startTime = c;
                  //change end date format
                  var a = item1.attributes.endTime.split("-");
                  var b = a[2].split(" ");
                  var c = b[0] + "-" + a[0] + "-" + a[1];
                  item1.attributes.endTime = c;
                  var itemGroup = {
                    type: "ownerEvent",
                    name: item.attributes.name,
                    startDate: item1.attributes.startTime,
                  };

                  eventListData.push(itemGroup);
                }
              );
            })
          );
          await this.setState({
            ownerEventsList: response.data,
          });
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  receiverEventsList = async () => {
    await checkContactList()
      .then(async (response: any) => {
        if (response && response.data) {
          await this.setState({
            receiverEventsList: response.data,
          });
          Promise.all(
            await this.state.receiverEventsList.map(async (item: any) => {
              await item.attributes.eventreceivers.data.map(
                async (item2: any) => {
                  console.log(item2.attributes.eventId.data.attributes.name);
                  await item2.attributes.eventId.data.attributes.eventoccurances.data.map(
                    (item3: any) => {
                      //change start date format
                      var a = item3.attributes.startTime.split("-");
                      var b = a[2].split(" ");
                      var c = b[0] + "-" + a[0] + "-" + a[1];
                      item3.attributes.startTime = c;
                      var itemGroup = {
                        type: "receiverEvent",
                        name: item2.attributes.eventId.data.attributes.name,
                        startDate: item3.attributes.startTime,
                      };
                      eventListData.push(itemGroup);
                    }
                  );
                }
              );
            })
          );
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  attendeeEventsList = async () => {
    await attendeeContactList()
      .then(async (response: any) => {
        if (response && response.data) {
          console.log(response.data);
          await this.setState({
            attendeeEventsList: response.data,
          });
          Promise.all(
            await this.state.attendeeEventsList.map(async (item: any) => {
              await item.attributes.eventattendees.data.map(
                async (item2: any) => {
                  console.log(item2.attributes.eventId.data.attributes.name);
                  await item2.attributes.eventId.data.attributes.eventoccurances.data.map(
                    (item3: any) => {
                      //change start date format
                      var a = item3.attributes.startTime.split("-");
                      var b = a[2].split(" ");
                      var c = b[0] + "-" + a[0] + "-" + a[1];
                      item3.attributes.startTime = c;
                      var itemGroup = {
                        type: "attendeeEvent",
                        name: item2.attributes.eventId.data.attributes.name,
                        startDate: item3.attributes.startTime,
                      };
                      eventListData.push(itemGroup);
                    }
                  );
                }
              );
            })
          );
        }
      })
      .catch(async (error) => {
        console.log(error);
      });
  };
  componentDidMount = async () => {
    await this.ownerEventsList();
    await this.receiverEventsList();
    await this.attendeeEventsList();
    await this.setState({
      value: moment(),
      selectedValue: moment(),
    });
  };
  onSelect = (value: any) => {
    myself.setState({
      value,
      selectedValue: value,
    });
  };

  onPanelChange = async (value: any) => {
    this.setState({ value });
  };

  getMonthData = (value: any) => {
    if (value.month() === 8) {
      return 1394;
    }
  };
  monthCellRender = (value: any) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  getListData = (value: any) => {
    let ownerEventListData = [];
    var type;
    eventListData
      .filter((item) => item.startDate == value.format("YYYY-MM-DD"))
      .map((item1: any) => {
        console.log(item1);
        if (item1.type == "ownerEvent") {
          type = "success";
        }
        if (item1.type == "receiverEvent") {
          type = "warning";
        }
        if (item1.type == "attendeeEvent") {
          type = "processing";
        }
        switch (value.format("YYYY-MM-DD")) {
          case item1.startDate:
            var itemGroup = {
              type: type,
              content: item1.name,
            };
            ownerEventListData.push(itemGroup);
            break;
          default:
        }
      });
    const unique = [];
    ownerEventListData.map((x) =>
      unique.filter((a) => a.content == x.content && a.type == x.type).length >
      0
        ? null
        : unique.push(x)
    );
    console.log(unique);
    return unique || [];
  };
  dateCellRender = (value: any) => {
    var listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id}>
            <Badge key={item.id} status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  render() {
    const { value, selectedValue } = this.state;
    return (
      <div>
        <Title className="modelTitle" level={2}>
          Upcoming Events.
        </Title>
        <Alert
          message={`You selected date: ${
            selectedValue && selectedValue.format("YYYY-MM-DD")
          }`}
        />
        <Calendar
          value={value}
          onSelect={this.onSelect}
          dateCellRender={this.dateCellRender}
          monthCellRender={this.monthCellRender}
        />
      </div>
    );
  }
}

export default DashBoardDefault;
