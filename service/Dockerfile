# Using same node version and local macbook
FROM public.ecr.aws/docker/library/node:25

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy dependencies first to optimize and cache the build
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

# Try to resolve this security issue:
# https://app.wiz.io/p/fanapp/issues#%7E%28filters%7E%28status%7E%28equals%7E%28%7E%27OPEN%7E%27IN_PROGRESS%29%29%7Eseverity%7E%28equals%7E%28%7E%27HIGH%29%29%29%7Eissue%7E%2743861881-1f74-4908-9956-d7811e4079e5%29
RUN apt-get update && apt-get upgrade -y perl-modules-5.36

# Bring in the full app
COPY . .
RUN npm run build

# 3000 as we are keeping 3000 for website
EXPOSE 3000

CMD [ "npm", "run", "start" ]