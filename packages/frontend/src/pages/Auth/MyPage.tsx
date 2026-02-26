import React, { useState } from "react";
import styles from "./Auth.module.css";

export default function MyPage() {
  const [profile, setProfile] = useState({
    nickname: "작가A",
    email: "user@example.com",
  });

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard} style={{ maxWidth: 600 }}>
        <h1 className={styles.title}>마이페이지</h1>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
              <p style={{ margin: 0, fontWeight: 600 }}>Free 플랜</p>
              <p
                style={{ margin: "4px 0 0", color: "#888", fontSize: "0.9rem" }}
              >
                프리미엄으로 업그레이드하여 더 많은 기능을 사용하세요
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ margin: "0 0 12px", color: "#1a1a2e" }}>
              내 소설 목록
            </h3>
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
          </div>

          <button
            className={styles.submitBtn}
            type="submit"
            style={{ marginTop: 16 }}
          >
            프로필 저장
          </button>
        </form>
      </div>
    </div>
  );
}
