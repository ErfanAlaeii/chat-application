-- AlterTable
ALTER TABLE `Message` ADD COLUMN `fileUrl` VARCHAR(191) NULL,
    MODIFY `content` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `_MessagesRead` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_MessagesRead_AB_unique`(`A`, `B`),
    INDEX `_MessagesRead_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MessagesRead` ADD CONSTRAINT `_MessagesRead_A_fkey` FOREIGN KEY (`A`) REFERENCES `Message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MessagesRead` ADD CONSTRAINT `_MessagesRead_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
