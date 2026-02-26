import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Map.module.css";

export default function MapPage() {
  const { id } = useParams();
  const [showUpload, setShowUpload] = useState(false);

  const mockMaps = [
    {
      id: "1",
      name: "대륙 전체 지도",
      description: "아르카디아 대륙의 전체 지도",
    },
    {
      id: "2",
      name: "아르카디아 왕국 상세 지도",
      description: "왕국 내부 도시 및 주요 거점",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>세계지도 관리</h1>
        <button
          className={styles.addBtn}
          onClick={() => setShowUpload(!showUpload)}
        >
          + 지도 추가
        </button>
      </div>

      {showUpload && (
        <div className={styles.uploadCard}>
          <h3>새 지도 업로드</h3>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input className={styles.input} placeholder="지도 이름" />
            <div className={styles.dropzone}>
              <p>🗺️</p>
              <span>이미지를 드래그하거나 클릭하여 업로드</span>
              <span className={styles.dropzoneHint}>
                PNG, JPG, SVG (최대 10MB)
              </span>
            </div>
            <button className={styles.submitBtn} type="submit">
              업로드
            </button>
          </form>
        </div>
      )}

      <div className={styles.grid}>
        {mockMaps.map((map) => (
          <div key={map.id} className={styles.mapCard}>
            <div className={styles.mapPreview}>
              <span>🗺️</span>
              <p>지도 미리보기</p>
            </div>
            <div className={styles.mapInfo}>
              <h3>{map.name}</h3>
              <p>{map.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mapViewer}>
        <h2>지도 뷰어</h2>
        <div className={styles.viewerArea}>
          <div className={styles.viewerPlaceholder}>
            <p>🗺️</p>
            <span>지도를 선택하면 이곳에 표시됩니다</span>
            <span className={styles.viewerHint}>
              캐릭터 위치 표시 · 타임라인별 위치 변화 추적
            </span>
          </div>
        </div>
        <div className={styles.viewerControls}>
          <button className={styles.controlBtn}>↻ 초기화</button>
          <button className={styles.controlBtn}>📍 캐릭터 위치 표시</button>
          <button className={styles.controlBtn}>⏳ 타임라인 연동</button>
        </div>
      </div>
    </div>
  );
}
