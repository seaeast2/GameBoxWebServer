import React, { useState } from "react";
import styles from "./Novel.module.css";

export default function NovelCreatePage() {
  const [form, setForm] = useState({
    title: "",
    genre: "",
    description: "",
    isCollab: false,
  });

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>새 소설 쓰기</h1>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.label}>소설 제목</label>
          <input
            className={styles.input}
            type="text"
            placeholder="소설 제목을 입력하세요"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <label className={styles.label}>장르</label>
          <select
            className={styles.input}
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          >
            <option value="">장르 선택</option>
            <option value="fantasy">판타지</option>
            <option value="romance">로맨스</option>
            <option value="sf">SF</option>
            <option value="mystery">미스터리</option>
            <option value="horror">호러</option>
            <option value="martial">무협</option>
            <option value="modern">현대</option>
          </select>

          <label className={styles.label}>소설 소개</label>
          <textarea
            className={styles.textarea}
            placeholder="소설 소개를 입력하세요"
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.isCollab}
              onChange={(e) => setForm({ ...form, isCollab: e.target.checked })}
            />
            협업 소설로 생성
          </label>

          <button className={styles.submitBtn} type="submit">
            소설 생성
          </button>
        </form>
      </div>
    </div>
  );
}
