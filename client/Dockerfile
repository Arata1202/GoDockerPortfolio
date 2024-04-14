# Node.jsイメージ
FROM node:latest as build

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# アプリケーションのビルド
RUN npm run build

# 軽量なイメージに変更
FROM nginx:alpine

# Nginxの設定をコピー
COPY --from=build /app/build /usr/share/nginx/html

# ポートを公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
