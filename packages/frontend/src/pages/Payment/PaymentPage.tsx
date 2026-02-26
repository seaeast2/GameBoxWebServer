import React, { useState, useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Payment.module.css";

export default function PaymentPage() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [subscribing, setSubscribing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    paymentService
      .getStatus()
      .then((res) => setCurrentPlan(res.data.PLAN || "free"))
      .catch(() => {});
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setMessage("로그인이 필요합니다.");
      return;
    }
    setSubscribing(true);
    setMessage("");
    try {
      await paymentService.subscribe(planId);
      setCurrentPlan(planId);
      setMessage("구독이 완료되었습니다!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "구독에 실패했습니다.");
    }
    setSubscribing(false);
  };

  const handleCancel = async () => {
    try {
      await paymentService.cancel();
      setCurrentPlan("free");
      setMessage("구독이 취소되었습니다.");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "취소에 실패했습니다.");
    }
  };

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
      {message && (
        <p
          style={{
            textAlign: "center",
            color:
              message.includes("실패") || message.includes("필요")
                ? "#e74c3c"
                : "#27ae60",
            margin: "0 0 16px",
          }}
        >
          {message}
        </p>
      )}

      <div className={styles.currentPlan}>
        <span>현재 플랜:</span>
        <strong>
          {currentPlan === "premium"
            ? "Premium"
            : currentPlan === "team"
              ? "Team"
              : "Free"}
        </strong>
        <span className={styles.planStatus}>활성</span>
        {currentPlan !== "free" && (
          <button
            onClick={handleCancel}
            style={{
              marginLeft: 12,
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              padding: "4px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            구독 취소
          </button>
        )}
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
              disabled={currentPlan === plan.id || subscribing}
              onClick={() => handleSubscribe(plan.id)}
            >
              {currentPlan === plan.id
                ? "현재 이용 중"
                : subscribing
                  ? "처리 중..."
                  : "구독하기"}
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
