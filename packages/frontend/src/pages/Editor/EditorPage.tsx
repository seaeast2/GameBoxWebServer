import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Editor.module.css";

export default function EditorPage() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"character" | "world" | "map">(
    "character",
  );
  const [rightTab, setRightTab] = useState<"ai" | "foreshadow" | "version">(
    "ai",
  );
  const [episode, setEpisode] = useState(1);

  const episodes = Array.from({ length: 12 }, (_, i) => i + 1);

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
              <div className={styles.listItem}>
                <strong>주인공</strong>
                <span>Lv.15 · 검사</span>
              </div>
              <div className={styles.listItem}>
                <strong>히로인</strong>
                <span>Lv.12 · 마법사</span>
              </div>
              <div className={styles.listItem}>
                <strong>동료1</strong>
                <span>Lv.10 · 궁수</span>
              </div>
            </div>
          )}
          {activeTab === "world" && (
            <div>
              <div className={styles.listItem}>
                <strong>아르카디아 왕국</strong>
                <span>인간 중심 국가</span>
              </div>
              <div className={styles.listItem}>
                <strong>엘프의 숲</strong>
                <span>고대 엘프 거주지</span>
              </div>
            </div>
          )}
          {activeTab === "map" && (
            <div className={styles.mapPlaceholder}>
              <p>🗺️ 세계 지도</p>
              <span>지도 이미지가 표시됩니다</span>
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
          <button className={styles.saveBtn}>저장</button>
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
              <div className={styles.foreshadowItem}>
                <span
                  className={styles.foreshadowStatus}
                  data-resolved="false"
                />
                <span>주인공의 목걸이 비밀</span>
              </div>
              <div className={styles.foreshadowItem}>
                <span
                  className={styles.foreshadowStatus}
                  data-resolved="true"
                />
                <span>마을 장로의 예언 (회수됨)</span>
              </div>
              <div className={styles.foreshadowItem}>
                <span
                  className={styles.foreshadowStatus}
                  data-resolved="false"
                />
                <span>검은 기사의 정체</span>
              </div>
            </div>
          )}
          {rightTab === "version" && (
            <div>
              <div className={styles.versionItem}>
                <strong>v3</strong>
                <span>2026-02-20 15:30</span>
              </div>
              <div className={styles.versionItem}>
                <strong>v2</strong>
                <span>2026-02-19 10:00</span>
              </div>
              <div className={styles.versionItem}>
                <strong>v1</strong>
                <span>2026-02-18 09:00</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 하단: 타임라인 뷰 */}
      <div className={styles.bottomPanel}>
        <h3 className={styles.bottomTitle}>⏳ 타임라인</h3>
        <div className={styles.timeline}>
          {episodes.map((ep) => (
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
