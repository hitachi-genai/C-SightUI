FROM node:20-alpine

ARG GPR_TOKEN
ENV GPR_TOKEN=$GPR_TOKEN

WORKDIR /app
COPY . .
# Expose port
EXPOSE 3000 3001
RUN npm ci

ENV GPR_TOKEN=""

CMD ["npm", "run", "dev"]
