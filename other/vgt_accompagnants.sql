-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (x86_64)
--
-- Host: vgt.cf0wq2me40rb.ca-central-1.rds.amazonaws.com    Database: vgt
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `accompagnants`
--

DROP TABLE IF EXISTS `accompagnants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accompagnants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `participant_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `age_category` enum('adult','child','toddler','baby') NOT NULL,
  `contribution` varchar(255) DEFAULT NULL,
  `allergies` enum('no','yes','private') NOT NULL DEFAULT 'no',
  `medical_details` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_participant` (`participant_id`),
  CONSTRAINT `fk_participant` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accompagnants`
--

LOCK TABLES `accompagnants` WRITE;
/*!40000 ALTER TABLE `accompagnants` DISABLE KEYS */;
INSERT INTO `accompagnants` VALUES (5,6,'Hope','Allison','adult','Dessert','no','','2025-07-20 12:03:20'),(6,9,'Sr Rebecca ','Dupuy','adult','Sandwich, macaroni salad, ','no','','2025-07-23 03:17:21'),(7,9,'Ezekiel','Dupuy','child','','no','','2025-07-23 03:17:21'),(8,9,'Claudia ','Dupuy','child','','no','','2025-07-23 03:17:21'),(9,9,'Johanna ','Dupuy','child','','yes','Lactose ','2025-07-23 03:17:21'),(10,11,'Merveille','Kanku','adult','','no','','2025-07-24 00:13:40'),(11,11,'Dumpul','Keine','adult','','no','','2025-07-24 00:13:40'),(13,13,'Sephora','Mudingayi ','adult','','no','','2025-07-24 03:02:51'),(14,14,'Pendeza ','Ngoy ','adult','Les fuits et baignets','no','','2025-07-24 23:38:33'),(15,14,'Mateso ','Nestori ','adult','','no','','2025-07-24 23:38:33'),(16,14,'Marcelina ','Kiza ','adult','','no','','2025-07-24 23:38:33'),(17,16,'Louis ','Kabamba','adult','','no','','2025-07-28 00:33:31'),(18,16,'Esther','S','adult','','no','','2025-07-28 00:33:31'),(22,5,'Pascal','Kadima','adult','Boisson','no','','2025-07-29 16:36:49'),(23,5,'Ruth','Ndaya','adult','','no','Test','2025-07-29 16:36:49');
/*!40000 ALTER TABLE `accompagnants` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29 15:20:11
