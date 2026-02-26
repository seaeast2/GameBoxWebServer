import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Auth.module.css";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/novels");
    } catch (err: any) {
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.subtitle}>계정에 로그인하세요</p>
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
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <p className={styles.footer}>
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
