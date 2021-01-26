FROM node:12-slim

WORKDIR /app

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
        ca-certificates \
        curl \
        fonts-liberation \
        gconf-service \
        git \
        libappindicator1 \
        libasound2 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgcc1 \
        libgconf-2-4 \
        libgdk-pixbuf2.0-0 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 libnss3 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libstdc++6 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
        lsb-release \
        wget \
        xdg-utils
RUN rm -rf /var/cache/apt/archives /var/lib/apt/lists/*

RUN groupadd -r narcissus
RUN useradd -ms /bin/bash -g narcissus narcissus
RUN chown narcissus:narcissus .

COPY --chown=narcissus:narcissus package.json package-lock.json ./
RUN npm install

COPY --chown=narcissus:narcissus . .

EXPOSE 8687
CMD ["/bin/bash", "docker-entrypoint.sh"]
