FROM node:12.7-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies. Don't copy package-lock as that could have potential local modifications
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "start" ]
