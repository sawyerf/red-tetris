FROM node:latest AS front-build
WORKDIR /app
COPY front/ ./front/
RUN cd front && npm i && npm run build

FROM node:latest AS back-build
WORKDIR /server
COPY --from=front-build /app/front/dist ./front/dist
COPY back/ ./back/
RUN cd back && npm i && npm run build

EXPOSE 3000

CMD ["node", "./back/app.js"]