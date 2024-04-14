# Goビルド用のイメージ
FROM golang:latest AS builder

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピーしてモジュールをダウンロード
COPY go.mod go.sum ./
RUN go mod download
RUN go get -u github.com/joho/godotenv

# プロジェクトのファイルをコピー
COPY . .

# ビルド
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 実行用の軽量なイメージ
FROM alpine:latest

# バイナリをコピー
COPY --from=builder /app/main .

# 環境変数ファイルのコピー
COPY .env .

# ポートを公開
EXPOSE 8000

# サーバーを実行
CMD ["./main"]
