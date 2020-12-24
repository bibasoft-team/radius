FROM rediska1114/node-aws

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# COPY environments environments
COPY public public
COPY scripts scripts
COPY src src
COPY ./.env* tsconfig.json ./


RUN npm run build
RUN npm run gzip


ARG AWS_ACCESS_KEY
ARG AWS_SECRET_KEY
ARG AWS_ENDPOINT
ARG AWS_TARGET
ARG AWS_BUCKET
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_KEY}
ENV AWS_DEFAULT_REGION=ru-central1

RUN npm run deploy

