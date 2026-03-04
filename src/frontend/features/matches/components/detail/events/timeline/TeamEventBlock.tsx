// src/frontend/features/matches/components/detail/events/timeline/TeamEventBlock.tsx
import { useTranslations } from "next-intl";

import type { EventStyle } from "@/features/matches/types/EventStyle";
import type { MatchEvent } from "@/features/matches/types/MatchEvent";

interface TeamEventBlockProps {
  align: "left" | "right";
  style: EventStyle;
  event: MatchEvent & { homeScore: number; awayScore: number; teamId?: number };
  router: any;
  makeDescriptionClickable: (
    description: string,
    eventPlayers?: MatchEvent["players"],
  ) => string;
  handleDescriptionClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showKeyHandler?: boolean;
}

export const TeamEventBlock: React.FC<TeamEventBlockProps> = ({
  align,
  style,
  event,
  router,
  makeDescriptionClickable,
  handleDescriptionClick,
  showKeyHandler = false,
}) => {
  const t = useTranslations("common");
  return (
    <div
      className={`flex items-center gap-3 ${
        align === "right" ? "justify-end pr-4" : "pl-4"
      }`}
    >
      <div
        className={`${
          align === "right" ? "text-right flex-1" : "text-left flex-1"
        }`}
      >
        <div
          className={`flex items-center ${
            align === "right" ? "justify-end" : ""
          } gap-2`}
        >
          {align === "right" ? (
            <>
              <span className={`font-semibold text-sm ${style.color}`}>
                {style.labelKey ? t(style.labelKey) : event.eventType}
              </span>
              <span className="text-2xl">{style.icon}</span>
            </>
          ) : (
            <>
              <span className="text-2xl">{style.icon}</span>
              <span className={`font-semibold text-sm ${style.color}`}>
                {style.labelKey ? t(style.labelKey) : event.eventType}
              </span>
            </>
          )}
        </div>
        {event.description && (
          <button
            type="button"
            className="text-xs text-gray-600 mt-0.5 text-left w-full"
            dangerouslySetInnerHTML={{
              __html: makeDescriptionClickable(
                event.description,
                event.players,
              ),
            }}
            onClick={handleDescriptionClick}
            onKeyDown={
              showKeyHandler
                ? (e) => {
                    const target = e.target as HTMLElement;
                    if (
                      target.classList.contains("match-player-link") &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      const playerId = target.dataset.playerId;
                      if (playerId) {
                        router.push(`/player/${playerId}`);
                      }
                    }
                  }
                : undefined
            }
            tabIndex={0}
          />
        )}
        <span className="text-xs text-gray-400 font-mono">
          {new Date(event.timestamp).toLocaleTimeString("fr-FR", {
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default TeamEventBlock;
