import { useRouter } from "next/router";
import useSWR from "swr";
import React from "react";
import { fetcher } from "../util/api/util";
import SummaryColumn from "./SummaryColumn";
import { responsivePixels } from "../util/util";
import { GameState } from "../util/api/state";

export default function ResultsPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );

  return (
    <div
      className="flexRow"
      style={{
        gap: responsivePixels(20),
        height: "100vh",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        className="flexColumn"
        style={{ height: "100vh", flexShrink: 0, width: responsivePixels(280) }}
      >
        <SummaryColumn
          order="VICTORY_POINTS"
          subOrder={
            state?.finalPhase === "ACTION" || state?.finalPhase === "STATUS"
              ? "INITIATIVE"
              : "SPEAKER"
          }
        />
      </div>
    </div>
  );
}