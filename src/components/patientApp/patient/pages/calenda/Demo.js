import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useHistory } from 'react-router'
import "./calenda.css";
import "./calendar_.css";
import "./calendar.css";
import moment from "moment";


export default class DemoApp extends React.Component {

  render() {
    return (
      <FullCalendar
      headerToolbar={{
        left: '',
    // center: 'title',
    right: ''
      }}
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        listPlugin,
      ]}
        dateClick={this.handleDateClick}
        // display={false}
        defaultView="dayGridMonth"
        events={[
            { title: 'event 1', date: '2022-04-01' },
            { title: 'event 2', date: '2022-04-02' }
          ]}
      />
    )
  }
  handleDateClick = (arg) => {
    if (
      window.confirm("Would you like to add an event to " + arg.dateStr + " ?")
    ) {
      this.props.navigate.push(
        `/me/patient/appointments/new/${moment(arg.dateStr).format("LLL")}`
      );
    }
  };
}

