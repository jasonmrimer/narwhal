FROM jigsawdiux/ruby-golang-java-nodejs-chrome
ADD . /app
WORKDIR /app/client
RUN npm install yarn -g
RUN yarn install --no-progress
RUN yarn build
WORKDIR /app
