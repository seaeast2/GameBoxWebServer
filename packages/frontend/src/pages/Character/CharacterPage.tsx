import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Character.module.css";

const mockCharacters = [
  {
    id: "1",
    name: "주인공",
    level: 15,
    className: "검사",
    stats: { str: 20, dex: 15, int: 10, luk: 12 },
    items: ["불꽃의 검", "미스릴 갑옷"],
  },
  {
    id: "2",
    name: "히로인",
    level: 12,
    className: "마법사",
    stats: { str: 5, dex: 10, int: 25, luk: 8 },
    items: ["현자의 지팡이", "마법 로브"],
  },
  {
    id: "3",
    name: "동료1",
    level: 10,
    className: "궁수",
    stats: { str: 10, dex: 22, int: 8, luk: 15 },
    items: ["바람의 활", "가죽 갑옷"],
  },
];

export default function CharacterPage() {
  const { id } = useParams();
  const [selected, setSelected] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", className: "", level: 1 });

  const selectedChar = mockCharacters.find((c) => c.id === selected);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>캐릭터 관리</h1>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          + 캐릭터 추가
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3>새 캐릭터 생성</h3>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>이름</label>
                <input
                  className={styles.input}
                  placeholder="캐릭터 이름"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>직업</label>
                <input
                  className={styles.input}
                  placeholder="직업/클래스"
                  value={form.className}
                  onChange={(e) =>
                    setForm({ ...form, className: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>레벨</label>
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  value={form.level}
                  onChange={(e) =>
                    setForm({ ...form, level: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <button className={styles.submitBtn} type="submit">
              생성
            </button>
          </form>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.charList}>
          {mockCharacters.map((char) => (
            <div
              key={char.id}
              className={`${styles.charCard} ${selected === char.id ? styles.charCardActive : ""}`}
              onClick={() => setSelected(char.id)}
            >
              <div className={styles.charAvatar}>{char.name[0]}</div>
              <div>
                <div className={styles.charName}>{char.name}</div>
                <div className={styles.charInfo}>
                  Lv.{char.level} · {char.className}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedChar && (
          <div className={styles.detail}>
            <h2>{selectedChar.name}</h2>
            <p className={styles.detailSub}>
              Lv.{selectedChar.level} · {selectedChar.className}
            </p>

            <h3>능력치</h3>
            <div className={styles.statsGrid}>
              {Object.entries(selectedChar.stats).map(([key, val]) => (
                <div key={key} className={styles.statItem}>
                  <span className={styles.statKey}>{key.toUpperCase()}</span>
                  <div className={styles.statBar}>
                    <div
                      className={styles.statFill}
                      style={{ width: `${(val / 30) * 100}%` }}
                    />
                  </div>
                  <span className={styles.statVal}>{val}</span>
                </div>
              ))}
            </div>

            <h3>아이템</h3>
            <div className={styles.itemList}>
              {selectedChar.items.map((item, i) => (
                <div key={i} className={styles.itemTag}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
