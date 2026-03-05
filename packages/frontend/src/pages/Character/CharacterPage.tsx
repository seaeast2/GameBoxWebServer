import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { characterService, Character } from "../../services/characterService";
import styles from "./Character.module.css";

export default function CharacterPage() {
  const { id: novelId } = useParams();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  // 상세 편집용 state
  const [classInput, setClassInput] = useState("");
  const [levelInput, setLevelInput] = useState(1);
  const [newStatKey, setNewStatKey] = useState("");
  const [newStatVal, setNewStatVal] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");

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

  const selectedChar = characters.find((c) => c.id === selected);

  // 캐릭터 선택 시 편집 state 초기화
  useEffect(() => {
    if (!selectedChar) return;
    const stats = getStats(selectedChar);
    setClassInput(stats.class || "");
    setLevelInput(selectedChar.level || 1);
  }, [selected]);

  const getStats = (char: Character) => {
    if (!char.stats) return {};
    if (typeof char.stats === "string") {
      try { return JSON.parse(char.stats); } catch { return {}; }
    }
    return char.stats;
  };

  const getItems = (char: Character): { name: string; description: string }[] => {
    if (!char.items) return [];
    let parsed = char.items;
    if (typeof parsed === "string") {
      try { parsed = JSON.parse(parsed); } catch { return []; }
    }
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: any) =>
      typeof item === "object" && item !== null
        ? { name: item.name ?? "", description: item.description ?? "" }
        : { name: String(item), description: "" }
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novelId || !newName.trim()) return;
    try {
      await characterService.create(novelId, { name: newName.trim() });
      setNewName("");
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

  const updateChar = async (data: { level?: number; stats?: any; items?: any }) => {
    if (!selectedChar) return;
    try {
      await characterService.update(String(selectedChar.id), data);
      loadCharacters();
    } catch {}
  };

  const handleSaveClass = async () => {
    if (!selectedChar) return;
    const stats = { ...getStats(selectedChar), class: classInput };
    await updateChar({ stats });
  };

  const handleSaveLevel = async () => {
    await updateChar({ level: levelInput });
  };

  const handleAddStat = async () => {
    if (!newStatKey.trim() || !newStatVal.trim()) return;
    const stats = { ...getStats(selectedChar!), [newStatKey.trim()]: Number(newStatVal) || newStatVal };
    await updateChar({ stats });
    setNewStatKey("");
    setNewStatVal("");
  };

  const handleDeleteStat = async (key: string) => {
    const stats = { ...getStats(selectedChar!) };
    delete stats[key];
    await updateChar({ stats });
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    const items = [...getItems(selectedChar!), { name: newItem.trim(), description: newItemDesc.trim() }];
    await updateChar({ items });
    setNewItem("");
    setNewItemDesc("");
  };

  const handleDeleteItem = async (index: number) => {
    const items = getItems(selectedChar!).filter((_, i) => i !== index);
    await updateChar({ items });
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
            <div className={styles.formGroup}>
              <label>이름</label>
              <input
                className={styles.input}
                placeholder="캐릭터 이름"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
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
                  key={char.id}
                  className={`${styles.charCard} ${selected === char.id ? styles.charCardActive : ""}`}
                  onClick={() => setSelected(char.id)}
                >
                  <div className={styles.charAvatar}>{char.name[0]}</div>
                  <div>
                    <div className={styles.charName}>{char.name}</div>
                    <div className={styles.charInfo}>
                      Lv.{char.level || 1} · {getStats(char).class || "미정"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 캐릭터 현재 설정 정보 */}
          {selectedChar && (
            <div className={styles.detail}>
              <div className={styles.detailHeader}>
                <h2>{selectedChar.name}</h2>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(selectedChar.id)}
                >
                  삭제
                </button>
              </div>

              {/* 레벨 */}
              <div className={styles.section}>
                <h3>레벨</h3>
                <div className={styles.inlineEdit}>
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    value={levelInput}
                    onChange={(e) => setLevelInput(Number(e.target.value))}
                    style={{ width: 80 }}
                  />
                  <button className={styles.saveBtn} onClick={handleSaveLevel}>
                    저장
                  </button>
                </div>
              </div>

              {/* 직업 */}
              <div className={styles.section}>
                <h3>직업</h3>
                <div className={styles.inlineEdit}>
                  <input
                    className={styles.input}
                    placeholder="직업/클래스"
                    value={classInput}
                    onChange={(e) => setClassInput(e.target.value)}
                  />
                  <button className={styles.saveBtn} onClick={handleSaveClass}>
                    저장
                  </button>
                </div>
              </div>

              {/* 능력치 */}
              <div className={styles.section}>
                <h3>능력치</h3>
                <div className={styles.statsGrid}>
                  {Object.entries(getStats(selectedChar))
                    .filter(([key]) => key !== "class")
                    .map(([key, val]) => (
                      <div key={key} className={styles.statItem}>
                        <span className={styles.statKey}>{key}</span>
                        <span className={styles.statDesc}>{String(val)}</span>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleDeleteStat(key)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
                <div className={styles.addRow}>
                  <input
                    className={styles.input}
                    placeholder="능력치 이름"
                    value={newStatKey}
                    onChange={(e) => setNewStatKey(e.target.value)}
                  />
                  <input
                    className={styles.input}
                    placeholder="설명"
                    value={newStatVal}
                    onChange={(e) => setNewStatVal(e.target.value)}
                  />
                  <button className={styles.saveBtn} onClick={handleAddStat}>
                    추가
                  </button>
                </div>
              </div>

              {/* 아이템 */}
              <div className={styles.section}>
                <h3>아이템</h3>
                <div className={styles.statsGrid}>
                  {getItems(selectedChar).map((item, i) => (
                    <div key={i} className={styles.statItem}>
                      <span className={styles.statKey}>{item.name}</span>
                      <span className={styles.statDesc}>{item.description}</span>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleDeleteItem(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.addRow}>
                  <input
                    className={styles.input}
                    placeholder="아이템 이름"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                  <input
                    className={styles.input}
                    placeholder="설명"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                  />
                  <button className={styles.saveBtn} onClick={handleAddItem}>
                    추가
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
