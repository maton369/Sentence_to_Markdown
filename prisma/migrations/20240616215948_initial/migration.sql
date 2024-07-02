-- CreateTable
CREATE TABLE "Board" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    CONSTRAINT "Board_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
