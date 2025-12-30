FROM public.ecr.aws/docker/library/node:24-alpine

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy dependencies first to optimize and cache the build
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

# Bring in the full app
COPY . .
RUN npm run build

# 3000 as we are keeping 3000 for website
EXPOSE 3000

CMD [ "npm", "run", "start" ]