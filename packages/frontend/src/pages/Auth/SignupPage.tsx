import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.subtitle}>
          웹소설 작가의 방에 오신 것을 환영합니다
        </p>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.label}>닉네임</label>
          <input
            className={styles.input}
            type="text"
            name="nickname"
            placeholder="사용할 닉네임"
            value={form.nickname}
            onChange={handleChange}
          />
          <label className={styles.label}>이메일</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={handleChange}
          />
          <label className={styles.label}>비밀번호</label>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="비밀번호 (8자 이상)"
            value={form.password}
            onChange={handleChange}
          />
          <label className={styles.label}>비밀번호 확인</label>
          <input
            className={styles.input}
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 재입력"
            value={form.passwordConfirm}
            onChange={handleChange}
          />
          <button className={styles.submitBtn} type="submit">
            가입하기
          </button>
        </form>
        <p className={styles.footer}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
