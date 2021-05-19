# TachieSabuner

差分画像表示ツール。

## 詳細(Description)

ノベルゲーム等でよく見る、画像の差分表示をブラウザ上で確認するツールです。
動作確認用に、設定ファイル(settings.js)と差分画像(images/)が同梱されています。

docs/index.htmlをブラウザで表示して下さい(Chromeで動作確認)。
キャラクターが表示されていれば成功です。

## 機能(Features)

- ベース画像(例えば表情の無い立ち絵)は複数登録できます。
- 目や眉毛等は、左右別々に扱えます。
- 差分の状態をリストに登録し、流して確認したり比較したりできます。
- そのリストはただのテキストとして扱えるので、必要に応じてメモ帳に保存したり他人と交換できます。

## 開発者向け必要環境(Requirement)

- npm

## 開発者向けインストール方法(Installation)

    $ git clone https://github.com/vipkao/TachieSabuner
    $ npm install

    $ npm run build

## 作者(Author)

vipkao

## ライセンス(License)

[MIT](http://opensource.org/licenses/mit-license.php)
