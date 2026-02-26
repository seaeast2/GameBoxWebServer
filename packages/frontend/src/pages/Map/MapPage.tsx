import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mapService, MapItem } from "../../services/mapService";
import styles from "./Map.module.css";

export default function MapPage() {
  const { id: novelId } = useParams();
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", imageUrl: "" });

  const loadMaps = async () => {
    if (!novelId) return;
    try {
      const res = await mapService.list(novelId);
      setMaps(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadMaps();
  }, [novelId]);

  const getMeta = (map: MapItem) => {
    if (!map.METADATA) return { name: "" };
    return typeof map.METADATA === "string"
      ? JSON.parse(map.METADATA)
      : map.METADATA;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novelId) return;
    try {
      await mapService.create(novelId, {
        image_url: form.imageUrl || undefined,
        metadata: { name: form.name },
      });
      setForm({ name: "", imageUrl: "" });
      setShowUpload(false);
      loadMaps();
    } catch {}
  };

  const handleDelete = async (mapId: number) => {
    try {
      await mapService.delete(String(mapId));
      loadMaps();
    } catch {}
  };

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
          <h3>새 지도 추가</h3>
          <form className={styles.form} onSubmit={handleCreate}>
            <input
              className={styles.input}
              placeholder="지도 이름"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className={styles.input}
              placeholder="이미지 URL (선택)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <button className={styles.submitBtn} type="submit">
              추가
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center", padding: 40, color: "#888" }}>
          로딩 중...
        </p>
      ) : maps.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40, color: "#888" }}>
          등록된 지도가 없습니다
        </p>
      ) : (
        <div className={styles.grid}>
          {maps.map((map) => (
            <div key={map.ID} className={styles.mapCard}>
              <div className={styles.mapPreview}>
                {map.IMAGE_URL ? (
                  <img
                    src={map.IMAGE_URL}
                    alt={getMeta(map).name || "지도"}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  <>
                    <span>🗺️</span>
                    <p>지도 미리보기</p>
                  </>
                )}
              </div>
              <div className={styles.mapInfo}>
                <h3>{getMeta(map).name || `지도 #${map.ID}`}</h3>
                <button
                  onClick={() => handleDelete(map.ID)}
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
