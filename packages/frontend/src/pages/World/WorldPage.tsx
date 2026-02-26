import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./World.module.css";

const mockWorlds = [
  {
    id: "1",
    name: "아르카디아 왕국",
    description:
      "인간 중심의 대륙 최대 국가. 왕정 체제로 운영되며 강력한 기사단을 보유하고 있다.",
    races: ["인간", "하프엘프"],
    history: "500년 전 건국",
  },
  {
    id: "2",
    name: "엘프의 숲 (엘라스테아)",
    description:
      "고대 엘프들이 거주하는 거대한 숲. 외부인의 출입이 엄격히 통제된다.",
    races: ["엘프", "정령"],
    history: "태고부터 존재",
  },
  {
    id: "3",
    name: "드워프 산맥 연합",
    description:
      "지하 도시를 건설한 드워프들의 연합. 뛰어난 대장장이 기술로 유명하다.",
    races: ["드워프"],
    history: "300년 전 연합 결성",
  },
];

export default function WorldPage() {
  const { id } = useParams();
  const [selected, setSelected] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const selectedWorld = mockWorlds.find((w) => w.id === selected);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>세계관 관리</h1>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          + 세계관 추가
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3>새 세계관 요소 추가</h3>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <label>이름</label>
            <input className={styles.input} placeholder="세계관 요소 이름" />
            <label>설명</label>
            <textarea
              className={styles.textarea}
              placeholder="상세 설명을 입력하세요"
              rows={4}
            />
            <label>종족</label>
            <input
              className={styles.input}
              placeholder="관련 종족 (쉼표로 구분)"
            />
            <label>역사</label>
            <input className={styles.input} placeholder="주요 역사적 사건" />
            <button className={styles.submitBtn} type="submit">
              생성
            </button>
          </form>
        </div>
      )}

      <div className={styles.grid}>
        {mockWorlds.map((world) => (
          <div
            key={world.id}
            className={`${styles.card} ${selected === world.id ? styles.cardActive : ""}`}
            onClick={() => setSelected(world.id)}
          >
            <div className={styles.cardIcon}>🌍</div>
            <h3>{world.name}</h3>
            <p>{world.description}</p>
            <div className={styles.tags}>
              {world.races.map((r) => (
                <span key={r} className={styles.tag}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedWorld && (
        <div className={styles.detail}>
          <h2>{selectedWorld.name}</h2>
          <p className={styles.detailDesc}>{selectedWorld.description}</p>
          <div className={styles.detailSection}>
            <h3>종족</h3>
            <div className={styles.tags}>
              {selectedWorld.races.map((r) => (
                <span key={r} className={styles.tagLarge}>
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.detailSection}>
            <h3>역사</h3>
            <p>{selectedWorld.history}</p>
          </div>
        </div>
      )}
    </div>
  );
}
