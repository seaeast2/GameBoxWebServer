import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { novelService, Novel } from "../../services/novelService";
import styles from "./Novel.module.css";

export default function NovelListPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    novelService
      .list()
      .then((res) => setNovels(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>내 소설 목록</h1>
        <Link to="/novels/new" className={styles.newBtn}>
          + 새 소설 쓰기
        </Link>
      </div>
      {loading ? (
        <p style={{ textAlign: "center", padding: 40, color: "#888" }}>
          로딩 중...
        </p>
      ) : novels.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40, color: "#888" }}>
          아직 작성한 소설이 없습니다. 새 소설을 시작해보세요!
        </p>
      ) : (
        <div className={styles.grid}>
          {novels.map((novel) => (
            <Link
              to={`/novels/${novel.ID}`}
              key={novel.ID}
              className={styles.card}
            >
              <div className={styles.cardCover}>
                <span className={styles.genre}>{novel.GENRE || "미분류"}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{novel.TITLE}</h3>
                <p className={styles.cardMeta}>
                  {novel.UPDATED_AT
                    ? new Date(novel.UPDATED_AT).toLocaleDateString()
                    : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
