import React from "react";
import Countdown from "./Countdown";
import EventDetail from "./EventDetail";

const EventContent = ({ data }) => {
  return (
    <div>
      <Countdown targetDate="2025-08-02T09:00:00" />
      <EventDetail data={data} />
    </div>
  );
};

export default EventContent;
