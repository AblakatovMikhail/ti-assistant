import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import QRCode from "qrcode";
import useSWR from "swr";
import {
  responsiveNegativePixels,
  responsivePixels,
  validateMapString,
} from "./util/util";
import { fetcher } from "./util/api/util";
import { GameTimer } from "./Timer";
import { ClientOnlyHoverMenu } from "./HoverMenu";
import { LabeledDiv } from "./LabeledDiv";
import {
  computeVPs,
  UpdateObjectives,
  UpdatePlanets,
  UpdateTechs,
} from "./FactionSummary";
import React from "react";
import { AgendaRow } from "./AgendaRow";
import { Agenda, repealAgenda } from "./util/api/agendas";
import {
  continueGame,
  finishGame,
  GameState,
  setSpeaker,
} from "./util/api/state";
import Head from "next/head";
import { getFactionColor, getFactionName } from "./util/factions";
import { Map } from "./util/Map";
import { Options } from "./util/api/options";
import { Faction } from "./util/api/factions";
import { Objective } from "./util/api/objectives";
import { Planet } from "./util/api/planets";
import { SubState } from "./util/api/subState";
import Link from "next/link";
import Image from "next/image";

import Logo from "../public/images/android-chrome-512x512.png";
import { ObjectivePanel } from "./ObjectivePanel";
import { FactionSelectHoverMenu } from "./components/FactionSelect";

export function ResponsiveLogo({ size }: { size: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: responsivePixels(size),
        height: responsivePixels(size),
        borderRadius: "100%",
      }}
    >
      <Image src={Logo} alt="" layout="fill" objectFit="contain" />
    </div>
  );
}

export interface SidebarProps {
  side: string;
}

export function Sidebar({ side, children }: PropsWithChildren<SidebarProps>) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{ letterSpacing: responsivePixels(3) }}>
      {children}
    </div>
  );
}

