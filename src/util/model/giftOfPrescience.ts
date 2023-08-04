import { buildStrategyCards } from "../../data/GameData";
import { StrategyCard } from "../api/cards";
import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

const GIFT_OF_PRESCIENCE_FACTION = "Naalu Collective" as const;

export interface GiftOfPrescienceEvent {
  faction: string;
}

export interface GiftOfPrescienceData {
  action: "GIFT_OF_PRESCIENCE";
  event: GiftOfPrescienceEvent;
}

export class GiftOfPrescienceHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: GiftOfPrescienceData
  ) {}

  validate(): boolean {
    const strategyCards = buildStrategyCards(this.gameData);

    for (const card of Object.values(strategyCards)) {
      if (card.faction === this.data.event.faction && card.order === 0) {
        return false;
      }
    }
    return true;
  }

  getUpdates(): Record<string, any> {
    // Reset order for all other cards
    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };
    for (const cardId of Object.keys(this.gameData.strategycards ?? {})) {
      updates[`strategycards.${cardId}.order`] = "DELETE";
    }

    // Find the first card for this faction and update it.
    const strategyCards = buildStrategyCards(this.gameData);
    let minCard: StrategyCard | undefined;
    for (const card of Object.values(strategyCards)) {
      if (
        card.faction === this.data.event.faction &&
        (!minCard || minCard.order > card.order)
      ) {
        minCard = card;
      }
    }

    if (!minCard) {
      return {};
    }

    updates[`strategycards.${minCard.name}.order`] = 0;

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "GIFT_OF_PRESCIENCE" &&
      this.data.event.faction === GIFT_OF_PRESCIENCE_FACTION
    ) {
      return "DELETE";
    }
    // Should never be allowed.
    return "IGNORE";
  }
}