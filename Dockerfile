FROM node:18.18.0

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build
#CMD [ "npm", "run", "start:prod" ]
CMD [ "sh", "init.sh"]
#RUN npx prisma migrate deploy

#FROM node:16
#
#WORKDIR /app
#
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package*.json ./
#COPY --from=builder /app/dist ./dist
#COPY --from=builder /app/prisma ./prisma
#COPY init.sh ./
#
#EXPOSE ${PORT}
## CMD [ "npm", "run", "start:prod" ]
#CMD ["sh", "init.sh"]