export function NonGameHeader({
  leftSidebar,
  rightSidebar,
  gameId,
}: {
  leftSidebar?: string;
  rightSidebar?: string;
  gameId?: string;
}) {
  const [qrCode, setQrCode] = useState<string>();
  const [qrCodeSize, setQrCodeSize] = useState(164);

  useEffect(() => {
    setQrCodeSize(
      Math.max(
        164 + (328 - 164) * ((window.innerWidth - 1280) / (2560 - 1280)),
        164
      )
    );
  }, []);

  if (!qrCode && gameId) {
    QRCode.toDataURL(
      `https://ti-assistant.com/game/${gameId}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
        width: qrCodeSize,
        margin: 4,
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        setQrCode(url);
      }
    );
  }
  return (
    <div
      className="flexRow"
      style={{
        top: 0,
        position: "fixed",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        zIndex: 1,
      }}
    >
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <div
        className="flex"
        style={{
          top: 0,
          width: "100vw",
          position: "fixed",
          justifyContent: "space-between",
        }}
      >
        {leftSidebar ? <Sidebar side="left">{leftSidebar}</Sidebar> : null}
        {rightSidebar ? <Sidebar side="right">{rightSidebar}</Sidebar> : null}

        <Link href={"/"}>
          <a
            className="flexRow extraLargeFont nonMobile"
            style={{
              cursor: "pointer",
              position: "fixed",
              justifyContent: "center",
              top: responsivePixels(16),
              left: responsivePixels(96),
            }}
          >
            <ResponsiveLogo size={32} />
            {/* <Image src={Logo} alt="" width="32px" height="32px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>
        <Link href={"/"}>
          <a
            className="flexRow hugeFont mobileOnly"
            style={{
              cursor: "pointer",
              position: "fixed",
              textAlign: "center",
              justifyContent: "center",
              zIndex: 4,
              paddingTop: responsivePixels(12),
              paddingBottom: responsivePixels(12),
              width: "100%",
              left: 0,
              backgroundColor: "#222",
              boxSizing: "border-box",
            }}
          >
            <ResponsiveLogo size={28} />
            {/* <Image src={Logo} alt="" width="28px" height="28px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>

        {gameId ? (
          <Link href={`/game/${gameId}`}>
            <a>
              <ClientOnlyHoverMenu
                label={`Game: ${gameId}`}
                buttonStyle={{
                  position: "fixed",
                  top: responsivePixels(24),
                  right: responsivePixels(120),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    position: "relative",
                    marginTop: responsivePixels(8),
                  }}
                >
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code for joining game" />
                  ) : null}
                </div>
              </ClientOnlyHoverMenu>
            </a>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: options }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const [qrCode, setQrCode] = useState<string>();

  const [qrCodeSize, setQrCodeSize] = useState(164);

  useEffect(() => {
    setQrCodeSize(
      Math.max(
        164 + (328 - 164) * ((window.innerWidth - 1280) / (2560 - 1280)),
        164
      )
    );
  }, []);

  if (!qrCode && gameid) {
    QRCode.toDataURL(
      `https://ti-assistant.com/game/${gameid}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
        width: qrCodeSize,
        margin: 4,
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        setQrCode(url);
      }
    );
  }

  const round = state ? `ROUND ${state.round}` : "LOADING...";

  function endGame() {
    if (!gameid) {
      return;
    }
    finishGame(gameid);
  }

  function backToGame() {
    if (!gameid) {
      return;
    }
    continueGame(gameid);
  }

  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  let mallice;
  if (options && (options["expansions"] ?? []).includes("POK")) {
    mallice = "A";
    if (planets && (planets["Mallice"] ?? {}).owner) {
      mallice = "B";
    }
  }

  const passedLaws = Object.values(agendas ?? {}).filter((agenda) => {
    return agenda.passed && agenda.type === "LAW";
  });
  function removeAgenda(agendaName: string) {
    if (!gameid) {
      return;
    }
    repealAgenda(gameid, (agendas ?? {})[agendaName]);
  }

  let gameFinished = false;
  if (options && factions) {
    Object.values(factions).forEach((faction) => {
      if (
        computeVPs(factions, faction.name, objectives ?? {}) >=
        options["victory-points"]
      ) {
        gameFinished = true;
      }
    });
  }

  return (
    <React.Fragment>
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      {validateMapString((options ?? {})["map-string"] ?? "") && state ? (
        <ClientOnlyHoverMenu
          label="View Map"
          buttonStyle={{
            position: "fixed",
            top: responsivePixels(state.phase === "SETUP" ? 64 : 104),
            left: responsivePixels(96),
          }}
        >
          <div
            className="flexRow"
            style={{ zIndex: 10000, width: "81vw", height: "78vh" }}
          >
            <div
              style={{
                marginTop: responsiveNegativePixels(-40),
                width: "90vh",
                height: "90vh",
              }}
            >
              <Map
                factions={mapOrderedFactions}
                mapString={options ? options["map-string"] ?? "" : ""}
                mapStyle={options ? options["map-style"] ?? "" : ""}
                mallice={mallice}
              />
            </div>
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {state ? (
        state.phase === "SETUP" ? (
          <div
            className="flexRow nonMobile"
            style={{
              position: "fixed",
              top: responsivePixels(16),
              right: responsivePixels(96),
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div style={{ marginTop: responsivePixels(16) }}>
              Game ID: {gameid}
            </div>
            {qrCode ? (
              <img src={qrCode} alt="QR Code for joining game" />
            ) : null}
          </div>
        ) : (
          <Link href={`/game/${gameid}`}>
            <a>
              <ClientOnlyHoverMenu
                label={`Game: ${gameid}`}
                buttonStyle={{
                  position: "fixed",
                  top: responsivePixels(64),
                  left: responsivePixels(96),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    position: "relative",
                    zIndex: 10000,
                    marginTop: responsivePixels(8),
                  }}
                >
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code for joining game" />
                  ) : null}
                </div>
              </ClientOnlyHoverMenu>
            </a>
          </Link>
        )
      ) : null}
      {gameFinished || state?.phase === "END" ? (
        <div
          className="flexRow extraLargeFont"
          style={{
            position: "fixed",
            top: responsivePixels(16),
            left: responsivePixels(490),
          }}
        >
          {state?.phase === "END" ? (
            <button
              style={{ fontSize: responsivePixels(24) }}
              onClick={backToGame}
            >
              Back to Game
            </button>
          ) : (
            <button
              style={{ fontFamily: "Slider", fontSize: responsivePixels(32) }}
              onClick={endGame}
            >
              End Game
            </button>
          )}
        </div>
      ) : null}
      {passedLaws.length > 0 ? (
        <ClientOnlyHoverMenu
          label="Laws in Effect"
          buttonStyle={{
            position: "fixed",
            top: responsivePixels(16),
            right: responsivePixels(440),
          }}
        >
          <div
            className="flexColumn"
            style={{ alignItems: "flex-start", padding: responsivePixels(8) }}
          >
            {passedLaws.map((agenda) => (
              <AgendaRow
                key={agenda.name}
                agenda={agenda}
                removeAgenda={removeAgenda}
              />
            ))}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      <div
        className="flex"
        style={{
          top: 0,
          width: "100vw",
          position: "fixed",
          justifyContent: "space-between",
        }}
      >
        <Sidebar side="left">
          {!state
            ? "LOADING..."
            : state.phase === "END"
            ? "END OF GAME"
            : `${state.phase} PHASE`}
        </Sidebar>
        <Sidebar side="right">{round}</Sidebar>
        <Link href={"/"}>
          <a
            className="extraLargeFont flexRow nonMobile"
            style={{
              cursor: "pointer",
              position: "fixed",
              justifyContent: "center",
              backgroundColor: "#222",
              top: responsivePixels(16),
              left: responsivePixels(96),
            }}
          >
            <ResponsiveLogo size={32} />
            {/* <Image src={Logo} alt="" width="32px" height="32px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>
        {state && state.phase !== "SETUP" ? (
          <div
            className="flexRow nonMobile"
            style={{
              position: "fixed",
              top: responsivePixels(64),
              left: responsivePixels(256),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GameTimer frozen={state.phase === "END"} />
          </div>
        ) : null}
        <Link href={"/"}>
          <a
            className="flexRow hugeFont mobileOnly"
            style={{
              cursor: "pointer",
              position: "fixed",
              backgroundColor: "#222",
              textAlign: "center",
              zIndex: 4,
              justifyContent: "center",
              paddingTop: responsivePixels(12),
              paddingBottom: responsivePixels(12),
              left: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <ResponsiveLogo size={28} />
            {/* <Image src={Logo} alt="" width="28px" height="28px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>
      </div>
    </React.Fragment>
  );
}

export function Footer({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  function shouldBlockSpeakerUpdates() {
    if (state?.phase === "END") {
      return true;
    }
    if (state?.phase !== "STRATEGY") {
      return false;
    }

    return (subState?.strategyCards ?? []).length !== 0;
  }

  const orderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.order - b.order
  );

  const speakerButtonPosition =
    state?.phase === "STRATEGY" || state?.phase === "STATUS"
      ? "top"
      : orderedFactions.length > 7
      ? "bottom"
      : "top";

  return (
    <div
      className="flex"
      style={{
        bottom: 0,
        width: "100vw",
        position: "fixed",
        justifyContent: "space-between",
      }}
    >
      {state && state.phase !== "SETUP" ? (
        <div
          style={{
            position: "fixed",
            bottom: responsivePixels(16),
            left: responsivePixels(96),
          }}
        >
          <LabeledDiv label={state.phase === "END" ? "View" : "Update"}>
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              {speakerButtonPosition === "top" &&
              !shouldBlockSpeakerUpdates() ? (
                <div className="flexRow">
                  Speaker:
                  <FactionSelectHoverMenu
                    allowNone={false}
                    borderColor={
                      state?.speaker
                        ? getFactionColor((factions ?? {})[state.speaker])
                        : undefined
                    }
                    selectedFaction={state?.speaker}
                    options={orderedFactions
                      .filter((faction) => faction.name !== state?.speaker)
                      .map((faction) => faction.name)}
                    onSelect={(factionName, _) => {
                      if (!gameid || !factionName) {
                        return;
                      }
                      setSpeaker(gameid, factionName);
                    }}
                  />
                </div>
              ) : null}
              <div
                className="flexRow"
                style={{ width: "100%", alignItems: "center" }}
              >
                <ClientOnlyHoverMenu label="Techs">
                  <div
                    className="flexColumn"
                    style={{ height: "90vh", width: "82vw" }}
                  >
                    <UpdateTechs />
                  </div>
                </ClientOnlyHoverMenu>
                <ClientOnlyHoverMenu label="Objectives" shift={{ left: 78 }}>
                  <div
                    className="flexColumn"
                    style={{ height: "90vh", width: "82vw" }}
                  >
                    <ObjectivePanel />
                  </div>
                </ClientOnlyHoverMenu>
                <ClientOnlyHoverMenu label="Planets" shift={{ left: 195 }}>
                  <div
                    className="flexColumn largeFont"
                    style={{ height: "90vh", width: "82vw" }}
                  >
                    <UpdatePlanets />
                  </div>
                </ClientOnlyHoverMenu>
                {speakerButtonPosition === "bottom" &&
                !shouldBlockSpeakerUpdates() ? (
                  <div className="flexRow">
                    Speaker:
                    <FactionSelectHoverMenu
                      allowNone={false}
                      borderColor={
                        state?.speaker
                          ? getFactionColor((factions ?? {})[state.speaker])
                          : undefined
                      }
                      selectedFaction={state?.speaker}
                      options={orderedFactions
                        .filter((faction) => faction.name !== state?.speaker)
                        .map((faction) => faction.name)}
                      onSelect={(factionName, _) => {
                        if (!gameid || !factionName) {
                          return;
                        }
                        setSpeaker(gameid, factionName);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </LabeledDiv>
        </div>
      ) : null}
    </div>
  );
}
