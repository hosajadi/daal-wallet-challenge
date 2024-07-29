#!/bin/bash
npx prisma generate
npx prisma db seed
npx prisma migrate deploy
yarn run start:prod
