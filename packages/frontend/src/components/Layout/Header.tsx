import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        ✍️ 웹소설 작가의 방
      </div>
      <nav className={styles.nav}>
        <Link to="/novels">내 소설</Link>
        <Link to="/payment">구독/결제</Link>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/login" className={styles.loginBtn}>
          로그인
        </Link>
      </nav>
    </header>
  );
}
