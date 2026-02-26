import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Auth.module.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    setLoading(true);
    try {
      await signup(form.email, form.password, form.nickname);
      navigate("/novels");
    } catch (err: any) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.subtitle}>
          웹소설 작가의 방에 오신 것을 환영합니다
        </p>
        {error && (
          <p
            style={{
              color: "#e74c3c",
              textAlign: "center",
              margin: "0 0 16px",
            }}
          >
            {error}
          </p>
        )}
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>
        <p className={styles.footer}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
