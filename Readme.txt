App Store Scraper

The database used for this application is sqlite with prisma. Below are the step by step instructions to setup the database.    

a.) Installing SQLite & Prisma

npm install -g sqlite3 (or) npm install sqlite3

npm install -g prisma (or) npm install prisma

b.) Initialize Prisma in the backend directory.

npx prisma init

c.) configure the database connection in prisma/schema.prisma which should look like below

database db {
	provider = “sqlite”
	url = env(“DATABASE_URL”). ==> (navigate to .env and change the value to “file:./dev.db” as it might have been initialized with the connection string for postgre) 
}

d.) Define the model for App as below which prisma will use to create the migration and create the table.

model App {
    id                BigInt
    appId          String      @unique
    title String
    released DateTime
    updated DateTime
    collection String    
    createdDate      DateTime @default(now())
    updatedDate      DateTime @default(now())
}

e.) Once added in terminal we need to generate and apply migration which will ask for a migration name once the below command is run. Input a name like MyMigration which should do it.

npx prisma migrate dev


f.) Once applied next comes generation of prisma client

npx prisma generate


g.) Once generated it can be used in the server.py via the following and which is already setup.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();









