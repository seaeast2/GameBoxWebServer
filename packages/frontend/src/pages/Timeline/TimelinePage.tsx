import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Timeline.module.css";

const mockTimelines = [
  {
    id: "1",
    episode: 1,
    summary: "주인공이 마을에서 평범하게 생활한다.",
    characters: ["주인공"],
    foreshadows: ["목걸이의 비밀"],
    location: "시작 마을",
  },
  {
    id: "2",
    episode: 2,
    summary: "마을에 몬스터가 나타나다. 주인공이 검을 잡는다.",
    characters: ["주인공", "동료1"],
    foreshadows: [],
    location: "시작 마을 외곽",
  },
  {
    id: "3",
    episode: 3,
    summary: "동료와 함께 여행을 떠난다.",
    characters: ["주인공", "동료1"],
    foreshadows: ["장로의 예언"],
    location: "왕국 도로",
  },
  {
    id: "4",
    episode: 4,
    summary: "왕국에 도착하여 기사단에 대해 알게 된다.",
    characters: ["주인공", "동료1", "히로인"],
    foreshadows: [],
    location: "아르카디아 왕국",
  },
  {
    id: "5",
    episode: 5,
    summary: "검은 기사와 첫 조우. 팀이 패배한다.",
    characters: ["주인공", "동료1", "히로인"],
    foreshadows: ["검은 기사의 정체"],
    location: "왕국 외곽 던전",
  },
];

export default function TimelinePage() {
  const { id } = useParams();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedTl = mockTimelines.find((t) => t.id === selected);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>타임라인 관리</h1>
        <button className={styles.addBtn}>+ 타임라인 추가</button>
      </div>

      <div className={styles.timelineView}>
        <div className={styles.line} />
        {mockTimelines.map((tl) => (
          <div
            key={tl.id}
            className={`${styles.tlItem} ${selected === tl.id ? styles.tlItemActive : ""}`}
            onClick={() => setSelected(tl.id)}
          >
            <div className={styles.tlDot} />
            <div className={styles.tlCard}>
              <div className={styles.tlEpisode}>{tl.episode}화</div>
              <p className={styles.tlSummary}>{tl.summary}</p>
              <div className={styles.tlMeta}>
                <span>📍 {tl.location}</span>
                <span>👥 {tl.characters.length}명</span>
                {tl.foreshadows.length > 0 && (
                  <span>🔮 복선 {tl.foreshadows.length}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTl && (
        <div className={styles.detail}>
          <h2>{selectedTl.episode}화 상세</h2>
          <p className={styles.detailSummary}>{selectedTl.summary}</p>

          <div className={styles.detailSection}>
            <h3>📍 장소</h3>
            <p>{selectedTl.location}</p>
          </div>

          <div className={styles.detailSection}>
            <h3>👥 등장 캐릭터</h3>
            <div className={styles.charTags}>
              {selectedTl.characters.map((c) => (
                <span key={c} className={styles.charTag}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {selectedTl.foreshadows.length > 0 && (
            <div className={styles.detailSection}>
              <h3>🔮 복선 마커</h3>
              {selectedTl.foreshadows.map((f) => (
                <div key={f} className={styles.foreshadowTag}>
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
