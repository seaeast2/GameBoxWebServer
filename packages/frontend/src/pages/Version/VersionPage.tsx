import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Version.module.css";

const mockVersions = [
  {
    id: "v5",
    episode: 5,
    content: "검은 기사와 첫 조우...",
    createdAt: "2026-02-24 15:30",
    size: "2.3KB",
  },
  {
    id: "v4",
    episode: 5,
    content: "검은 기사가 나타나다...",
    createdAt: "2026-02-23 10:00",
    size: "2.1KB",
  },
  {
    id: "v3",
    episode: 4,
    content: "왕국에 도착하여...",
    createdAt: "2026-02-22 14:20",
    size: "1.8KB",
  },
  {
    id: "v2",
    episode: 3,
    content: "동료와 함께 여행을...",
    createdAt: "2026-02-21 09:15",
    size: "1.5KB",
  },
  {
    id: "v1",
    episode: 2,
    content: "마을에 몬스터가...",
    createdAt: "2026-02-20 11:00",
    size: "1.2KB",
  },
];

export default function VersionPage() {
  const { id } = useParams();
  const [selected, setSelected] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTarget, setCompareTarget] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>버전 관리</h1>
        <div className={styles.headerActions}>
          <button
            className={`${styles.compareToggle} ${compareMode ? styles.compareActive : ""}`}
            onClick={() => {
              setCompareMode(!compareMode);
              setCompareTarget(null);
            }}
          >
            {compareMode ? "비교 모드 끄기" : "🔍 비교 모드"}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.versionList}>
          <h3>변경 이력</h3>
          {mockVersions.map((v) => (
            <div
              key={v.id}
              className={`${styles.versionItem} ${selected === v.id ? styles.versionActive : ""} ${compareTarget === v.id ? styles.versionCompare : ""}`}
              onClick={() => {
                if (compareMode && selected) {
                  setCompareTarget(v.id);
                } else {
                  setSelected(v.id);
                }
              }}
            >
              <div className={styles.versionDot} />
              <div className={styles.versionInfo}>
                <div className={styles.versionId}>{v.id}</div>
                <div className={styles.versionMeta}>
                  {v.episode}화 · {v.createdAt}
                </div>
                <div className={styles.versionSize}>{v.size}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.versionDetail}>
          {!selected ? (
            <div className={styles.emptyDetail}>
              <p>📂</p>
              <span>버전을 선택하면 내용이 표시됩니다</span>
            </div>
          ) : compareMode && compareTarget ? (
            <div className={styles.compareView}>
              <div className={styles.comparePane}>
                <h3>이전: {compareTarget}</h3>
                <div className={styles.contentArea}>
                  {mockVersions.find((v) => v.id === compareTarget)?.content}
                </div>
              </div>
              <div className={styles.compareDivider} />
              <div className={styles.comparePane}>
                <h3>현재: {selected}</h3>
                <div className={styles.contentArea}>
                  {mockVersions.find((v) => v.id === selected)?.content}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.detailHeader}>
                <h2>{selected}</h2>
                <button className={styles.restoreBtn}>이 버전으로 복원</button>
              </div>
              <div className={styles.detailMeta}>
                {mockVersions.find((v) => v.id === selected)?.createdAt} ·{" "}
                {mockVersions.find((v) => v.id === selected)?.episode}화
              </div>
              <div className={styles.contentArea}>
                {mockVersions.find((v) => v.id === selected)?.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
