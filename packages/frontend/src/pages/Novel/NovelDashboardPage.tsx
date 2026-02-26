import React from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Novel.module.css";

export default function NovelDashboardPage() {
  const { id } = useParams();

  const menuItems = [
    { icon: "📝", label: "텍스트 편집기", path: `/novels/${id}/editor` },
    { icon: "👥", label: "캐릭터 관리", path: `/novels/${id}/characters` },
    { icon: "🌍", label: "세계관 관리", path: `/novels/${id}/worlds` },
    { icon: "🗺️", label: "세계지도 관리", path: `/novels/${id}/maps` },
    { icon: "⏳", label: "타임라인 관리", path: `/novels/${id}/timelines` },
    { icon: "🔮", label: "복선 마커 관리", path: `/novels/${id}/foreshadows` },
    { icon: "🤖", label: "AI 글쓰기", path: `/novels/${id}/ai-writing` },
    { icon: "🤝", label: "협업 관리", path: `/novels/${id}/collaboration` },
    { icon: "📂", label: "버전 관리", path: `/novels/${id}/versions` },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.dashHeader}>
        <h1>소설 대시보드</h1>
        <p className={styles.dashSubtitle}>검과 마법의 세계 · 판타지 · 12화</p>
      </div>

      <div className={styles.dashGrid}>
        {menuItems.map((item) => (
          <Link to={item.path} key={item.label} className={styles.dashCard}>
            <span className={styles.dashIcon}>{item.icon}</span>
            <span className={styles.dashLabel}>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className={styles.dashStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>총 화수</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>5</div>
          <div className={styles.statLabel}>캐릭터</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>3</div>
          <div className={styles.statLabel}>세계관</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>8</div>
          <div className={styles.statLabel}>복선 마커</div>
        </div>
      </div>
    </div>
  );
}
