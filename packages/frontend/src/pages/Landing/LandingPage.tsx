import React from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.css";

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* 히어로 섹션 */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>당신의 이야기를 세상에 펼치세요</h1>
        <p className={styles.heroDesc}>
          AI 글쓰기 지원, 캐릭터 관리, 세계관 설정, 타임라인 관리까지
          <br />
          웹소설 작가를 위한 올인원 창작 플랫폼
        </p>
        <div className={styles.heroBtns}>
          <Link to="/signup" className={styles.primaryBtn}>
            무료로 시작하기
          </Link>
          <Link to="/login" className={styles.secondaryBtn}>
            로그인
          </Link>
        </div>
      </section>

      {/* 서비스 소개 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>서비스 소개</h2>
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📝</div>
            <h3>스마트 텍스트 편집기</h3>
            <p>Rich Text & Markdown 지원, AI 연동 글쓰기</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3>캐릭터 관리</h3>
            <p>능력치, 아이템, 레벨 등 체계적인 캐릭터 관리</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌍</div>
            <h3>세계관 & 지도</h3>
            <p>종족, 국가, 역사 설정과 세계 지도 관리</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏳</div>
            <h3>타임라인 관리</h3>
            <p>화별 사건 기록 및 복선 마커 관리</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🤖</div>
            <h3>AI 글쓰기</h3>
            <p>줄거리 입력으로 상세 내용 자동 생성</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🤝</div>
            <h3>실시간 협업</h3>
            <p>공동 편집 및 권한 관리 지원</p>
          </div>
        </div>
      </section>

      {/* 서비스 장점 */}
      <section className={styles.section} style={{ background: "#f0f0f8" }}>
        <h2 className={styles.sectionTitle}>왜 우리 서비스인가요?</h2>
        <div className={styles.advantages}>
          <div className={styles.advItem}>
            <span className={styles.advNum}>01</span>
            <h3>통합 관리</h3>
            <p>캐릭터, 세계관, 타임라인을 한 곳에서 관리하세요</p>
          </div>
          <div className={styles.advItem}>
            <span className={styles.advNum}>02</span>
            <h3>AI 지원</h3>
            <p>줄거리만 입력하면 AI가 상세 내용을 생성해 드립니다</p>
          </div>
          <div className={styles.advItem}>
            <span className={styles.advNum}>03</span>
            <h3>버전 관리</h3>
            <p>이전 버전 복원과 변경 비교 기능으로 안심 집필</p>
          </div>
          <div className={styles.advItem}>
            <span className={styles.advNum}>04</span>
            <h3>협업</h3>
            <p>실시간 공동 편집으로 함께 창작하세요</p>
          </div>
        </div>
      </section>

      {/* 서비스 가격 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>서비스 가격</h2>
        <div className={styles.pricing}>
          <div className={styles.priceCard}>
            <h3>Free</h3>
            <div className={styles.priceAmount}>
              ₩0 <span>/월</span>
            </div>
            <ul>
              <li>소설 3편까지 생성</li>
              <li>기본 텍스트 편집기</li>
              <li>캐릭터/세계관 관리</li>
              <li>AI 글쓰기 월 10회</li>
            </ul>
            <Link to="/signup" className={styles.priceBtn}>
              시작하기
            </Link>
          </div>
          <div className={`${styles.priceCard} ${styles.priceCardPopular}`}>
            <div className={styles.popularBadge}>인기</div>
            <h3>Premium</h3>
            <div className={styles.priceAmount}>
              ₩9,900 <span>/월</span>
            </div>
            <ul>
              <li>소설 무제한 생성</li>
              <li>고급 텍스트 편집기</li>
              <li>AI 글쓰기 무제한</li>
              <li>고급 지도 편집</li>
              <li>버전 관리</li>
            </ul>
            <Link to="/payment" className={styles.priceBtn}>
              구독하기
            </Link>
          </div>
          <div className={styles.priceCard}>
            <h3>Team</h3>
            <div className={styles.priceAmount}>
              ₩19,900 <span>/월</span>
            </div>
            <ul>
              <li>Premium 모든 기능</li>
              <li>실시간 협업</li>
              <li>팀원 관리</li>
              <li>권한 관리</li>
            </ul>
            <Link to="/payment" className={styles.priceBtn}>
              구독하기
            </Link>
          </div>
        </div>
      </section>

      {/* 서비스 문의 */}
      <section className={styles.section} style={{ background: "#f0f0f8" }}>
        <h2 className={styles.sectionTitle}>문의하기</h2>
        <div className={styles.contact}>
          <div className={styles.contactForm}>
            <input type="text" placeholder="이름" className={styles.input} />
            <input type="email" placeholder="이메일" className={styles.input} />
            <textarea
              placeholder="문의 내용을 입력하세요"
              className={styles.textarea}
              rows={5}
            />
            <button className={styles.primaryBtn}>문의 보내기</button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className={styles.footer}>
        <p>© 2026 웹소설 작가의 방. All rights reserved.</p>
      </footer>
    </div>
  );
}
