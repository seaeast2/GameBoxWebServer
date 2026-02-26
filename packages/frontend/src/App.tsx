import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import MyPage from "./pages/Auth/MyPage";
import NovelListPage from "./pages/Novel/NovelListPage";
import NovelCreatePage from "./pages/Novel/NovelCreatePage";
import NovelDashboardPage from "./pages/Novel/NovelDashboardPage";
import EditorPage from "./pages/Editor/EditorPage";
import CharacterPage from "./pages/Character/CharacterPage";
import WorldPage from "./pages/World/WorldPage";
import MapPage from "./pages/Map/MapPage";
import TimelinePage from "./pages/Timeline/TimelinePage";
import AIWritingPage from "./pages/AIWriting/AIWritingPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import CollaborationPage from "./pages/Collaboration/CollaborationPage";
import VersionPage from "./pages/Version/VersionPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 대문 (Landing) - 헤더 없는 전체 페이지 */}
          <Route path="/" element={<LandingPage />} />

          {/* 헤더 포함 레이아웃 */}
          <Route element={<Layout />}>
            {/* 회원 관련 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/mypage" element={<MyPage />} />

            {/* 소설 관리 */}
            <Route path="/novels" element={<NovelListPage />} />
            <Route path="/novels/new" element={<NovelCreatePage />} />
            <Route path="/novels/:id" element={<NovelDashboardPage />} />

            {/* 텍스트 편집기 */}
            <Route path="/novels/:id/editor" element={<EditorPage />} />

            {/* 캐릭터 관리 */}
            <Route path="/novels/:id/characters" element={<CharacterPage />} />

            {/* 세계관 관리 */}
            <Route path="/novels/:id/worlds" element={<WorldPage />} />

            {/* 세계지도 관리 */}
            <Route path="/novels/:id/maps" element={<MapPage />} />

            {/* 타임라인 관리 */}
            <Route path="/novels/:id/timelines" element={<TimelinePage />} />

            {/* AI 글쓰기 */}
            <Route path="/novels/:id/ai-writing" element={<AIWritingPage />} />

            {/* 결제/구독 */}
            <Route path="/payment" element={<PaymentPage />} />

            {/* 협업 */}
            <Route
              path="/novels/:id/collaboration"
              element={<CollaborationPage />}
            />

            {/* 버전 관리 */}
            <Route path="/novels/:id/versions" element={<VersionPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
