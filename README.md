# Project Overview

This project uses Postgres as the database and Prisma as the ORM. You can find all defined models (tables) and enums in `/prisma/schema.prisma`.

## Key Features

- **GraphQL API:** Implemented instead of RESTful API for additional scores as the challenge requirements.
- **Database Migration:** Created migration files to maintain the history of the database schema creation.
- **Seeding:** Implemented a seed program to populate the database with a default user.
- **User Authentication and Authorization:** Complete implementation using Passport strategy and JWT. Includes logic for:
    - **Mutations:**
        - `signupCheckOut`: Check if a user is registered
        - `registerASignup`: Register a user
        - `signupWithCode`: Finalize signup with an OTP code sent to the phone number
        - `loginWithPassword`: Log in with a password
        - `loginCheckoutWithCode`: Check if a user wants to log in with an OTP code
        - `loginWithCode`: Log in with an OTP code
        - `refreshToken`: Refresh authentication tokens

- **Payment (Wallet) mutation and query**
    - **Query:**
        - `getBalance`: to get user balance

    - **Mutation:**
        - `addMoney`: to add positive or negative value to the user

## How to run the project:
It’s critical that you have a `.env` file configured similarly to `.env.example`, where we defined all the required parameters to run the server.
The two critical parts of the project parameters are related to the database and the Redis cache.
**Keep in mind that if you don’t provide any Redis instances for the cache, it will use memory as the temporary cache**, and the project will not crash, so it’s up to you to use Redis or not.

### Steps to run the project
- #### Option 1: Using Your Own Database:
  1- Update the `DATABASE_URL` in the `.env` file with your parameters.

  2- Run these instruction one by one:
  ```sh 
  yarn install
  yarn migrate:deploy
  yarn seed
  yarn start:dev
  ```
- #### Option 2: Running Postgres and Redis Separately
  ```sh
  yarn install
  ```
  To run a postgres instance using docker you can run one of these instruction
  ```sh
  docker run --name daal -e POSTGRES_USER=daal -e POSTGRES_PASSWORD=topsecret_for_daal -e POSTGRES_DB=daal -p 5438:5432 -d postgres
  ```
  or
  ```sh
  yarn run docker:db
  ```
  To run a Redis instance you can use this instruction:
  ```sh
  yarn run docker:redis 
  ```
  Please keep in mind that The running the Redis instance is optional.  
  and finally run these instruction one by one:
  ```sh
  yarn migrate:deploy
  yarn seed
  yarn start:dev
  ```
- #### Option 3: Running the Whole Project with Docker Compose
  Update DB_HOST and DB_PORT in the .env file as per the comments.  
  Run this instruction:
  ```sh
  docker compose build
  docker compose up -d
  ```



## Testing

Eight tests have been written for the payment part and the cron service, which can be executed with:

```sh
yarn run test:watch
```


**<span style="color: orange;">Notices</span>**
<span style="color: orange;">
1. **SMS Service:** Due to the absence of an SMS service, if you choose "localhost" or "stage" as the environment in the `.env` file, all users with phone numbers starting with "0900000" will have "11111" as the OTP code for signing and logging in.
2. **Default User:** When seeding the database, it creates a default user with the following credentials:
- Phone Number: `09000001111`
- Password: `adminadmin`
  </span>

