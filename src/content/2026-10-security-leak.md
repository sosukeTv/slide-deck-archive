---
id: "2026-10-security-leak"
title: "日本で相次ぐ大規模情報漏洩・サイバー攻撃の企業別分析"
subtitle: "YouTube解説まとめ：なぜ今、日本の大企業が次々と狙われているのか？"
date: "2026-10-17"
category: "Security"
author: "Presenter"
description: "スカイチケット、焼肉きんぐ、タイムズカー、ローソン、IDCフロンティアなど、直近で発生した日本企業の大型情報漏洩・ランサムウェア被害を企業別に整理し、構造的な原因と対策を解説します。"
youtubeId: "0XIkPzDDAk8"
youtubeTitle: "誰が一番抜かれるか？日本は今なぜここまで狙われるのか"
tags: ["情報漏洩", "サイバー攻撃", "日本企業", "ランサムウェア", "AI悪用"]
---

# 日本で相次ぐ大規模情報漏洩の分析
### なぜ今、日本の有名企業が次々と狙われているのか？

<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
  <div class="p-6 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80">
    <div class="text-xs font-bold text-zinc-500 mb-1">直近数週間の被害企業</div>
    <div class="text-3xl sm:text-4xl font-extrabold text-rose-600">20社以上</div>
    <div class="text-xs text-zinc-500 mt-1">鉄道・流通・旅行・外食・大学</div>
  </div>
  <div class="p-6 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80">
    <div class="text-xs font-bold text-zinc-500 mb-1">漏洩・懸念される個人情報</div>
    <div class="text-3xl sm:text-4xl font-extrabold text-zinc-900">数千万件超</div>
    <div class="text-xs text-zinc-500 mt-1">免許証・パスポート画像含む</div>
  </div>
  <div class="p-6 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80">
    <div class="text-xs font-bold text-zinc-500 mb-1">2026年1〜9月 被害件数</div>
    <div class="text-3xl sm:text-4xl font-extrabold text-zinc-900">600件突破</div>
    <div class="text-xs text-zinc-500 mt-1">すでに前年1年間の総数を超過</div>
  </div>
</div>

> 「かつての単発的な被害という“波”が、現在は業界全体を飲み込む“津波（サイバー非常事態）”へと変化している」

---

<div class="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200">
  <div class="flex items-center space-x-4">
    <div class="w-16 h-16 rounded-2xl bg-[#00a0e9] text-white flex flex-col items-center justify-center font-extrabold shadow-md shrink-0">
      <span class="text-[11px] tracking-tighter leading-none opacity-90">✈ TRAVEL</span>
      <span class="text-sm tracking-tight mt-0.5">skyticket</span>
    </div>
    <div>
      <div class="text-xs font-bold text-zinc-400">事例 ① 旅行予約プラットフォーム（株式会社アドベンチャー）</div>
      <h2 class="text-2xl sm:text-4xl font-extrabold !mb-0 !mt-0">スカイチケット（skyticket）</h2>
    </div>
  </div>
  <div class="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm sm:text-lg">
    最大 約1,464万件 漏洩の恐れ
  </div>
</div>

* **事業概要**: 航空券・ホテル・レンタカー予約を扱う国内大手旅行予約サイト
* **事故の内容**: 外部からの不正アクセスにより、大規模な顧客データベースが侵害された可能性を発表
* **漏洩懸念データ**: 氏名・生年月日・連絡先のほか、**パスポート番号・国籍等の重要情報**が含まれる可能性
* **問題点**: 旅行プラットフォームの特性上、本人確認や渡航情報など変更が難しい機密情報が集中していた

---

<div class="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200">
  <div class="flex items-center space-x-4">
    <div class="w-16 h-16 rounded-2xl bg-[#c8102e] text-white flex flex-col items-center justify-center font-extrabold shadow-md shrink-0">
      <span class="text-xs leading-none">👑</span>
      <span class="text-xs tracking-tighter mt-1">焼肉きんぐ</span>
    </div>
    <div>
      <div class="text-xs font-bold text-zinc-400">事例 ② 大手外食チェーン（株式会社物語コーポレーション）</div>
      <h2 class="text-2xl sm:text-4xl font-extrabold !mb-0 !mt-0">焼肉きんぐ（公式アプリ）</h2>
    </div>
  </div>
  <div class="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm sm:text-lg">
    約1,079万件 会員情報漏洩
  </div>
</div>

* **事業概要**: 全国展開する大人気焼肉食べ放題チェーン
* **事故の内容**: 公式アプリおよび会員システムへの不正アクセスにより、1,000万件を超える会員情報が流出
* **漏洩データ**: 会員の氏名、生年月日、性別、郵便番号、メールアドレス、電話番号など
* **問題点**: 日常的に利用する飲食店の「クーポン・予約アプリ」が、大規模な個人情報収集の標的となった象徴的事例

---

<div class="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200">
  <div class="flex items-center space-x-4">
    <div class="w-16 h-16 rounded-2xl bg-[#fed100] text-zinc-950 flex flex-col items-center justify-center font-black shadow-md border border-yellow-400 shrink-0">
      <span class="text-xs tracking-tight leading-none">Times</span>
      <span class="text-[11px] bg-zinc-950 text-[#fed100] px-1.5 py-0.5 rounded mt-1 leading-none">CAR</span>
    </div>
    <div>
      <div class="text-xs font-bold text-zinc-400">事例 ③ 国内最大手カーシェア（パーク２４株式会社）</div>
      <h2 class="text-2xl sm:text-4xl font-extrabold !mb-0 !mt-0">タイムズカー（Times CAR）</h2>
    </div>
  </div>
  <div class="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm sm:text-lg">
    約660万件（免許証画像160万件）
  </div>
