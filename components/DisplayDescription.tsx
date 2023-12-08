import React, { useState } from 'react';

const MAX_CHARACTERS = 500;

const DisplayDescription = ({ initialExpanded, description }:any) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const truncatedDescription = expanded
    ? description
    : description.slice(0, MAX_CHARACTERS) + '...';

  return (
    <div>
      <p className="text-slate-400 mt-4" style={{lineHeight:'36px'}}>{truncatedDescription}</p>
      {description.length > MAX_CHARACTERS && (
        <button
          className="cs-btn cs-style1 cs-btn_lg w-100 text-center"
          onClick={toggleExpanded}
        >
          {expanded ? 'View Less' : 'View More'}
        </button>
      )}
    </div>
  );
};

export default DisplayDescription;
