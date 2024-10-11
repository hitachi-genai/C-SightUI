FROM node:20-alpine AS builder

ARG GPR_TOKEN
ENV GPR_TOKEN=$GPR_TOKEN

COPY . .
RUN npm ci
RUN npm run build

ENV GPR_TOKEN=""


FROM nginx:1.25.3

COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./dist /usr/share/nginx/html
# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
