# Phlogopite
このプロジェクトは[深刻なパフォーマンスの問題](https://github.com/pluslatte/phlogopite/issues/47)があり、放棄されました！  
移動先 → https://github.com/pluslatte/calmi  
## 目標
- Firefox でちゃんと動作する（一番よく使うので）
- モバイル端末でもいい感じに動作する
- 「おすすめ」しない
- もっさりした挙動をしない
- 電池をバカ食いしない
## ビルド
```sh
pnpm run build
```
で `./build` に完成品が吐き出される
## 試運転
```sh
pnpm run dev
```
で、開発用サーバーを起動
## ホスト
`adapter-node` が入っているので、適当なマシンにクローンして
```sh
pnpm i --frozen-lockfile
pnpm run build
node build
```
とかすれば起動できる  
## メモ
```sh
pnpm dlx shadcn-svelte@latest init
```
してあります。  
参考： https://www.shadcn-svelte.com/docs  
以下初期の生成物
# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
pnpm dlx sv create

# create a new project in my-app
pnpm dlx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
