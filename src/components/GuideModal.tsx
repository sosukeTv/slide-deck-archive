import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const markdownTemplate = `---
id: "2026-11-topic"
title: "11月プレゼン：タイトルを入力"
subtitle: "サブタイトル・要約"
date: "2026-11-20"
category: "Tech" # Security, Life, Tech, Trends
author: "Presenter"
description: "プレゼンの概要を2〜3行で記述します。"
youtubeId: "YouTube動画ID" # 任意（不要な場合は削除）
youtubeTitle: "関連動画のタイトル"
tags: ["キーワード1", "キーワード2"]
---

# スライド1：タイトル＆イントロ
### サブタイトル

- 発表者: 名前
- 所要時間: 約10分

> 「印象的な引用やキーメッセージをここに記載します。」

---

## スライド2：3つの重要ポイント

1. 1つ目のポイント
2. 2つ目のポイント
3. 3つ目のポイント

---

## スライド3：図解（Mermaid）

\`\`\`mermaid
flowchart LR
    A["課題"] --> B["分析・対策"]
    B --> C["チーム共有"]
\`\`\`

---

## スライド4：まとめ＆質疑応答
ご清聴ありがとうございました！
`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(markdownTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-zinc-200">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">
              新規スライドの作成方法
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Markdownファイル（.md）を1つ追加するだけで、スライドと記事が自動生成されます。
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-zinc-700 max-h-[68vh] overflow-y-auto pr-1">
          <div>
            <h3 className="font-semibold text-zinc-950 text-xs uppercase tracking-wider mb-2">
              1. Markdownファイルの追加
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-3">
              <code className="bg-zinc-100 text-zinc-900 px-1.5 py-0.5 rounded font-mono">src/content/</code> フォルダ内に新しい <code className="bg-zinc-100 text-zinc-900 px-1.5 py-0.5 rounded font-mono">.md</code> ファイルを作成します。本文中の <code className="bg-zinc-100 text-zinc-900 px-1.5 py-0.5 rounded font-mono font-bold">---</code> がスライドの区切りになります。
            </p>
            <div className="relative">
              <button
                onClick={copyTemplate}
                className="absolute top-3 right-3 flex items-center space-x-1 text-xs bg-zinc-800 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'コピー完了' : 'テンプレートをコピー'}</span>
              </button>
              <pre className="bg-zinc-950 text-zinc-200 text-xs p-4 rounded-xl overflow-x-auto font-mono max-h-56 leading-relaxed">
                {markdownTemplate}
              </pre>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100">
            <h3 className="font-semibold text-zinc-950 text-xs uppercase tracking-wider mb-2">
              2. ショートカットキー（スライド再生中）
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
              <div className="p-2.5 bg-zinc-50 rounded-lg flex justify-between">
                <span>次へ / 前へ</span>
                <kbd className="font-mono text-zinc-900 font-semibold">← / → / Space</kbd>
              </div>
              <div className="p-2.5 bg-zinc-50 rounded-lg flex justify-between">
                <span>全画面切替</span>
                <kbd className="font-mono text-zinc-900 font-semibold">F</kbd>
              </div>
              <div className="p-2.5 bg-zinc-50 rounded-lg flex justify-between">
                <span>スライド一覧</span>
                <kbd className="font-mono text-zinc-900 font-semibold">O</kbd>
              </div>
              <div className="p-2.5 bg-zinc-50 rounded-lg flex justify-between">
                <span>ダーク/ライト切替</span>
                <kbd className="font-mono text-zinc-900 font-semibold">T</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
