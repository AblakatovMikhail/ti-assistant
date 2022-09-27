import { useState } from "react";
import Image from 'next/image';

import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "/src/FactionCard.js";

function TechIcon({ type, width, height }) {
  switch (type) {
    case "red":
      return <Image src="/images/red_tech.webp" alt="Red Tech Skip" width={width} height={height} />;
    case "yellow":
      return <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" width={width} height={height} />;
    case "blue":
      return <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
    case "green":
      return <Image src="/images/green_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
  }
  return type;
}

function UnitStat({name, stat}) {
  return (
    <div style={{flexBasis: "25%", border: "1px solid #eee", borderRadius: "10px"}}>
      <div style={{fontSize: "24px"}}>{stat}</div>
      <div style={{fontSize: "14px", borderTop: "1px solid #eee"}}>{name}</div>
    </div>
  );
}

function UnitStatBlock({stats}) {
  if (!stats) {
    return null;
  }
  return (
    <div className="flexRow" style={{justifyContent: "flex-start", marginTop: "4px", fontFamily:"Slider", alignItems: "stretch"}}>
      {stats.cost ? <UnitStat name="COST" stat={stats.cost} /> : <div style={{flexBasis: "25%"}}></div>}
      {stats.combat ? <UnitStat name="COMBAT" stat={stats.combat} /> : <div style={{flexBasis: "25%"}}></div>}
      {stats.move ? <UnitStat name="MOVE" stat={stats.move} /> : <div style={{flexBasis: "25%"}}></div>}
      {stats.capacity ? <UnitStat name="CAPACITY" stat={stats.capacity} /> : <div style={{flexBasis: "25%"}}></div>}
    </div>
  )
}

function InfoContent({tech}) {
  const description = tech.description.replaceAll("\\n", "\n");
  return (
    <div className="myriadPro" style={{whiteSpace: "pre-line", textAlign: "center", fontSize: "20px"}}>
      {description}
      <UnitStatBlock stats={tech.stats} />
    </div>
  );
}

export function TechRow({tech, updateTech, removeTech, addTech, leftContent}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }

  function toggleTech() {
    updateTech(tech.name, {
      ...tech,
      isReady: !tech.isReady,
    });
  }

  function getTechColor() {
    switch (tech.type) {
      case "red":
        return "indianred";
      case "yellow":
        return "goldenrod";
      case "blue":
        return "cornflowerblue";
      case "green":
        return "seagreen";
    }
    return "#eee";
  }

  return (
    <div className={`techRow ${tech.canExhaust && !tech.isReady ? "exhausted" : ""}`} style={{fontSize: "16px", gap: "4px"}}>
      <Modal closeMenu={() => setShowInfoModal(false)} level={2} visible={showInfoModal} title={tech.name} content={
        <InfoContent tech={tech} />
      } top="30%" />
      {leftContent ? <div style={{zIndex: 2}}>{leftContent}</div> : null}
      {addTech ? 
        <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "darkgreen",
          cursor: "pointer",
          zIndex: 100,
          marginRight: "4px",
        }}
        onClick={() => addTech(tech.name)}
      >
        &#x2713;
      </div>
      : null}
      {removeTech ? 
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "darkred",
            cursor: "pointer",
            zIndex: 100,
            marginRight: "4px",
          }}
          onClick={() => removeTech(tech.name)}
        >
          &#x2715;
        </div>
      : null}
      {/* <div className="flexRow" style={{width: "100%", height: "100%", position: "absolute", top: "0", left: "0"}}>
        {tech.prereqs.map((prereq, index) => {
          return <TechIcon key={index} type={prereq} width="22px" height="22px" />;
        })}
      </div> */}
      <div style={{display: "flex", flexDirection: "row", flexGrow: 2, alignItems: "center"}}>
        <div style={{ position: "relative", display: "flex", zIndex: 2, color: getTechColor()}}>
          {tech.name}
          {tech.faction ? (
        <div
          style={{
            position: "absolute",
            opacity: "70%",
            height: "32px",
            zIndex: -2,
            top: "-6px",
            right: "-16px", 
          }}
        >
          <FactionSymbol faction={tech.faction} size={32} />
        </div>
        ): null}
        </div>

        <div style={{marginLeft: "8px", fontSize: "20px", position: "relative", zIndex: 2}} onClick={displayInfo}>&#x24D8;</div>
      </div>
      <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            opacity: "80%",
            flexShrink: 0,
          }}
        >
          {tech.prereqs.map((prereq, index) => {
          return <TechIcon key={index} type={prereq} width="23px" height="24px" />;
        })}
          {/* <TechIcon type={tech.type} faction={tech.faction} width="32px" height="36px" /> */}
        </div>
      {/* {updateTech !== undefined && tech.canExhaust ? 
      <div className="flexColumn" style={{zIndex:2}}>
        <button onClick={() => toggleTech(tech.name)}>
            {tech.isReady ? "Exhaust" : "Ready"}
        </button>
      </div>
      : null} */}
    </div>);
}