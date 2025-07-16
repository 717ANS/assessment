-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "weight" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "SubSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    CONSTRAINT "SubSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "weight" REAL NOT NULL,
    "subSectionId" INTEGER NOT NULL,
    CONSTRAINT "Question_subSectionId_fkey" FOREIGN KEY ("subSectionId") REFERENCES "SubSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
