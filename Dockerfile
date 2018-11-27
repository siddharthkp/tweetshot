FROM alekzonder/puppeteer:1
COPY . /app
RUN cd /app && npm install --loglevel=warn
EXPOSE 3000
WORKDIR /app
CMD npm start
