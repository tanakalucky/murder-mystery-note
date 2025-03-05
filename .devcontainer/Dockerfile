FROM oven/bun:latest

RUN apt-get update && \
    apt-get install -y git vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
CMD ["/bin/bash"]
