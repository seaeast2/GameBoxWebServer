import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Collaboration.module.css";

const mockCollaborators = [
  {
    id: "1",
    nickname: "작가B",
    email: "writerB@example.com",
    role: "editor",
    joinedAt: "2026-02-20",
  },
  {
    id: "2",
    nickname: "편집자1",
    email: "editor1@example.com",
    role: "editor",
    joinedAt: "2026-02-18",
  },
  {
    id: "3",
    nickname: "뷰어A",
    email: "viewer@example.com",
    role: "viewer",
    joinedAt: "2026-02-15",
  },
];

export default function CollaborationPage() {
  const { id } = useParams();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>협업 관리</h1>
        <button
          className={styles.addBtn}
          onClick={() => setShowInvite(!showInvite)}
        >
          + 멤버 초대
        </button>
      </div>

      {showInvite && (
        <div className={styles.inviteCard}>
          <h3>멤버 초대</h3>
          <form
            className={styles.inviteForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className={styles.input}
              type="email"
              placeholder="초대할 이메일 주소"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <select
              className={styles.select}
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <option value="editor">편집자</option>
              <option value="viewer">뷰어</option>
            </select>
            <button className={styles.inviteBtn} type="submit">
              초대 보내기
            </button>
          </form>
        </div>
      )}

      <div className={styles.roleInfo}>
        <div className={styles.roleCard}>
          <h4>🛡️ 관리자</h4>
          <p>모든 권한 (소설 삭제, 멤버 관리 포함)</p>
        </div>
        <div className={styles.roleCard}>
          <h4>✏️ 편집자</h4>
          <p>텍스트 편집, 캐릭터/세계관 수정 가능</p>
        </div>
        <div className={styles.roleCard}>
          <h4>👁️ 뷰어</h4>
          <p>읽기 전용 접근</p>
        </div>
      </div>

      <div className={styles.memberList}>
        <h2>멤버 목록</h2>
        <div className={styles.ownerRow}>
          <div className={styles.memberInfo}>
            <div className={styles.avatar}>나</div>
            <div>
              <div className={styles.memberName}>작가A (나)</div>
              <div className={styles.memberEmail}>user@example.com</div>
            </div>
          </div>
          <span className={styles.roleBadgeAdmin}>관리자</span>
        </div>
        {mockCollaborators.map((member) => (
          <div key={member.id} className={styles.memberRow}>
            <div className={styles.memberInfo}>
              <div className={styles.avatar}>{member.nickname[0]}</div>
              <div>
                <div className={styles.memberName}>{member.nickname}</div>
                <div className={styles.memberEmail}>{member.email}</div>
              </div>
            </div>
            <div className={styles.memberActions}>
              <span
                className={
                  member.role === "editor"
                    ? styles.roleBadgeEditor
                    : styles.roleBadgeViewer
                }
              >
                {member.role === "editor" ? "편집자" : "뷰어"}
              </span>
              <span className={styles.joinedAt}>{member.joinedAt}</span>
              <button className={styles.removeBtn}>제거</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
