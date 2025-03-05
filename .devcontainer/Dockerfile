FROM oven/bun:latest

RUN apt-get update && \
    apt-get install -y git vim xdg-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
CMD ["/bin/bash"]
