import React, { CSSProperties, useContext, useState } from "react";
import { TechRow } from "../TechRow";
import { GameIdContext } from "../context/Context";
import { addTechAsync, removeTechAsync } from "../dynamic/api";
import { hasTech, isTechReplaced } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { getTechTypeColor, sortTechs } from "../util/techs";
import FactionIcon from "./FactionIcon/FactionIcon";
import LabeledDiv from "./LabeledDiv/LabeledDiv";
import TechIcon from "./TechIcon/TechIcon";
import styles from "./TechPanel.module.scss";
import { Selector } from "./Selector/Selector";
import { FormattedMessage, useIntl } from "react-intl";
import { techTypeString } from "../util/strings";
import { useFactions, useTechs } from "../context/dataHooks";

function FactionTechSection({ openedByDefault }: { openedByDefault: boolean }) {
  const gameId = useContext(GameIdContext);
  const factions = useFactions();
  const techs = useTechs();

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const typedTechs = Object.values(techs).filter(
    (tech) => tech.faction && !!factions[tech.faction]
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions);
  orderedFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const nekroFactionTechIds = Object.keys(factions["Nekro Virus"]?.techs ?? {})
    .filter((id) => {
      const techId = id as TechId;
      const techObj = (techs ?? {})[techId];
      if (!techObj) {
        return false;
      }
      return !!techObj.faction;
    })
    .map((id) => id as TechId);
  const availableNekroTechs = Object.values(techs ?? {}).filter((tech) => {
    const isResearched = orderedFactions.reduce((isResearched, faction) => {
      return isResearched || hasTech(faction, tech.id);
    }, false);
    return (
      isResearched &&
      tech.faction &&
      !!factions[tech.faction] &&
      tech.id !== "IIHQ Modernization"
    );
  });

  return (
    <div className={styles.factionTechsColumn}>
      <div
        className={styles.techTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FormattedMessage
          id="yctdL8"
          defaultMessage="Faction Techs"
          description="Header for a section listing out various faction technologies."
        />
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {orderedFactions.map((faction) => {
            const factionTechs = typedTechs.filter(
              (tech) => tech.faction === faction.id
            );

            return (
              <LabeledDiv
                key={faction.id}
                label={getFactionName(faction)}
                color={getFactionColor(faction)}
                noBlur
                opts={{ fixedWidth: true }}
              >
                <div
                  className="flexRow"
                  style={{
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: "90%",
                      position: "absolute",
                      aspectRatio: 1,
                      opacity: 0.3,
                    }}
                  >
                    <FactionIcon factionId={faction.id} size="100%" />
                  </div>
                </div>
                <div
                  className="flexColumn"
                  style={{
                    gap: "4px",
                    alignItems: "stretch",
                    width: "100%",
                  }}
                >
                  {faction.id === "Nekro Virus" ? (
                    <>
                      <Selector
                        buttonStyle={{ fontSize: "14px" }}
                        hoverMenuLabel="Valefar Assimilator"
                        options={availableNekroTechs.filter(
                          (tech) => tech.id !== nekroFactionTechIds[1]
                        )}
                        toggleItem={(techId, add) => {
                          if (!gameId) {
                            return;
                          }
                          if (add) {
                            addTechAsync(gameId, faction.id, techId);
                          } else {
                            removeTechAsync(gameId, faction.id, techId);
                          }
                        }}
                        renderItem={(techId) => {
                          const tech = (techs ?? {})[techId];
                          if (!tech || !gameId) {
                            return null;
                          }
                          return (
                            <div
                              onClick={() =>
                                removeTechAsync(gameId, faction.id, techId)
                              }
                            >
                              <TechRow
                                className={
                                  styles.factionTechRow + " " + styles.selected
                                }
                                tech={tech}
                                opts={{ hideSymbols: true, hideIcon: true }}
                              />
                            </div>
                          );
                        }}
                        selectedItem={nekroFactionTechIds[0]}
                      />
                      <Selector
                        buttonStyle={{ fontSize: "14px" }}
                        hoverMenuLabel="Valefar Assimilator"
                        options={availableNekroTechs.filter(
                          (tech) => tech.id !== nekroFactionTechIds[0]
                        )}
                        toggleItem={(techId, add) => {
                          if (!gameId) {
                            return;
                          }
                          if (add) {
                            addTechAsync(gameId, faction.id, techId);
                          } else {
                            removeTechAsync(gameId, faction.id, techId);
                          }
                        }}
                        renderItem={(techId) => {
                          const tech = (techs ?? {})[techId];
                          if (!tech || !gameId) {
                            return null;
                          }
                          return (
                            <div
                              onClick={() =>
                                removeTechAsync(gameId, faction.id, techId)
                              }
                            >
                              <TechRow
                                className={
                                  styles.factionTechRow + " " + styles.selected
                                }
                                tech={tech}
                                opts={{ hideSymbols: true, hideIcon: true }}
                              />
                            </div>
                          );
                        }}
                        selectedItem={nekroFactionTechIds[1]}
                      />
                    </>
                  ) : (
                    factionTechs.map((tech) => {
                      const factionHasTech = hasTech(faction, tech.id);
                      return (
                        <div
                          key={tech.id}
                          onClick={() => {
                            if (!gameId) {
                              return;
                            }
                            if (factionHasTech) {
                              removeTechAsync(gameId, faction.id, tech.id);
                            } else {
                              addTechAsync(gameId, faction.id, tech.id);
                            }
                          }}
                          style={{ maxWidth: "100%" }}
                        >
                          <TechRow
                            className={
                              styles.factionTechRow +
                              " " +
                              (factionHasTech ? styles.selected : "")
                            }
                            tech={tech}
                            opts={{
                              hideSymbols: true,
                              hideIcon: true,
                            }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </LabeledDiv>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}

function TechUpdateRow({
  tech,
  orderedFactions,
}: {
  tech: Tech;
  orderedFactions: Faction[];
}) {
  const gameId = useContext(GameIdContext);

  const numFactions = orderedFactions.length;

  const isResearched = orderedFactions.reduce((isResearched, faction) => {
    return isResearched || hasTech(faction, tech.id);
  }, false);

  return (
    <React.Fragment>
      <TechRow tech={tech} opts={{ hideSymbols: true, fade: !isResearched }} />
      <div
        className={styles.factionIconRow}
        style={
          {
            "--num-factions": numFactions,
          } as NumFactionsCSS
        }
      >
        {Object.values(orderedFactions).map((faction) => {
          const factionHasTech = hasTech(faction, tech.id);
          if (isTechReplaced(faction.id, tech.id)) {
            return <div key={faction.id}></div>;
          }
          return (
            <div
              key={faction.id}
              className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
              onClick={() => {
                if (!gameId) {
                  return;
                }
                if (factionHasTech) {
                  removeTechAsync(gameId, faction.id, tech.id);
                } else {
                  addTechAsync(gameId, faction.id, tech.id);
                }
              }}
            >
              <div
                className={`
                  ${styles.factionIcon} ${
                  factionHasTech ? styles.selected : ""
                }`}
                style={
                  {
                    "--color": getFactionColor(faction),
                  } as ExtendedCSS
                }
              >
                <FactionIcon factionId={faction.id} size="100%" />
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

function TechSection({
  type,
  openedByDefault = false,
}: {
  type: TechType;
  openedByDefault?: boolean;
}) {
  const factions = useFactions();
  const techs = useTechs();
  const intl = useIntl();

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const typedTechs = Object.values(techs ?? {}).filter(
    (tech) => tech.type === type && !tech.faction
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions);
  orderedFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  return (
    <div
      className={styles.techColumn}
      style={
        {
          "--color": getTechTypeColor(type),
        } as ExtendedCSS
      }
    >
      <div
        className={styles.techTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <TechIcon type={type} size={20} />
        {techTypeString(type, intl)}
        <TechIcon type={type} size={20} />
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {typedTechs.map((tech) => {
            return (
              <TechUpdateRow
                key={tech.id}
                tech={tech}
                orderedFactions={orderedFactions}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UpgradeTechSection({}) {
  const factions = useFactions();
  const techs = useTechs();
  const intl = useIntl();

  const [collapsed, setCollapsed] = useState(true);

  const typedTechs = Object.values(techs ?? {}).filter(
    (tech) => tech.type === "UPGRADE" && !tech.faction
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions);
  orderedFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  return (
    <div className={`${styles.techColumn} ${styles.lastColumn}`}>
      <div
        className="centered largeFont"
        onClick={() => setCollapsed(!collapsed)}
      >
        {techTypeString("UPGRADE", intl)}
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {typedTechs.map((tech) => {
            return (
              <TechUpdateRow
                key={tech.id}
                tech={tech}
                orderedFactions={orderedFactions}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TechPanel({}) {
  return (
    <div className={styles.techGrid}>
      <FactionTechSection openedByDefault />
      <TechSection type="BLUE" />
      <TechSection type="GREEN" />
      <TechSection type="RED" />
      <TechSection type="YELLOW" />
      <UpgradeTechSection />
    </div>
  );
}
