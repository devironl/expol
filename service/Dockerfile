FROM node:10.15.3-alpine
EXPOSE 3000 9229
COPY . /home/app
WORKDIR /home/app
RUN yarn install
CMD ./scripts/start
