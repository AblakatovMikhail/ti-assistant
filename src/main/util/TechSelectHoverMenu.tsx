import {
  sortTechsByName,
  sortTechsByPreReqAndExpansion,
} from "../../AddTechList";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { Tech } from "../../util/api/techs";
import { getTechTypeColor } from "../../util/techs";
import { responsivePixels } from "../../util/util";

export interface TechSelectHoverMenuProps {
  direction?: string;
  label?: string;
  techs: Tech[];
  selectTech: (tech: Tech) => void;
}

export function TechSelectHoverMenu({
  techs,
  label = "Research Tech",
  selectTech,
  direction = "horizontal",
}: TechSelectHoverMenuProps) {
  const blueTechs = techs.filter((tech) => {
    return tech.type === "blue";
  });
  sortTechsByPreReqAndExpansion(blueTechs);
  const greenTechs = techs.filter((tech) => {
    return tech.type === "green";
  });
  sortTechsByPreReqAndExpansion(greenTechs);
  const yellowTechs = techs.filter((tech) => {
    return tech.type === "yellow";
  });
  sortTechsByPreReqAndExpansion(yellowTechs);
  const redTechs = techs.filter((tech) => {
    return tech.type === "red";
  });
  sortTechsByPreReqAndExpansion(redTechs);
  const unitUpgrades = techs.filter((tech) => {
    return tech.type === "upgrade";
  });
  sortTechsByName(unitUpgrades);

  return (
    <ClientOnlyHoverMenu label={label} style={{ whiteSpace: "nowrap" }}>
      <div
        className={direction === "horizontal" ? "flexRow" : "flexColumn"}
        style={{
          padding: responsivePixels(8),
          alignItems: "flex-start",
          overflow: "visible",
        }}
      >
        {redTechs.length > 0 ? (
          <ClientOnlyHoverMenu
            label="Warfare"
            borderColor={getTechTypeColor("red")}
          >
            <div
              className="flexColumn"
              style={{
                padding: responsivePixels(8),
                gap: responsivePixels(4),
                alignItems: "stretch",
              }}
            >
              {redTechs.map((tech) => {
                return (
                  <button
                    key={tech.name}
                    onClick={() => selectTech(tech)}
                    style={{ fontSize: responsivePixels(16) }}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
        ) : null}
        {blueTechs.length > 0 ? (
          <ClientOnlyHoverMenu
            label="Propulsion"
            borderColor={getTechTypeColor("blue")}
          >
            <div
              className="flexColumn"
              style={{
                padding: responsivePixels(8),
                gap: responsivePixels(4),
                alignItems: "stretch",
              }}
            >
              {blueTechs.map((tech) => {
                return (
                  <button
                    key={tech.name}
                    onClick={() => selectTech(tech)}
                    style={{ fontSize: responsivePixels(16) }}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
        ) : null}
        {yellowTechs.length > 0 ? (
          <ClientOnlyHoverMenu
            label="Cybernetic"
            borderColor={getTechTypeColor("yellow")}
          >
            <div
              className="flexColumn"
              style={{
                padding: responsivePixels(8),
                gap: responsivePixels(4),
                alignItems: "stretch",
              }}
            >
              {yellowTechs.map((tech) => {
                return (
                  <button
                    key={tech.name}
                    onClick={() => selectTech(tech)}
                    style={{ fontSize: responsivePixels(16) }}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
        ) : null}
        {greenTechs.length > 0 ? (
          <ClientOnlyHoverMenu
            label="Biotic"
            borderColor={getTechTypeColor("green")}
          >
            <div
              className="flexColumn"
              style={{
                padding: responsivePixels(8),
                gap: responsivePixels(4),
                alignItems: "stretch",
              }}
            >
              {greenTechs.map((tech) => {
                return (
                  <button
                    key={tech.name}
                    onClick={() => selectTech(tech)}
                    style={{ fontSize: responsivePixels(16) }}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
        ) : null}
        {unitUpgrades.length > 0 ? (
          <ClientOnlyHoverMenu label="Unit Upgrades">
            <div
              className="flexColumn"
              style={{
                padding: responsivePixels(8),
                gap: responsivePixels(4),
                alignItems: "stretch",
              }}
            >
              {unitUpgrades.map((tech) => {
                return (
                  <button
                    key={tech.name}
                    onClick={() => selectTech(tech)}
                    style={{ fontSize: responsivePixels(16) }}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
        ) : null}
      </div>
    </ClientOnlyHoverMenu>
  );
}