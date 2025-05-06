FROM node:lts-alpine

WORKDIR /usr/src/app

# Copy package.json and yarn.lock first for better caching
COPY package.json yarn.lock* ./

# Copy prisma directory separately before install
COPY prisma ./prisma/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the Next.js port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "yarn db:migrate && yarn dev"]