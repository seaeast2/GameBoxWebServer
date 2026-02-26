import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { timelineService, Timeline } from "../../services/timelineService";
import {
  foreshadowService,
  Foreshadow,
} from "../../services/foreshadowService";
import styles from "./Timeline.module.css";

export default function TimelinePage() {
  const { id: novelId } = useParams();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [foreshadows, setForeshadows] = useState<Record<number, Foreshadow[]>>(
    {},
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ episode: 1, summary: "" });

  const loadTimelines = async () => {
    if (!novelId) return;
    try {
      const res = await timelineService.list(novelId);
      setTimelines(res.data);
      // Load foreshadows for each timeline
      const fsMap: Record<number, Foreshadow[]> = {};
      await Promise.all(
        res.data.map(async (tl: Timeline) => {
          try {
            const fsRes = await foreshadowService.list(String(tl.ID));
            fsMap[tl.ID] = fsRes.data;
          } catch {
            fsMap[tl.ID] = [];
          }
        }),
      );
      setForeshadows(fsMap);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadTimelines();
  }, [novelId]);

  const selectedTl = timelines.find((t) => t.ID === selected);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novelId) return;
    try {
      await timelineService.create(novelId, {
        episode: form.episode,
        summary: form.summary,
      });
      setForm({ episode: form.episode + 1, summary: "" });
      setShowForm(false);
      loadTimelines();
    } catch {}
  };

  const handleDelete = async (tlId: number) => {
    try {
      await timelineService.delete(String(tlId));
      if (selected === tlId) setSelected(null);
      loadTimelines();
    } catch {}
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>타임라인 관리</h1>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          + 타임라인 추가
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            marginBottom: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3>새 타임라인 추가</h3>
          <form
            onSubmit={handleCreate}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <input
              type="number"
              min={1}
              value={form.episode}
              onChange={(e) =>
                setForm({ ...form, episode: Number(e.target.value) })
              }
              placeholder="에피소드 번호"
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <textarea
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="줄거리 요약"
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <button
              type="submit"
              style={{
                padding: 10,
                background: "#5c6bc0",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              추가
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center", padding: 40, color: "#888" }}>
          로딩 중...
        </p>
      ) : timelines.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40, color: "#888" }}>
          등록된 타임라인이 없습니다
        </p>
      ) : (
        <div className={styles.timelineView}>
          <div className={styles.line} />
          {timelines.map((tl) => (
            <div
              key={tl.ID}
              className={`${styles.tlItem} ${selected === tl.ID ? styles.tlItemActive : ""}`}
              onClick={() => setSelected(tl.ID)}
            >
              <div className={styles.tlDot} />
              <div className={styles.tlCard}>
                <div className={styles.tlEpisode}>{tl.EPISODE}화</div>
                <p className={styles.tlSummary}>{tl.SUMMARY}</p>
                <div className={styles.tlMeta}>
                  {(foreshadows[tl.ID]?.length || 0) > 0 && (
                    <span>🔮 복선 {foreshadows[tl.ID].length}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTl && (
        <div className={styles.detail}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>{selectedTl.EPISODE}화 상세</h2>
            <button
              onClick={() => handleDelete(selectedTl.ID)}
              style={{
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              삭제
            </button>
          </div>
          <p className={styles.detailSummary}>{selectedTl.SUMMARY}</p>

          {(foreshadows[selectedTl.ID]?.length || 0) > 0 && (
            <div className={styles.detailSection}>
              <h3>🔮 복선 마커</h3>
              {foreshadows[selectedTl.ID].map((f) => (
                <div key={f.ID} className={styles.foreshadowTag}>
                  {f.DESCRIPTION} {f.RESOLVED === "Y" ? "(회수됨)" : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