</div>

* **事業概要**: 日本全国で展開する最大手カーシェアリングサービス
* **事故の内容**: Webシステムへの不正アクセスにより約660万アカウントの情報が流出。うち**約160万件は運転免許証の画像データ等**の本人確認書類を含む
* **深刻な問題点**:
  1. **退会済み会員や、申し込み途中で契約に至らなかった人のデータ**まで削除せず保持し続けていた
  2. 免許証画像（顔写真・住所・生年月日・免許証番号）の流出により、金融機関でのなりすまし等**二次被害リスクが極めて高い**

---

<div class="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200">
  <div class="flex items-center space-x-4">
    <div class="w-16 h-16 rounded-2xl bg-[#0068b7] text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
      <span class="text-[10px] tracking-widest leading-none opacity-90">STATION</span>
      <span class="text-xs tracking-wider mt-1">LAWSON</span>
    </div>
    <div>
      <div class="text-xs font-bold text-zinc-400">事例 ④ 大手コンビニエンスストア（株式会社ローソン）</div>
      <h2 class="text-2xl sm:text-4xl font-extrabold !mb-0 !mt-0">ローソン（LAWSON）</h2>
    </div>
  </div>
  <div class="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm sm:text-lg">
    215万件以上 の個人情報流出
  </div>
</div>

* **事業概要**: 全国展開する大手コンビニエンスストアチェーン
* **事故の内容**: 関連Webサービス・キャンペーンシステム等への不正アクセスにより、215万件を超える顧客個人情報が流出
* **特徴と教訓**:
  - 本社基幹システムだけでなく、委託先や周辺Webサイト・キャンペーンページ等の「弱い入り口」が突破口になりやすい
  - 複数サービスで同じID・パスワードを使い回しているユーザーへの連鎖被害が懸念される

---

<div class="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200">
  <div class="flex items-center space-x-4">
    <div class="w-16 h-16 rounded-2xl bg-zinc-900 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
      <span class="text-sm tracking-tight text-sky-400 leading-none">IDCF</span>
      <span class="text-[10px] tracking-tighter mt-1 opacity-80">CLOUD</span>
    </div>
    <div>
      <div class="text-xs font-bold text-zinc-400">事例 ⑤ クラウド基盤事業者（ソフトバンク子会社）</div>
      <h2 class="text-2xl sm:text-4xl font-extrabold !mb-0 !mt-0">IDCフロンティア（IDCFクラウド）</h2>
    </div>
  </div>
  <div class="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm sm:text-lg">
    企業・自治体 495団体 が同時停止
  </div>
</div>

* **事業概要**: ソフトバンクグループのデータセンター・クラウドインフラ提供企業
* **事故の内容**: クラウド基盤「IDCFクラウド」自体がランサムウェア攻撃を受け、利用していた**495の企業・自治体のシステムが一斉に停止**
* **深刻な問題点**:
  - 茨城県などの自治体ホームページや企業サービスが連鎖的にダウン
  - 一部環境では**「データの救出・復旧が困難であり、利用者自身のバックアップから再構築してほしい」**と発表され、クラウド丸投げの危険性が浮き彫りに

---

## ⑥ 大阪公立大学 ＆ その他の連鎖被害企業

インフラ・教育・金融・エンタメまで業種を問わず被害が拡大しています。

| ロゴ / 組織名 | 業種 | 被害規模・内容 |
| :--- | :--- | :--- |
| 🎓 **大阪公立大学** | 国公立大学 | ランサムウェア攻撃で**サーバー約500台が停止**・授業休講。学生・卒業生ら**少なくとも13万人分**の情報漏洩の恐れ |
| 🚆 **JR東日本 / JR九州** | 鉄道・交通 | 関連サービス・予約システム等への不正アクセスおよびシステム障害の波及 |
| 📈 **大和証券** | 金融・証券 | 顧客アカウントへの不正アクセス・フィッシング等の標的化により金融庁も緊急警戒 |
| 🎤 **第一興商（ビッグエコー）** | エンタメ | カラオケ会員・関連システムにおける個人情報漏洩被害 |
| 📚 **BOOKOFF / NewsPicks** | 流通・メディア | 会員情報・関連システムへの不正アクセス被害が相次いで発覚 |

---

## なぜ今、日本企業がここまで狙われるのか？

動画内で指摘されている**3つの構造的要因**と私たちの対策です。

```mermaid
flowchart LR
    A["① AIによる『日本語の壁』消滅\n自然な日本語フィッシング＆攻撃自動化"] --> D["日本企業への\n連鎖サイバー津波"]
    B["② 脆弱なレガシー環境\n不要データの長期放置・委託先の隙"] --> D
    C["③ 危機感の麻痺\n『他社も漏れているから安心』という空気"] --> D
```

1. **「日本語の壁」の崩壊とAI攻撃の低コスト化**: 生成AIとオープンソース攻撃ツールの普及で、わずか数十ドルのコストで自動化された攻撃が可能に
2. **「みんな漏れているから大丈夫」という危険な心理**: 20社以上が同時に被害を受ける中、麻痺せず自社の権限管理・不要データ削除を徹底することが不可欠
3. **個人とチームの防衛策**: パスワード使い回し厳禁・2要素認証（MFA）必須化・クラウド任せにしない独立バックアップの確保
