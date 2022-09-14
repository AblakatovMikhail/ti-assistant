import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import { FactionCard } from '/src/FactionCard.js'
import QRCode from "qrcode";

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: gameState, error } = useSWR(gameid ? `/api/game/${gameid}` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);

  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, opts, (err, url) => {
      if (err) {
        throw err;
      }
      setQrCode(url);
    });
  }

  if (error) {
    return (<div>Failed to load game</div>);
  }
  if (!gameState) {
    return (<div>Loading...</div>);
  }

  function selectFaction(index) {
    const playerID = index + 1;
    router.push(`/game/${gameid}/${playerID}`);
  }

  function goToMainPage() {
    router.push(`/game/${gameid}/main.js`);
  }

  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
      dark:"#010599FF",
      light:"#FFBF60FF"
    }
  }




  return (
    <div className="flexColumn" style={{alignItems: "center"}}>
      <h1>Twilight Imperium Assistant</h1>
      <div className="flexRow">
      <h3>Game ID: {gameid}</h3>
      {qrCode ? <img src={qrCode} /> : null}
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "column wrap",
          gap: "10px",
          maxWidth: "750px",
          width: "100%",
        }}
      >
        <div
          onClick={goToMainPage}
          style={{
            border: "3px solid grey",
            borderRadius: "5px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "4px"
          }}
        >
          Main Screen
        </div>
        {gameState.players.map((player, index) => {
          return (
            <FactionCard
              key={index}
              player={player}
              onClick={() => selectFaction(index)}
            />
          );
        })}
      </div>
    </div>
  );
}