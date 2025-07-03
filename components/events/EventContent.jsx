import React from "react";
import Countdown from "./Countdown";
import EventActions from "./EventActions";
import EventDetail from "./EventDetail";
import Photo from "./Photo";

const EventContent = ({ data, lang }) => {
  return (
    <div>
      <Countdown targetDate={data.datetime} />
      <EventDetail data={data} lang={lang} />
      <EventActions />
      <Photo />
    </div>
  );
};

export default EventContent;
