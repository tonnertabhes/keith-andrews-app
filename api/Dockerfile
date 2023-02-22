FROM golang AS Production

ENV GO_ENV=production

WORKDIR /usr/src/api

COPY go.mod .

COPY . .

RUN go run main.go

CMD ["sh", "-c", "go run main.go"]