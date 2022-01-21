// import qs from "qs";
import moment from "moment";
import { type } from "os";
import Strapi from "strapi-sdk-js";
import { tokenstore } from "../global/global";
import { v4 as uuidv4 } from "uuid";
var qs = require("qs");
const strapi = new Strapi({
  url: process.env.STRAPI_URL || "http://localhost:1337",
});
const signUp = async (values: any) => {
  const { user, jwt } = await strapi.register({
    email: values.email,
    username: values.username,
    password: values.password,
  });
};
const logIn = async (values: any) => {
  const { user, jwt } = await strapi.login({
    identifier: values.username,
    password: values.password,
  });
  strapi.setToken(jwt);
  tokenstore.jwt = jwt;
  tokenstore.userId = user.id;
  tokenstore.userName = user.username;
  tokenstore.email = user.email;
};
const isLoggedIn = () => {
  return tokenstore.jwt ? true : false;
};
const newEvent = async (
  values: any,
  occuranceId: any,
  eventReceiver: any,
  tagId: any
) => {
  console.log(occuranceId);
  console.log(values);
  console.log(eventReceiver);
  return await strapi.create("events", {
    eventUId: uuidv4(),
    name: values.name,
    description: values.description,
    type: values.type,
    ownerId: tokenstore.userId,
    category: values.category,
    eventcategory: values.location,
    eventtags: tagId,
    eventoccurances: occuranceId,
    eventreceivers: eventReceiver,
  });
};
const EditEventUpdate = async (
  values: any,
  occuranceId: any,
  eventReceiver: any,
  tagId: any
) => {
  console.log(occuranceId);
  console.log(eventReceiver);
  console.log(tagId);
  return await strapi.update("events", tokenstore.eventId, {
    name: values.name,
    description: values.description,
    type: values.type,
    ownerId: tokenstore.userId,
    category: values.category,
    eventcategory: values.location,
    eventtags: tagId,
    eventoccurances: occuranceId,
    eventreceivers: eventReceiver,
  });
};
const newEventReceiver = async (values: any, eventId: any, contactId: any) => {
  return await strapi.create("eventreceivers", {
    eventReceiverUId: uuidv4(),
    eventId: eventId,
    contactId: contactId,
    ownerId: tokenstore.userId,
  });
};
const newEventReceiverUpdate = async (contactId: any) => {
  return await strapi.create("eventreceivers", {
    eventReceiverUId: uuidv4(),
    contactId: contactId,
    ownerId: tokenstore.userId,
    eventId: tokenstore.eventId,
  });
};
const updateEventReceiver = async (id: any) => {
  return await strapi.update("eventreceivers", id, {
    eventId: tokenstore.eventId,
  });
};
const updateEventOccurance = async (id: any) => {
  return await strapi.update("eventoccurances", id, {
    eventId: tokenstore.eventId,
  });
};
const newEventOccurance = async (
  startTime: any,
  endTime: any,
  location: any
) => {
  return await strapi.create("eventoccurances", {
    startTime: startTime,
    endTime: endTime,
    location: location,
    ownerId: tokenstore.userId,
  });
};
const newEventOccuranceUpdate = async (
  startTime: any,
  endTime: any,
  location: any
) => {
  console.log(tokenstore.eventId);
  return await strapi.create("eventoccurances", {
    startTime: startTime,
    endTime: endTime,
    location: location,
    eventId: tokenstore.eventId,
    ownerId: tokenstore.userId,
  });
};
const newEventTag = async (values: any) => {
  return await strapi.create("eventtags", {
    name: values,
    ownerId: tokenstore.userId,
  });
};
const newEventTagUpdate = async (values: any) => {
  return await strapi.create("eventtags", {
    name: values,
    ownerId: tokenstore.userId,
    eventId: tokenstore.eventId,
  });
};
const updateEventIdTags = async (id: any) => {
  console.log(id);
  return await strapi.update("eventtags", id, {
    eventId: tokenstore.eventId,
  });
};
const newContactList = async (values: any) => {
  return await strapi.create("contacts", {
    name: values.contactName,
    email: values.contactEmail,
    phone: "+" + 92 + values.contactPhone,
    ownerId: tokenstore.userId,
  });
};
const newPublicContactList = async (values: any, ownerId: any) => {
  return await strapi.create("contacts", {
    name: tokenstore.userName,
    email: tokenstore.email,
    phone: "+" + 92 + values.contactPhone,
    ownerId: ownerId,
  });
};
const getCurrentEvents = async () => {
  const query = qs.stringify({
    populate: "*",
    filters: {
      $and: [
        {
          ownerId: {
            id: {
              $eq: tokenstore.userId,
            },
          },
        },
        {
          eventoccurances: {
            endTime: {
              $gte: moment().format("MM-DD-YYYY HH:mm A"),
            },
          },
        },
      ],
    },
  });
  return await strapi.find(`events?${query}`);
};
const getPublicEvents = async () => {
  const query = qs.stringify({
    populate: "*",
    filters: {
      $and: [
        {
          type: {
            $eq: "Public",
          },
        },
        {
          eventoccurances: {
            endTime: {
              $gte: moment().format("MM-DD-YYYY HH:mm A"),
            },
          },
        },
        {
          ownerId: {
            id: {
              $ne: tokenstore.userId,
            },
          },
        },
      ],
    },
  });
  return await strapi.find(`events?${query}`);
};
const getEventDetails = async (id: any) => {
  return await strapi.findOne("events", id, {
    populate: "*",
  });
};
const getUserDetails = async () => {
  return await strapi.findOne("users", tokenstore.userId);
};
const getPastEvents = async () => {
  const query = qs.stringify({
    filters: {
      ownerId: {
        id: {
          $eq: tokenstore.userId,
        },
      },
      eventoccurances: {
        endTime: {
          $lt: moment().format("MM-DD-YYYY HH:mm A"),
        },
      },
    },
  });
  return await strapi.find(`events?${query}`);
};
const getContactList = async () => {
  const query = qs.stringify({
    populate: "*",
    filters: {
      ownerId: {
        id: {
          $eq: tokenstore.userId,
        },
      },
    },
  });
  return await strapi.find(`contacts?${query}`);
};
const checkContactList = async () => {
  const query = qs.stringify({
    // populate: "*",
    populate: [
      "eventreceivers",
      "eventreceivers.eventId",
      "eventreceivers.eventId.eventoccurances",
    ],
    filters: {
      email: {
        $eq: tokenstore.email,
      },
    },
  });
  return await strapi.find(`contacts?${query}`);
};
const attendeeContactList = async () => {
  const query = qs.stringify({
    populate: [
      "eventattendees",
      "eventattendees.eventId",
      "eventattendees.eventId.eventoccurances",
    ],
    filters: {
      email: {
        $eq: tokenstore.email,
      },
    },
  });
  return await strapi.find(`contacts?${query}`);
};
const getEditContactList = async (id: any) => {
  return await strapi.findOne("contacts", id);
};
const getEditEvent = async () => {
  return await strapi.findOne("events", tokenstore.eventId, {
    populate: [
      "eventoccurances",
      "eventreceivers",
      "eventreceivers.contactId",
      "eventtags",
    ],
  });
};
const EditContactList = async (values: any) => {
  return strapi.update("contacts", tokenstore.contactId, {
    name: values.contactName,
    email: values.contactEmail,
    phone: "+" + 92 + values.contactPhone,
  });
};
const deleteContactList = async (id: any) => {
  return await strapi.delete("contacts", id);
};
const deleteEventOccurances = async (id: any) => {
  return await strapi.delete("eventoccurances", id);
};
// const deleteEventTags = async (id: any) => {
//   return await strapi.delete("eventoccurances", id);
// };
const deleteEvent = async () => {
  return await strapi.delete("events", tokenstore.eventId, {
    populate: "*",
  });
};
const deleteEventOccurance = async (id: any) => {
  return await strapi.delete("eventoccurances", id);
};
const deleteEventTags = async (id: any) => {
  return await strapi.delete("eventtags", id);
};
const deleteEventreceiver = async (id: any) => {
  return await strapi.delete("eventreceivers", id);
};
export {
  updateEventReceiver,
  newEventTagUpdate,
  newEventOccuranceUpdate,
  deleteEventOccurances,
  getEditEvent,
  deleteEventreceiver,
  checkContactList,
  deleteEventTags,
  deleteEventOccurance,
  newEventReceiver,
  deleteEvent,
  updateEventIdTags,
  getEventDetails,
  newPublicContactList,
  attendeeContactList,
  EditEventUpdate,
  signUp,
  getPublicEvents,
  newEventTag,
  deleteContactList,
  newEventReceiverUpdate,
  getContactList,
  logIn,
  // getOwnerEventsCalender,
  isLoggedIn,
  getPastEvents,
  updateEventOccurance,
  newEventOccurance,
  getUserDetails,
  newEvent,
  getCurrentEvents,
  getEditContactList,
  EditContactList,
  newContactList,
};
