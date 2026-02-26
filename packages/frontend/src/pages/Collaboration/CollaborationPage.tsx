import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collaborationService,
  Collaborator,
} from "../../services/collaborationService";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Collaboration.module.css";

export default function CollaborationPage() {
  const { id: novelId } = useParams();
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadCollaborators = async () => {
    if (!novelId) return;
    try {
      const res = await collaborationService.list(novelId);
      setCollaborators(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadCollaborators();
  }, [novelId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novelId || !inviteEmail.trim()) return;
    setMessage("");
    try {
      await collaborationService.create(novelId, {
        user_email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      setShowInvite(false);
      setMessage("멤버가 초대되었습니다.");
      loadCollaborators();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "초대에 실패했습니다.");
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await collaborationService.delete(String(id));
      loadCollaborators();
    } catch {}
  };

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

      {message && (
        <p
          style={{
            textAlign: "center",
            color: message.includes("실패") ? "#e74c3c" : "#27ae60",
            margin: "0 0 16px",
          }}
        >
          {message}
        </p>
      )}

      {showInvite && (
        <div className={styles.inviteCard}>
          <h3>멤버 초대</h3>
          <form className={styles.inviteForm} onSubmit={handleInvite}>
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
            <div className={styles.avatar}>{user?.nickname?.[0] || "나"}</div>
            <div>
              <div className={styles.memberName}>
                {user?.nickname || "나"} (나)
              </div>
              <div className={styles.memberEmail}>{user?.email || ""}</div>
            </div>
          </div>
          <span className={styles.roleBadgeAdmin}>관리자</span>
        </div>
        {loading ? (
          <p style={{ padding: 16, color: "#888", textAlign: "center" }}>
            로딩 중...
          </p>
        ) : collaborators.length === 0 ? (
          <p style={{ padding: 16, color: "#888", textAlign: "center" }}>
            초대된 멤버가 없습니다
          </p>
        ) : (
          collaborators.map((member) => (
            <div key={member.ID} className={styles.memberRow}>
              <div className={styles.memberInfo}>
                <div className={styles.avatar}>
                  {(member.NICKNAME || member.USER_EMAIL)?.[0]}
                </div>
                <div>
                  <div className={styles.memberName}>
                    {member.NICKNAME || member.USER_EMAIL}
                  </div>
                  <div className={styles.memberEmail}>{member.USER_EMAIL}</div>
                </div>
              </div>
              <div className={styles.memberActions}>
                <span
                  className={
                    member.ROLE === "editor"
                      ? styles.roleBadgeEditor
                      : styles.roleBadgeViewer
                  }
                >
                  {member.ROLE === "editor" ? "편집자" : "뷰어"}
                </span>
                <span className={styles.joinedAt}>
                  {member.CREATED_AT
                    ? new Date(member.CREATED_AT).toLocaleDateString()
                    : ""}
                </span>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(member.ID)}
                >
                  제거
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
