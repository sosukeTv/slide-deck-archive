import React, { useState } from 'react';
import { X, FileText, Video, Cloud, Copy, Check } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const markdownTemplate = `---
id: "2026-11-my-topic"
title: "11월 정기 발표: 나의 주제 제목"
subtitle: "발표 부제목 또는 간략한 슬로건"
date: "2026-11-20"
category: "Tech" # Security, Life, Tech, Trends 중 선택
author: "발표자 이름"
description: "팀원들에게 전하고 싶은 핵심 내용을 2~3줄로 요약합니다."
youtubeId: "YouTube_ID_여기에" # 선택사항 (없으면 생략 가능)
youtubeTitle: "관련 영상 제목"
tags: ["키워드1", "키워드2", "주제"]
thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"
---

# 슬라이드 1: 타이틀 및 인트로
### 팀원들과 함께 나누는 이번 달 이야기

- 발표자: 본인 이름
- 소요 시간: 약 10분

> "핵심 명언이나 인상적인 문구를 여기에 적어보세요."

---

## 슬라이드 2: 핵심 포인트 3가지
발표할 내용을 자유롭게 정리합니다:

1. 첫 번째 주요 포인트
2. 두 번째 주요 포인트
3. 세 번째 주요 포인트

---

## 슬라이드 3: 시각화 다이어그램 (Mermaid)
텍스트만으로 복잡한 구조는 다이어그램으로 시각화할 수 있습니다:

\`\`\`mermaid
flowchart LR
    A[아이디어] --> B[기획 및 정리]
    B --> C[슬라이드 자동 생성]
    C --> D[팀원 공유 성공!]
\`\`\`

---

## 슬라이드 4: 마무리 및 질문
경청해 주셔서 감사합니다! 자유롭게 질문해 주세요.
`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(markdownTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              새 발표 자료 추가 & 무료 호스팅 가이드
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              코딩 없이 마크다운 파일 하나로 발표 슬라이드와 웹 문서를 동시에 발행할 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-slate-700 max-h-[70vh] overflow-y-auto pr-1">
          {/* Step 1 */}
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>1단계: 새 발표 마크다운(.md) 파일 만들기</span>
            </h3>
            <p className="text-xs text-blue-800 leading-relaxed mb-3">
              <code className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-mono text-xs">src/content/</code> 폴더 안에 <code className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-mono text-xs">YYYY-MM-주제.md</code> 파일을 만들고 아래 템플릿을 붙여넣으세요. 슬라이드 구분은 <code className="bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-mono font-bold">---</code> 기호로 자동 분할됩니다!
            </p>
            <div className="relative">
              <button
                onClick={copyTemplate}
                className="absolute top-2 right-2 flex items-center space-x-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? '복사됨!' : '템플릿 복사'}</span>
              </button>
              <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-xl overflow-x-auto font-mono max-h-48 leading-relaxed">
                {markdownTemplate}
              </pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
            <h3 className="font-bold text-rose-900 flex items-center space-x-2 mb-2">
              <Video className="w-4 h-4 text-rose-600" />
              <span>2단계: 유튜브 영상 연동 및 시각화</span>
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              * 마크다운 상단 <code>youtubeId: "비디오ID"</code>를 입력하면 발표 문서 상단에 16:9 유튜브 플레이어가 자동 탑재됩니다.<br />
              * 본문 안에서도 <code>```mermaid</code> 블록을 쓰면 복잡한 흐름도나 아키텍처가 깔끔한 다이어그램으로 자동 시각화됩니다.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <h3 className="font-bold text-emerald-900 flex items-center space-x-2 mb-2">
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span>3단계: Vercel 또는 Cloudflare에 0원(무료) 배포하기</span>
            </h3>
            <ol className="list-decimal list-inside text-xs text-emerald-800 space-y-1.5 leading-relaxed">
              <li>현재 프로젝트 폴더를 본인의 <strong>GitHub</strong> 저장소(Private 또는 Public)에 푸시합니다.</li>
              <li><strong><a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline font-bold">Vercel.com</a></strong>에 무료 가입 후 <strong>"Add New Project"</strong> 클릭</li>
              <li>해당 저장소를 선택하고 <strong>"Deploy"</strong> 버튼을 누르면 끝! (1분 내 무료 도메인 제공)</li>
              <li>도쿄 엣지 CDN을 통해 일본 현지에서도 0.1초만에 번개처럼 접속됩니다.</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
