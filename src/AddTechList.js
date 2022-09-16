import { useState } from "react";
import Image from 'next/image';

import { TechRow } from "/src/TechRow.js";
import { Tab, TabBody } from "/src/Tab.js";

function sortTechs(techs, fields) {
  techs.sort((a, b) => {
    for (let index = 0; index < fields.length; index++) {
      if (a[fields[0]] > b[fields[0]]) {
        return 1;
      }
      if (a[fields[0]] < b[fields[0]]) {
        return -1;
      }
    }
    return 0;
  });
}

export function AddTechList({ techs, addTech }) {
  const [tabShown, setTabShown] = useState("blue");

  const blueTechs = techs.filter((tech) => {
    return tech.type === 'blue';
  });
  sortTechs(blueTechs, ['prereqs', 'game']);
  const greenTechs = techs.filter((tech) => {
    return tech.type === 'green';
  });
  sortTechs(greenTechs, ['prereqs', 'game']);
  const yellowTechs = techs.filter((tech) => {
    return tech.type === 'yellow';
  });
  sortTechs(yellowTechs, ['prereqs', 'game']);
  const redTechs = techs.filter((tech) => {
    return tech.type === 'red';
  });
  sortTechs(redTechs, ['prereqs', 'game']);
  const unitUpgrades = techs.filter((tech) => {
    return tech.type === 'upgrade';
  });
  sortTechs(unitUpgrades, ['name']);

  return (
    <div>
      <div className="flexRow" style={{ position: "sticky", top: "41px", backgroundColor: "white", zIndex: 902, padding: "4px 4px 0px 4px", borderBottom: "1px solid black"}}>
        <Tab selectTab={setTabShown} id="blue" selectedId={tabShown} content={
          <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" width="22px" height="22px" />
        } />
        <Tab selectTab={setTabShown} id="green" selectedId={tabShown} content={
          <Image src="/images/green_tech.webp" alt="Green Tech Skip" width="22px" height="22px" />
        } />
        <Tab selectTab={setTabShown} id="yellow" selectedId={tabShown} content={
          <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" width="22px" height="22px" />
        } />
        <Tab selectTab={setTabShown} id="red" selectedId={tabShown} content={
          <Image src="/images/red_tech.webp" alt="Red Tech Skip" width="22px" height="22px" />
        } />
        <Tab selectTab={setTabShown} id="upgrades" selectedId={tabShown} content={
          "Upgrades"
        } />
      </div>
      <TabBody id="blue" selectedId={tabShown} content={
        <div>
          {blueTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } />
      <TabBody id="green" selectedId={tabShown} content={
        <div>
          {greenTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } />
      <TabBody id="yellow" selectedId={tabShown} content={
        <div>
          {yellowTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } />
      <TabBody id="red" selectedId={tabShown} content={
        <div>
          {redTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } />
      <TabBody id="upgrades" selectedId={tabShown} content={
        <div>
          {unitUpgrades.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } />
    </div>
  )
}