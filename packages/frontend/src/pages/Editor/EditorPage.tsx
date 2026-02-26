import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { episodeService } from "../../services/episodeService";
import { characterService, Character } from "../../services/characterService";
import { worldService, World } from "../../services/worldService";
import { mapService, MapItem } from "../../services/mapService";
import { versionService, Version } from "../../services/versionService";
import { timelineService, Timeline } from "../../services/timelineService";
import styles from "./Editor.module.css";

export default function EditorPage() {
  const { id: novelId } = useParams();
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"character" | "world" | "map">(
    "character",
  );
  const [rightTab, setRightTab] = useState<"ai" | "foreshadow" | "version">(
    "ai",
  );
  const [episode, setEpisode] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [episodeCount, setEpisodeCount] = useState(12);
  const [hasExisting, setHasExisting] = useState(false);

  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

  const loadSidebarData = useCallback(async () => {
    if (!novelId) return;
    const [charRes, worldRes, mapRes, tlRes] = await Promise.all([
      characterService.list(novelId).catch(() => ({ data: [] })),
      worldService.list(novelId).catch(() => ({ data: [] })),
      mapService.list(novelId).catch(() => ({ data: [] })),
      timelineService.list(novelId).catch(() => ({ data: [] })),
    ]);
    setCharacters(charRes.data);
    setWorlds(worldRes.data);
    setMaps(mapRes.data);
    setTimelines(tlRes.data);
    if (tlRes.data.length > 0) {
      const maxEp = Math.max(...tlRes.data.map((t: Timeline) => t.EPISODE));
      setEpisodeCount(Math.max(maxEp + 1, 12));
    }
  }, [novelId]);

  const loadEpisodeContent = useCallback(async () => {
    if (!novelId) return;
    try {
      const res = await episodeService.getText(novelId, episode);
      setContent(res.data.CONTENT || "");
      setHasExisting(true);
    } catch {
      setContent("");
      setHasExisting(false);
    }
  }, [novelId, episode]);

  const loadVersions = useCallback(async () => {
    if (!novelId) return;
    try {
      const res = await versionService.list(novelId);
      setVersions(res.data);
    } catch {
      setVersions([]);
    }
  }, [novelId]);

  useEffect(() => {
    loadSidebarData();
  }, [loadSidebarData]);
  useEffect(() => {
    loadEpisodeContent();
  }, [loadEpisodeContent]);
  useEffect(() => {
    if (rightTab === "version") loadVersions();
  }, [rightTab, loadVersions]);

  const handleSave = async () => {
    if (!novelId) return;
    setSaving(true);
    setSaveMsg("");
    try {
      if (hasExisting) {
        await episodeService.updateText(novelId, episode, content);
      } else {
        await episodeService.saveText(novelId, episode, content);
        setHasExisting(true);
      }
      setSaveMsg("저장됨");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch {
      setSaveMsg("저장 실패");
    }
    setSaving(false);
  };

  const getCharStats = (char: Character) => {
    if (!char.STATS) return {};
    return typeof char.STATS === "string" ? JSON.parse(char.STATS) : char.STATS;
  };

  return (
    <div className={styles.editorLayout}>
      {/* 좌측 사이드바: 캐릭터/세계관/지도 */}
      <aside className={styles.leftPanel}>
        <div className={styles.panelTabs}>
          <button
            className={`${styles.panelTab} ${activeTab === "character" ? styles.active : ""}`}
            onClick={() => setActiveTab("character")}
          >
            👥 캐릭터
          </button>
          <button
            className={`${styles.panelTab} ${activeTab === "world" ? styles.active : ""}`}
            onClick={() => setActiveTab("world")}
          >
            🌍 세계관
          </button>
          <button
            className={`${styles.panelTab} ${activeTab === "map" ? styles.active : ""}`}
            onClick={() => setActiveTab("map")}
          >
            🗺️ 지도
          </button>
        </div>
        <div className={styles.panelContent}>
          {activeTab === "character" && (
            <div>
              {characters.length === 0 ? (
                <p style={{ padding: 12, color: "#888", fontSize: "0.9rem" }}>
                  등록된 캐릭터가 없습니다
                </p>
              ) : (
                characters.map((c) => (
                  <div key={c.ID} className={styles.listItem}>
                    <strong>{c.NAME}</strong>
                    <span>
                      Lv.{c.LEVEL || 1} · {getCharStats(c).class || "미정"}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "world" && (
            <div>
              {worlds.length === 0 ? (
                <p style={{ padding: 12, color: "#888", fontSize: "0.9rem" }}>
                  등록된 세계관이 없습니다
                </p>
              ) : (
                worlds.map((w) => (
                  <div key={w.ID} className={styles.listItem}>
                    <strong>{w.NAME}</strong>
                    <span>{w.DESCRIPTION?.slice(0, 20) || ""}</span>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "map" && (
            <div>
              {maps.length === 0 ? (
                <div className={styles.mapPlaceholder}>
                  <p>🗺️ 세계 지도</p>
                  <span>등록된 지도가 없습니다</span>
                </div>
              ) : (
                maps.map((m) => (
                  <div key={m.ID} className={styles.listItem}>
                    <strong>
                      {(typeof m.METADATA === "object"
                        ? m.METADATA?.name
                        : "") || `지도 #${m.ID}`}
                    </strong>
                    {m.IMAGE_URL && (
                      <img
                        src={m.IMAGE_URL}
                        alt=""
                        style={{
                          width: "100%",
                          maxHeight: 100,
                          objectFit: "cover",
                          borderRadius: 4,
                          marginTop: 4,
                        }}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </aside>

      {/* 중앙: 텍스트 편집기 */}
      <main className={styles.editorMain}>
        <div className={styles.editorToolbar}>
          <select
            className={styles.episodeSelect}
            value={episode}
            onChange={(e) => setEpisode(Number(e.target.value))}
          >
            {episodes.map((ep) => (
              <option key={ep} value={ep}>
                {ep}화
              </option>
            ))}
          </select>
          <div className={styles.toolbarBtns}>
            <button className={styles.toolBtn} title="굵게">
              <strong>B</strong>
            </button>
            <button className={styles.toolBtn} title="기울임">
              <em>I</em>
            </button>
            <button className={styles.toolBtn} title="밑줄">
              <u>U</u>
            </button>
            <span className={styles.toolDivider} />
            <button className={styles.toolBtn} title="복선 마커 삽입">
              🔮
            </button>
            <button className={styles.toolBtn} title="AI 삽입">
              🤖
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {saveMsg && (
              <span
                style={{
                  fontSize: "0.85rem",
                  color: saveMsg === "저장됨" ? "#27ae60" : "#e74c3c",
                }}
              >
                {saveMsg}
              </span>
            )}
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
        <textarea
          className={styles.editorArea}
          placeholder="여기에 글을 작성하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </main>

      {/* 우측 사이드바: AI/복선/버전 */}
      <aside className={styles.rightPanel}>
        <div className={styles.panelTabs}>
          <button
            className={`${styles.panelTab} ${rightTab === "ai" ? styles.active : ""}`}
            onClick={() => setRightTab("ai")}
          >
            🤖 AI
          </button>
          <button
            className={`${styles.panelTab} ${rightTab === "foreshadow" ? styles.active : ""}`}
            onClick={() => setRightTab("foreshadow")}
          >
            🔮 복선
          </button>
          <button
            className={`${styles.panelTab} ${rightTab === "version" ? styles.active : ""}`}
            onClick={() => setRightTab("version")}
          >
            📂 버전
          </button>
        </div>
        <div className={styles.panelContent}>
          {rightTab === "ai" && (
            <div className={styles.aiPanel}>
              <textarea
                className={styles.aiInput}
                placeholder="줄거리를 입력하세요..."
                rows={4}
              />
              <button className={styles.aiGenerateBtn}>AI 생성</button>
              <div className={styles.aiResult}>
                <p className={styles.placeholder}>
                  AI 생성 결과가 여기에 표시됩니다
                </p>
              </div>
            </div>
          )}
          {rightTab === "foreshadow" && (
            <div>
              <p style={{ padding: 8, color: "#888", fontSize: "0.85rem" }}>
                타임라인에서 복선을 관리합니다
              </p>
            </div>
          )}
          {rightTab === "version" && (
            <div>
              {versions.length === 0 ? (
                <p style={{ padding: 12, color: "#888", fontSize: "0.9rem" }}>
                  저장된 버전이 없습니다
                </p>
              ) : (
                versions.map((v) => (
                  <div key={v.ID} className={styles.versionItem}>
                    <strong>v{v.ID}</strong>
                    <span>
                      {v.CREATED_AT
                        ? new Date(v.CREATED_AT).toLocaleString()
                        : ""}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </aside>

      {/* 하단: 타임라인 뷰 */}
      <div className={styles.bottomPanel}>
        <h3 className={styles.bottomTitle}>⏳ 타임라인</h3>
        <div className={styles.timeline}>
          {timelines.length > 0
            ? timelines.map((tl) => (
                <div
                  key={tl.ID}
                  className={`${styles.timelineItem} ${tl.EPISODE === episode ? styles.timelineActive : ""}`}
                  onClick={() => setEpisode(tl.EPISODE)}
                >
                  <div className={styles.timelineDot} />
                  <span>{tl.EPISODE}화</span>
                </div>
              ))
            : episodes.map((ep) => (
                <div
                  key={ep}
                  className={`${styles.timelineItem} ${ep === episode ? styles.timelineActive : ""}`}
                  onClick={() => setEpisode(ep)}
                >
                  <div className={styles.timelineDot} />
                  <span>{ep}화</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
