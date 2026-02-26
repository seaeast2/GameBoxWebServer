import React from "react";
import { Link } from "react-router-dom";
import styles from "./Novel.module.css";

const mockNovels = [
  {
    id: "1",
    title: "검과 마법의 세계",
    genre: "판타지",
    updatedAt: "2026-02-20",
    episodes: 12,
  },
  {
    id: "2",
    title: "별이 내리는 밤",
    genre: "로맨스",
    updatedAt: "2026-02-18",
    episodes: 8,
  },
  {
    id: "3",
    title: "시간의 균열",
    genre: "SF",
    updatedAt: "2026-02-15",
    episodes: 5,
  },
];

export default function NovelListPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>내 소설 목록</h1>
        <Link to="/novels/new" className={styles.newBtn}>
          + 새 소설 쓰기
        </Link>
      </div>
      <div className={styles.grid}>
        {mockNovels.map((novel) => (
          <Link
            to={`/novels/${novel.id}`}
            key={novel.id}
            className={styles.card}
          >
            <div className={styles.cardCover}>
              <span className={styles.genre}>{novel.genre}</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{novel.title}</h3>
              <p className={styles.cardMeta}>
                {novel.episodes}화 · {novel.updatedAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
