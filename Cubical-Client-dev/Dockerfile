FROM node:16-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . ./

# build arguments
ARG REACT_APP_APPINSIGHTS_KEY
ARG REACT_APP_CACHE_TIME_MINUTES
ARG REACT_APP_CLIENT_ID
ARG REACT_APP_REDIRECT_URL
ARG REACT_APP_SERVICE_API
ARG REACT_APP_TENANT_ID
ARG SKIP_PREFLIGHT_CHECK

# environment variables
ENV WEBSITES_ENABLE_APP_SERVICE_STORAGE false
ENV NODE_ENV production
ENV PORT 3000

# build for production
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

# copy from the dist folder of the build stage
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/build /usr/share/nginx/html


EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]