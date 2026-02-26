import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import { novelService, Novel } from "../../services/novelService";
import { paymentService } from "../../services/paymentService";
import styles from "./Auth.module.css";

export default function MyPage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({ nickname: "", email: "" });
  const [novels, setNovels] = useState<Novel[]>([]);
  const [plan, setPlan] = useState("free");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({ nickname: user.nickname, email: user.email });
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [novelsRes, statusRes] = await Promise.all([
        novelService.list(),
        paymentService.getStatus().catch(() => null),
      ]);
      setNovels(novelsRes.data);
      if (statusRes?.data?.PLAN) setPlan(statusRes.data.PLAN);
    } catch {
      // User might not have novels yet
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await authService.updateMe({ nickname: profile.nickname });
      await refreshUser();
      setMessage("프로필이 저장되었습니다.");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const planLabel =
    plan === "premium"
      ? "Premium 플랜"
      : plan === "team"
        ? "Team 플랜"
        : "Free 플랜";

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard} style={{ maxWidth: 600 }}>
        <h1 className={styles.title}>마이페이지</h1>
        {message && (
          <p
            style={{
              color: message.includes("실패") ? "#e74c3c" : "#27ae60",
              textAlign: "center",
              margin: "0 0 16px",
            }}
          >
            {message}
          </p>
        )}
        <form className={styles.form} onSubmit={handleSave}>
          <label className={styles.label}>닉네임</label>
          <input
            className={styles.input}
            type="text"
            value={profile.nickname}
            onChange={(e) =>
              setProfile({ ...profile, nickname: e.target.value })
            }
          />
          <label className={styles.label}>이메일</label>
          <input
            className={styles.input}
            type="email"
            value={profile.email}
            disabled
          />

          <div style={{ marginTop: 16 }}>
            <h3 style={{ margin: "0 0 12px", color: "#1a1a2e" }}>구독 상태</h3>
            <div
              style={{
                padding: 16,
                background: "#f5f6fa",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>{planLabel}</p>
              <p
                style={{ margin: "4px 0 0", color: "#888", fontSize: "0.9rem" }}
              >
                {plan === "free"
                  ? "프리미엄으로 업그레이드하여 더 많은 기능을 사용하세요"
                  : "현재 구독 중입니다"}
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ margin: "0 0 12px", color: "#1a1a2e" }}>
              내 소설 목록
            </h3>
            {novels.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  background: "#f5f6fa",
                  borderRadius: 8,
                  color: "#888",
                  textAlign: "center",
                }}
              >
                아직 작성한 소설이 없습니다
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {novels.map((novel) => (
                  <Link
                    key={novel.ID}
                    to={`/novels/${novel.ID}`}
                    style={{
                      padding: 12,
                      background: "#f5f6fa",
                      borderRadius: 8,
                      textDecoration: "none",
                      color: "#1a1a2e",
                    }}
                  >
                    <strong>{novel.TITLE}</strong>
                    {novel.GENRE && (
                      <span style={{ marginLeft: 8, color: "#888" }}>
                        {novel.GENRE}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            className={styles.submitBtn}
            type="submit"
            style={{ marginTop: 16 }}
            disabled={saving}
          >
            {saving ? "저장 중..." : "프로필 저장"}
          </button>
        </form>
      </div>
    </div>
  );
}
