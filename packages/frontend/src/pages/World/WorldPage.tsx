import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { worldService, World } from "../../services/worldService";
import styles from "./World.module.css";

export default function WorldPage() {
  const { id: novelId } = useParams();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    races: "",
    history: "",
  });

  const loadWorlds = async () => {
    if (!novelId) return;
    try {
      const res = await worldService.list(novelId);
      setWorlds(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadWorlds();
  }, [novelId]);

  const selectedWorld = worlds.find((w) => w.ID === selected);

  const getMeta = (world: World) => {
    if (!world.METADATA) return { races: [], history: "" };
    const meta =
      typeof world.METADATA === "string"
        ? JSON.parse(world.METADATA)
        : world.METADATA;
    return {
      races: meta.races || [],
      history: meta.history || "",
    };
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novelId || !form.name.trim()) return;
    try {
      await worldService.create(novelId, {
        name: form.name,
        description: form.description,
        metadata: {
          races: form.races
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean),
          history: form.history,
        },
      });
      setForm({ name: "", description: "", races: "", history: "" });
      setShowForm(false);
      loadWorlds();
    } catch {}
  };

  const handleDelete = async (worldId: number) => {
    try {
      await worldService.delete(String(worldId));
      if (selected === worldId) setSelected(null);
      loadWorlds();
    } catch {}
  };

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
          <form className={styles.form} onSubmit={handleCreate}>
            <label>이름</label>
            <input
              className={styles.input}
              placeholder="세계관 요소 이름"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label>설명</label>
            <textarea
              className={styles.textarea}
              placeholder="상세 설명을 입력하세요"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <label>종족</label>
            <input
              className={styles.input}
              placeholder="관련 종족 (쉼표로 구분)"
              value={form.races}
              onChange={(e) => setForm({ ...form, races: e.target.value })}
            />
            <label>역사</label>
            <input
              className={styles.input}
              placeholder="주요 역사적 사건"
              value={form.history}
              onChange={(e) => setForm({ ...form, history: e.target.value })}
            />
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
      ) : worlds.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40, color: "#888" }}>
          등록된 세계관이 없습니다
        </p>
      ) : (
        <div className={styles.grid}>
          {worlds.map((world) => (
            <div
              key={world.ID}
              className={`${styles.card} ${selected === world.ID ? styles.cardActive : ""}`}
              onClick={() => setSelected(world.ID)}
            >
              <div className={styles.cardIcon}>🌍</div>
              <h3>{world.NAME}</h3>
              <p>{world.DESCRIPTION}</p>
              <div className={styles.tags}>
                {getMeta(world).races.map((r: string) => (
                  <span key={r} className={styles.tag}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWorld && (
        <div className={styles.detail}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>{selectedWorld.NAME}</h2>
            <button
              onClick={() => handleDelete(selectedWorld.ID)}
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
          <p className={styles.detailDesc}>{selectedWorld.DESCRIPTION}</p>
          {getMeta(selectedWorld).races.length > 0 && (
            <div className={styles.detailSection}>
              <h3>종족</h3>
              <div className={styles.tags}>
                {getMeta(selectedWorld).races.map((r: string) => (
                  <span key={r} className={styles.tagLarge}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
          {getMeta(selectedWorld).history && (
            <div className={styles.detailSection}>
              <h3>역사</h3>
              <p>{getMeta(selectedWorld).history}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
