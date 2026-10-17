import React, { useState } from 'react';
import { X, Plus, Download, Check, Sparkles } from 'lucide-react';
import { saveCustomPresentation } from '../content';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (newId: string) => void;
}

function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  // Match standard watch?v= or youtu.be/ or embed/
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) return match[1];
  return trimmed;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onCreated }) => {
  const today = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'Security' | 'Life' | 'Tech' | 'Trends'>('Tech');
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [tagsInput, setTagsInput] = useState('共有, トレンド');
  const [bodyContent, setBodyContent] = useState(
`# スライド1：タイトル
### サブタイトルやテーマを入力

- 発表のポイント1
- 発表のポイント2

> 「印象的なキーメッセージをここに入力します」

---

## スライド2：主な内容

1. **1つ目のトピック**
   - 詳細な説明をここに記載します。
2. **2つ目のトピック**
   - 重要なキーワードをまとめます。

---

## スライド3：まとめ＆ディスカッション

- チームへの質問やまとめ
- ご清聴ありがとうございました！`
  );

  if (!isOpen) return null;

  const slideCount = bodyContent
    .replace(/\r\n/g, '\n')
    .split(/\n---\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;

  const buildRawMarkdown = (id: string) => {
    const ytId = extractYouTubeId(youtubeInput);
    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const lines = [
      '---',
      `id: "${id}"`,
      `title: "${(title || '新規プレゼンテーション').replace(/"/g, '\\"')}"`,
      subtitle ? `subtitle: "${subtitle.replace(/"/g, '\\"')}"` : '',
      `date: "${date || today}"`,
      `category: "${category}"`,
      `author: "Presenter"`,
      `description: "${(description || title || '月次プレゼンテーション資料').replace(/"/g, '\\"')}"`,
      ytId ? `youtubeId: "${ytId}"` : '',
      `tags: ${JSON.stringify(tagsArray.length > 0 ? tagsArray : ['プレゼン'])}`,
      '---',
      '',
      bodyContent.trim()
    ].filter((line) => line !== '');

    return lines.join('\n');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `${date || today}-${Math.random().toString(36).substring(2, 7)}`;
    const rawMd = buildRawMarkdown(id);
    saveCustomPresentation(id, rawMd);
    if (onCreated) onCreated(id);
    onClose();
  };

  const handleDownloadMd = () => {
    const slug = `${date || today}-slide`;
    const rawMd = buildRawMarkdown(slug);
    const blob = new Blob([rawMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertSnippet = (snippet: string) => {
    setBodyContent((prev) => `${prev.trimEnd()}\n\n${snippet}\n`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-auto border border-zinc-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950">
              新規プレゼンテーション作成
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              内容を入力して「保存して公開」を押すと、すぐにスライド再生と記事閲覧が可能になります。
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="mt-5 space-y-4 overflow-y-auto pr-1 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                タイトル <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：最近の情報漏洩事例とセキュリティ対策"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                カテゴリー
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              >
                <option value="Security">セキュリティ・社会</option>
                <option value="Life">ライフスタイル</option>
                <option value="Tech">テクノロジー</option>
                <option value="Trends">トレンド</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                概要・説明（一覧カードに表示されます）
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例：YouTube動画の要点整理とチームで実践したい対策まとめ"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                発表日
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                YouTube URL または 動画ID（任意）
              </label>
              <input
                type="text"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="セキュリティ, 日常, YouTube要約"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Slide Editor */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-zinc-700">
                スライド本文（<code className="bg-zinc-100 px-1.5 py-0.5 rounded">---</code> でページ区切り・現在 <span className="text-zinc-950 font-extrabold">{slideCount}</span> 枚）
              </label>

              {/* Quick Insert Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(`---\n\n## 新しいスライドのタイトル\n\n- ポイント1\n- ポイント2`)
                  }
                  className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-zinc-900 text-white px-2.5 py-1 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>次ページ追加 (---)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      `\`\`\`mermaid\nflowchart LR\n    A["ステップ1"] --> B["ステップ2"]\n    B --> C["結論・結果"]\n\`\`\``
                    )
                  }
                  className="inline-flex items-center space-x-1 text-[11px] font-medium bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>図解(Mermaid)挿入</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      `| 項目 | 内容 | 備考 |\n| :--- | :--- | :--- |\n| ポイントA | 説明テキスト | メモ |`
                    )
                  }
                  className="inline-flex items-center space-x-1 text-[11px] font-medium bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  <span>表(テーブル)挿入</span>
                </button>
              </div>
            </div>

            <textarea
              rows={11}
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono text-zinc-900 leading-relaxed focus:outline-none focus:border-zinc-900"
              placeholder="ここにスライド内容を入力してください..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDownloadMd}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-3.5 py-2.5 rounded-full transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.mdファイルを保存</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 rounded-full"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>保存して公開</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
