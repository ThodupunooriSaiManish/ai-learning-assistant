import React, { useState } from "react";

export default function TabsWrapper({ childrenMap }) {
  const keys = Object.keys(childrenMap);
  const [active, setActive] = useState(keys[0]);

  return (
    <div>
      <div className="tabs">
        {keys.map(k => (
          <button
            key={k}
            className={`tab-btn ${k === active ? "active" : ""}`}
            onClick={() => setActive(k)}
          >
            {childrenMap[k].title}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {childrenMap[active].node}
      </div>
    </div>
  );
}
