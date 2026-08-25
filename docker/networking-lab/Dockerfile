FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    bash \
    iproute2 \
    iputils-ping \
    traceroute \
    net-tools \
    dnsutils \
    curl \
    wget \
    nano \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/student

CMD ["/bin/bash"]