import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Payment.module.css";

export default function PaymentPage() {
  const [currentPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₩0",
      period: "/월",
      features: [
        "소설 3편까지 생성",
        "기본 텍스트 편집기",
        "캐릭터/세계관 관리",
        "AI 글쓰기 월 10회",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "₩9,900",
      period: "/월",
      popular: true,
      features: [
        "소설 무제한 생성",
        "고급 텍스트 편집기",
        "AI 글쓰기 무제한",
        "고급 지도 편집",
        "버전 관리",
      ],
    },
    {
      id: "team",
      name: "Team",
      price: "₩19,900",
      period: "/월",
      features: [
        "Premium 모든 기능",
        "실시간 협업",
        "팀원 관리",
        "권한 관리",
        "우선 지원",
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <h1>구독 & 결제</h1>
      <p className={styles.subtitle}>나에게 맞는 플랜을 선택하세요</p>

      <div className={styles.currentPlan}>
        <span>현재 플랜:</span>
        <strong>Free</strong>
        <span className={styles.planStatus}>활성</span>
      </div>

      <div className={styles.plans}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${plan.popular ? styles.planPopular : ""} ${currentPlan === plan.id ? styles.planCurrent : ""}`}
          >
            {plan.popular && <div className={styles.badge}>인기</div>}
            {currentPlan === plan.id && (
              <div className={styles.badgeCurrent}>현재 플랜</div>
            )}
            <h3>{plan.name}</h3>
            <div className={styles.price}>
              {plan.price}
              <span>{plan.period}</span>
            </div>
            <ul className={styles.featureList}>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              className={
                currentPlan === plan.id ? styles.currentBtn : styles.selectBtn
              }
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? "현재 이용 중" : "구독하기"}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.history}>
        <h2>결제 내역</h2>
        <div className={styles.emptyHistory}>
          <p>결제 내역이 없습니다</p>
        </div>
      </div>
    </div>
  );
}
