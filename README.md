# Webアプリ リバーシゲーム開発

- ブラウザで遊べるシンプルなリバーシゲームです。
- HTML、CSS、JavaScriptのみで実装し、外部ライブラリは使用していません。
- MDNのコード規約に準拠しました。

## 1. 特徴

- 標準的な8x8のリバーシ盤
- 黒と白の交代制
- 有効な手の表示機能
- リアルタイムスコア表示
- ゲーム状態の通知（パス、勝敗判定）
- ゲームリセット機能
- 対局履歴の表示
- レスポンシブデザイン

## 2. 遊び方・操作方法

### 2.1 遊び方

1. ブラウザでHTMLファイルを開きます
2. 黒の石から始まります
3. 盤面の有効マスに石を配置します
4. 挟まれた相手の石は自動的に反転します
5. 有効な手がない場合は自動的にパスとなります
6. すべてのますが埋まるか、両プレイヤーがパスすると、ゲーム終了です

### 2.2 操作方法

1. 石を置く : 盤面の有効なマスをクリック
2. 有効な手を表示 : 「有効な手を表示」をクリック
3. ゲームをリセット : 「ゲームをリセット」ボタンをクリック

### 2.3 インストール方法

1. リポジトリをローカルにクローンするか、zipファイルをダウンロードします

```bash
git clone https://github.com/Marosuke-note/ReversiCoding
```

2. ダウンロードしたフォルダ内の以下のファイルをご確認ください

| ファイル名  | 内容             |
| ----------- | ---------------- |
| index.html  | ゲームのHTML構造 |
| reversi.css | スタイル定義     |
| reversi.js  | ゲームのロジック |

### 2.4 動作環境

以下のブラウザで動作確認済みです：

- Google Chrome（推奨）
- Microsoft Edge

## 3. 開発者向け情報

### 3.1 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)

### 3.2 ディレクトリ構成

```
ReversiCoding/
├── index.html          # メインのHTMLファイル
├── reversi.css         # スタイルシート
├── reversi.js          # ゲームロジック
├── eslint.config.js    # ESLint設定（フラット設定形式）
├── .stylelintrc.json   # Stylelint設定
├── .htmlvalidate.json  # HTML検証設定
├── .husky/             # Gitフック設定
│   └── pre-commit      # コミット前に実行されるスクリプト
├── package.json        # プロジェクト設定と依存関係
├── .gitattributes      # Git属性設定
├── .github/            # GitHub関連ファイル
│   └── workflows/      # GitHub Actions
│       └── code-quality.yml # コード品質チェックワークフロー
└── README.md           # このファイル
```

### 3.3 コードの概要

- ゲーム状態を2次元配列で管理
- イベント駆動のUI実装
- モジュール化されたゲームロジック
- 即時実行関数でのスコープ管理

### 3.4 MDN規約準拠ポイント

- セマンティックHTMLの使用
- CSS変数によるテーマ管理
- モジュール化されたJavaScript
- アクセシビリティに配慮したマークアップ
- レスポンシブデザイン
- JSDocによるコメント
- 適切なエラー処理

### 3.5 品質保証

このプロジェクトでは以下の品質保証対策を実施しています：

#### コード品質チェック

- **ESLint**: JavaScriptのコード品質とスタイルをチェック

  - 実行コマンド: `npm run lint:js`
  - 修正コマンド: `npm run lint:js`（--fixフラグ内蔵）

- **Stylelint**: CSSのコード品質とスタイルをチェック

  - 実行コマンド: `npm run lint:css`
  - 修正コマンド: `npm run lint:css`（--fixフラグ内蔵）

- **HTML Validate**: HTMLの構造と品質をチェック

  - 実行コマンド: `npm run lint:html`

- **一括実行**: すべてのリントを実行

  - 実行コマンド: `npm run lint`

- **コード整形**: Prettierによるコード整形
  - 実行コマンド: `npm run format`

#### Gitフック

- **husky**: コミット前に自動的にコード品質チェックを実行
  - pre-commitフック: コミット前にlint-stagedを実行
  - lint-staged: 変更されたファイルに対してのみリントを実行

#### 継続的インテグレーション

- **GitHub Actions**: プッシュとプルリクエスト時に自動的にコード品質チェックを実行
  - すべてのブランチで有効
  - Node.js ver20環境で実行
  - 設定ファイル: `.github/workflows/code-quality.yml`

### 3.6 今後の開発予定(やってみたい)

- AI対戦機能の追加
- 保存と再生機能
- オンライン対戦モード
- モバイル向け最適化
- テスト自動化の導入
- パフォーマンス最適化

## 4. 開発環境のセットアップ

### 4.1 必要なツール

- Node.js (v20)
- npm (v10)
- Git

### 4.2 依存関係のインストール

```bash
npm install
```

### 4.3 Gitフックの設定

huskyとlint-stagedは自動的にセットアップされます。`npm install`実行後、コミット時に変更されたファイルに対して自動的にリントが実行されるようになります。

### 4.4 開発サーバーの起動

TODO 開発用サーバー設定

静的なHTMLファイルなので、任意のWebサーバーで提供できます。簡易的には以下のようなコマンドで開発サーバーを起動できます：

```bash
# Node.jsのhttp-serverを使用する場合
npx http-server

```

## ライセンス

- このプロジェクトはコード練習用に作成しました。
- コードは自由に使用、複製、変更できますが、その際の動作保証はありません。

## 作者

Marosuke-note

- 感想やバグ報告は Issues にてお願いします。
