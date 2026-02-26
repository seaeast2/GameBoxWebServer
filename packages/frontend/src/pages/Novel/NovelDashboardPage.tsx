import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { novelService, Novel } from "../../services/novelService";
import { characterService } from "../../services/characterService";
import { worldService } from "../../services/worldService";
import { timelineService } from "../../services/timelineService";
import styles from "./Novel.module.css";

export default function NovelDashboardPage() {
  const { id } = useParams();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [stats, setStats] = useState({
    characters: 0,
    worlds: 0,
    timelines: 0,
  });

  useEffect(() => {
    if (!id) return;
    novelService
      .get(id)
      .then((res) => setNovel(res.data))
      .catch(() => {});
    Promise.all([
      characterService.list(id).catch(() => ({ data: [] })),
      worldService.list(id).catch(() => ({ data: [] })),
      timelineService.list(id).catch(() => ({ data: [] })),
    ]).then(([chars, worlds, tls]) => {
      setStats({
        characters: chars.data.length,
        worlds: worlds.data.length,
        timelines: tls.data.length,
      });
    });
  }, [id]);

  const menuItems = [
    { icon: "📝", label: "텍스트 편집기", path: `/novels/${id}/editor` },
    { icon: "👥", label: "캐릭터 관리", path: `/novels/${id}/characters` },
    { icon: "🌍", label: "세계관 관리", path: `/novels/${id}/worlds` },
    { icon: "🗺️", label: "세계지도 관리", path: `/novels/${id}/maps` },
    { icon: "⏳", label: "타임라인 관리", path: `/novels/${id}/timelines` },
    { icon: "🤖", label: "AI 글쓰기", path: `/novels/${id}/ai-writing` },
    { icon: "🤝", label: "협업 관리", path: `/novels/${id}/collaboration` },
    { icon: "📂", label: "버전 관리", path: `/novels/${id}/versions` },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.dashHeader}>
        <h1>소설 대시보드</h1>
        <p className={styles.dashSubtitle}>
          {novel ? `${novel.TITLE} · ${novel.GENRE || "미분류"}` : "로딩 중..."}
        </p>
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
          <div className={styles.statValue}>{stats.timelines}</div>
          <div className={styles.statLabel}>타임라인</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.characters}</div>
          <div className={styles.statLabel}>캐릭터</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.worlds}</div>
          <div className={styles.statLabel}>세계관</div>
        </div>
      </div>
    </div>
  );
}
