import React, { useEffect, useRef, useState } from "react";

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
const weekdayEng = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

interface Props {
  initialDayOfWeeks?: number[];
  onDayOfWeeksChange?: (dows: number[]) => void;
}

const DayOfWeeks: React.FC<Props> = (props) => {
  const [dows, setDows] = useState(props.initialDayOfWeeks || []);
  const dayOfWeeksHandler = useRef(props.onDayOfWeeksChange);

  const handleDowChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = Number(e.target.value);
    if (dows.includes(value)) {
      if (value === 7) {
        setDows([]);
      } else {
        setDows((x) => x.filter((y) => y !== value));
      }
    } else {
      if (value === 7) {
        setDows([7]);
      } else {
        setDows((x) => [...x.filter((y) => y !== 7), value]);
      }
    }
  };

  useEffect(() => {
    dayOfWeeksHandler.current = props.onDayOfWeeksChange;
  }, [props.onDayOfWeeksChange]);

  useEffect(() => {
    if (dayOfWeeksHandler.current) {
      dayOfWeeksHandler.current(dows);
    }
  }, [dows]);

  return (
    <div className="space-x-5">
      {weekdays.map((w, i) => (
        <span className="inline-block" key={`${w}-${i}`}>
          <input
            name="dow0"
            type="checkbox"
            id={`day-of-weeks-${weekdayEng[i]}`}
            value={i}
            onChange={handleDowChange}
            checked={dows.includes(i)}
          />{" "}
          <label htmlFor={`day-of-weeks-${weekdayEng[i]}`}>{w}</label>
        </span>
      ))}
      <span className="inline-block">
        <input
          name="dow0"
          type="checkbox"
          id="day-of-weeks-other"
          value={7}
          onChange={handleDowChange}
          checked={dows.includes(7)}
        />{" "}
        <label htmlFor="day-of-weeks-other">その他</label>
      </span>
    </div>
  );
};

export default DayOfWeeks;
