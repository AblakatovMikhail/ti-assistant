import React from "react";
import Link from "next/link";
import { responsivePixels } from "../src/util/util";
import { LabeledDiv, LabeledLine } from "../src/LabeledDiv";
import { NonGameHeader } from "../src/Header";

export default function Supporters() {
  return (
    <div className="flexColumn" style={{ gap: "16px" }}>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="SUPPORTERS" />
      <div
        className="flexColumn"
        style={{
          maxWidth: responsivePixels(800),
          height: "100dvh",
          width: "100%",
        }}
      >
        <LabeledDiv
          label="Supporters"
          rightLabel={
            <a href={`https://patreon.com/TIAssistant`}>
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                Become one here!
              </div>
            </a>
          }
        >
          <div
            className="flexColumn largeFont"
            style={{
              gap: 0,
              paddingBottom: responsivePixels(4),
              width: "100%",
            }}
          >
            <div className="flexRow centered" style={{ width: "100%" }}>
              Signoreliro
            </div>
          </div>
        </LabeledDiv>

        <Link href={`/`}>
          <a style={{ marginTop: responsivePixels(12) }}>
            <LabeledDiv>
              <div
                className="flexColumn mediumFont"
                style={{
                  minWidth: responsivePixels(190),
                }}
              >
                Back
              </div>
            </LabeledDiv>
          </a>
        </Link>
      </div>
    </div>
  );
}