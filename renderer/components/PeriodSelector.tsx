import React, { useState } from "react";

interface Props {
  begin?: number;
  end?: number;
  onPeriodChange?: (period: [number, number]) => void;
}

const PeriodSelector: React.FC<Props> = (props) => {
  const [begin, setBegin] = useState(props.begin || 1);
  const handleBeginChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    const begin = Number(e.target.value);
    setBegin(begin);
    if (props.onPeriodChange) {
      props.onPeriodChange([begin, end]);
    }
  };

  const [end, setEnd] = useState(props.end || 2);
  const handleEndChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const end = Number(e.target.value);
    setEnd(end);
    if (props.onPeriodChange) {
      props.onPeriodChange([begin, end]);
    }
  };

  return (
    <div>
      <select name="begin" value={begin} onChange={handleBeginChange}>
        {[...Array(10).keys()].map((x) => (
          <option value={`${x + 1}`} key={`option-left-value-${x}`}>
            {x + 1}限
          </option>
        ))}
      </select>
      〜
      <select name="end" value={end} onChange={handleEndChange}>
        {[...Array(10).keys()].map((x) => (
          <option value={`${x + 1}`} key={`option-right-value-${x}`}>
            {x + 1}限
          </option>
        ))}
      </select>
    </div>
  );
};

export default PeriodSelector;
