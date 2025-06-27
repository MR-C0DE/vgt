import React from "react";
import Countdown from "./Countdown";
import EventDetail from "./EventDetail";

const EventContent = ({ data, lang }) => {
  return (
    <div>
      <Countdown targetDate={data.datetime} />
      <EventDetail data={data} lang={lang} />
    </div>
  );
};

export default EventContent;
