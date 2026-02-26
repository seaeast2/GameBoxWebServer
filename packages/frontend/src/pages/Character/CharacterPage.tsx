import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { characterService, Character } from "../../services/characterService";
import styles from "./Character.module.css";

export default function CharacterPage() {
  const { id: novelId } = useParams();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", className: "", level: 1 });
  const [loading, setLoading] = useState(true);

  const loadCharacters = async () => {
    if (!novelId) return;
    try {
      const res = await characterService.list(novelId);
      setCharacters(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadCharacters();
  }, [novelId]);

  const selectedChar = characters.find((c) => c.ID === selected);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novelId || !form.name.trim()) return;
    try {
      await characterService.create(novelId, {
        name: form.name,
        level: form.level,
        stats: { class: form.className },
      });
      setForm({ name: "", className: "", level: 1 });
      setShowForm(false);
      loadCharacters();
    } catch {}
  };

  const handleDelete = async (charId: number) => {
    try {
      await characterService.delete(String(charId));
      if (selected === charId) setSelected(null);
      loadCharacters();
    } catch {}
  };

  const getStats = (char: Character) => {
    if (!char.STATS) return {};
    if (typeof char.STATS === "string") {
      try {
        return JSON.parse(char.STATS);
      } catch {
        return {};
      }
    }
    return char.STATS;
  };

  const getItems = (char: Character): string[] => {
    if (!char.ITEMS) return [];
    if (typeof char.ITEMS === "string") {
      try {
        return JSON.parse(char.ITEMS);
      } catch {
        return [];
      }
    }
    if (Array.isArray(char.ITEMS)) return char.ITEMS;
    return [];
  };

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
          <form className={styles.form} onSubmit={handleCreate}>
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

      {loading ? (
        <p style={{ textAlign: "center", padding: 40, color: "#888" }}>
          로딩 중...
        </p>
      ) : (
        <div className={styles.content}>
          <div className={styles.charList}>
            {characters.length === 0 ? (
              <p style={{ padding: 20, color: "#888", textAlign: "center" }}>
                등록된 캐릭터가 없습니다
              </p>
            ) : (
              characters.map((char) => (
                <div
                  key={char.ID}
                  className={`${styles.charCard} ${selected === char.ID ? styles.charCardActive : ""}`}
                  onClick={() => setSelected(char.ID)}
                >
                  <div className={styles.charAvatar}>{char.NAME[0]}</div>
                  <div>
                    <div className={styles.charName}>{char.NAME}</div>
                    <div className={styles.charInfo}>
                      Lv.{char.LEVEL || 1} · {getStats(char).class || "미정"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedChar && (
            <div className={styles.detail}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>{selectedChar.NAME}</h2>
                <button
                  onClick={() => handleDelete(selectedChar.ID)}
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
              <p className={styles.detailSub}>
                Lv.{selectedChar.LEVEL || 1} ·{" "}
                {getStats(selectedChar).class || "미정"}
              </p>

              {Object.keys(getStats(selectedChar)).length > 0 && (
                <>
                  <h3>능력치</h3>
                  <div className={styles.statsGrid}>
                    {Object.entries(getStats(selectedChar))
                      .filter(([key]) => key !== "class")
                      .map(([key, val]) => (
                        <div key={key} className={styles.statItem}>
                          <span className={styles.statKey}>
                            {key.toUpperCase()}
                          </span>
                          <div className={styles.statBar}>
                            <div
                              className={styles.statFill}
                              style={{ width: `${(Number(val) / 30) * 100}%` }}
                            />
                          </div>
                          <span className={styles.statVal}>{String(val)}</span>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {getItems(selectedChar).length > 0 && (
                <>
                  <h3>아이템</h3>
                  <div className={styles.itemList}>
                    {getItems(selectedChar).map((item, i) => (
                      <div key={i} className={styles.itemTag}>
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
