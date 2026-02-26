import React, { useState } from "react";
import styles from "./AIWriting.module.css";

export default function AIWritingPage() {
  const [summary, setSummary] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className={styles.container}>
      <h1>AI 글쓰기</h1>
      <p className={styles.subtitle}>
        줄거리를 입력하면 AI가 상세 내용을 생성해 드립니다
      </p>

      <div className={styles.layout}>
        <div className={styles.inputSection}>
          <h3>줄거리 입력</h3>
          <textarea
            className={styles.textarea}
            placeholder="예: 주인공이 마을을 떠나 모험을 시작한다. 첫 번째 동료를 만나고 함께 왕국으로 향한다..."
            rows={10}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <label>문체</label>
              <select className={styles.select}>
                <option>서사적</option>
                <option>간결한</option>
                <option>감성적</option>
                <option>유머러스</option>
              </select>
            </div>
            <div className={styles.optionGroup}>
              <label>분량</label>
              <select className={styles.select}>
                <option>짧게 (500자)</option>
                <option>보통 (1000자)</option>
                <option>길게 (2000자)</option>
              </select>
            </div>
          </div>
          <button
            className={styles.generateBtn}
            onClick={() => setIsGenerating(true)}
            disabled={isGenerating}
          >
            {isGenerating ? "생성 중..." : "🤖 AI 생성"}
          </button>
        </div>

        <div className={styles.resultSection}>
          <h3>생성 결과</h3>
          <div className={styles.resultArea}>
            {result ? (
              <p>{result}</p>
            ) : (
              <div className={styles.placeholder}>
                <p>🤖</p>
                <span>줄거리를 입력하고 AI 생성 버튼을 클릭하세요</span>
                <span className={styles.placeholderHint}>
                  생성된 결과를 수정한 후 텍스트 편집기에 삽입할 수 있습니다
                </span>
              </div>
            )}
          </div>
          <div className={styles.resultActions}>
            <button className={styles.actionBtn} disabled={!result}>
              텍스트 편집기에 삽입
            </button>
            <button className={styles.actionBtnSecondary} disabled={!result}>
              복사
            </button>
            <button className={styles.actionBtnSecondary} disabled={!result}>
              다시 생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
