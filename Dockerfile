FROM node:20-bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      bash \
      ca-certificates \
      curl \
      dnsutils \
      iproute2 \
      iputils-ping \
      net-tools \
      traceroute \
      iw \
      wireless-tools && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN useradd \
      --create-home \
      --shell /bin/bash \
      student

RUN chown -R student:student /app /home/student

USER student

ENV NODE_ENV=production

EXPOSE 10000

CMD ["./node_modules/.bin/tsx", "terminal-server.ts"]