import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { versionService, Version } from "../../services/versionService";
import styles from "./Version.module.css";

export default function VersionPage() {
  const { id: novelId } = useParams();
  const [versions, setVersions] = useState<Version[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Version | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTarget, setCompareTarget] = useState<number | null>(null);
  const [compareDetail, setCompareDetail] = useState<Version | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadVersions = async () => {
    if (!novelId) return;
    try {
      const res = await versionService.list(novelId);
      setVersions(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadVersions();
  }, [novelId]);

  const handleSelect = async (id: number) => {
    if (compareMode && selected) {
      setCompareTarget(id);
      try {
        const res = await versionService.get(String(id));
        setCompareDetail(res.data);
      } catch {}
    } else {
      setSelected(id);
      try {
        const res = await versionService.get(String(id));
        setSelectedDetail(res.data);
      } catch {}
    }
  };

  const handleRestore = async () => {
    if (!selected) return;
    try {
      await versionService.restore(String(selected));
      setMessage("버전이 복원되었습니다.");
      loadVersions();
    } catch {
      setMessage("복원에 실패했습니다.");
    }
  };

  const getLabel = (v: Version) => `v${v.ID}`;

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
              setCompareDetail(null);
            }}
          >
            {compareMode ? "비교 모드 끄기" : "🔍 비교 모드"}
          </button>
        </div>
      </div>

      {message && (
        <p
          style={{
            textAlign: "center",
            color: message.includes("실패") ? "#e74c3c" : "#27ae60",
            margin: "0 0 16px",
          }}
        >
          {message}
        </p>
      )}

      <div className={styles.layout}>
        <div className={styles.versionList}>
          <h3>변경 이력</h3>
          {loading ? (
            <p style={{ padding: 16, color: "#888" }}>로딩 중...</p>
          ) : versions.length === 0 ? (
            <p style={{ padding: 16, color: "#888" }}>버전이 없습니다</p>
          ) : (
            versions.map((v) => (
              <div
                key={v.ID}
                className={`${styles.versionItem} ${selected === v.ID ? styles.versionActive : ""} ${compareTarget === v.ID ? styles.versionCompare : ""}`}
                onClick={() => handleSelect(v.ID)}
              >
                <div className={styles.versionDot} />
                <div className={styles.versionInfo}>
                  <div className={styles.versionId}>{getLabel(v)}</div>
                  <div className={styles.versionMeta}>
                    {v.EPISODE}화 ·{" "}
                    {v.CREATED_AT
                      ? new Date(v.CREATED_AT).toLocaleString()
                      : ""}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.versionDetail}>
          {!selected ? (
            <div className={styles.emptyDetail}>
              <p>📂</p>
              <span>버전을 선택하면 내용이 표시됩니다</span>
            </div>
          ) : compareMode && compareTarget && compareDetail ? (
            <div className={styles.compareView}>
              <div className={styles.comparePane}>
                <h3>이전: v{compareTarget}</h3>
                <div className={styles.contentArea}>
                  {compareDetail.CONTENT}
                </div>
              </div>
              <div className={styles.compareDivider} />
              <div className={styles.comparePane}>
                <h3>현재: v{selected}</h3>
                <div className={styles.contentArea}>
                  {selectedDetail?.CONTENT}
                </div>
              </div>
            </div>
          ) : selectedDetail ? (
            <div>
              <div className={styles.detailHeader}>
                <h2>{getLabel(selectedDetail)}</h2>
                <button className={styles.restoreBtn} onClick={handleRestore}>
                  이 버전으로 복원
                </button>
              </div>
              <div className={styles.detailMeta}>
                {selectedDetail.CREATED_AT
                  ? new Date(selectedDetail.CREATED_AT).toLocaleString()
                  : ""}{" "}
                · {selectedDetail.EPISODE}화
              </div>
              <div className={styles.contentArea}>{selectedDetail.CONTENT}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
