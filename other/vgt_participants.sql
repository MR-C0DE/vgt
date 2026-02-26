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
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_submit_id` varchar(12) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `age_category` enum('adult','child','toddler','baby') NOT NULL,
  `contribution` varchar(255) DEFAULT NULL,
  `medical_issues` enum('no','yes','private') NOT NULL DEFAULT 'no',
  `medical_details` text,
  `is_driver` tinyint(1) NOT NULL,
  `has_space` tinyint(1) DEFAULT NULL,
  `capacity` int DEFAULT '0',
  `vehicle` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `accompagnant_is_driver` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participants`
--

LOCK TABLES `participants` WRITE;
/*!40000 ALTER TABLE `participants` DISABLE KEYS */;
INSERT INTO `participants` VALUES (5,'VCQ1REEWHS91','Andre','Mulaja','adult','','no','',0,0,2,'Toyota','372928939288392',0,'2025-07-14 04:14:03'),(6,'AIWKC1R8FQKW','Philippe','Ngisulu','adult','Juice, Sandwiches, Chips','private','',1,1,2,'Kia Cadenza (silver)','(613)501-5764',0,'2025-07-20 12:03:20'),(7,'OHWHQVZM0E1S','Sr Brigitte','Mbuyamba','adult','Beignets','no','',0,0,0,'','',0,'2025-07-22 00:01:07'),(8,'ZIZ0PMUOC5YL','Audrey','Cita','adult','','no','',1,1,3,'Hyundai Veloster 2016','6138971834',0,'2025-07-23 00:34:59'),(9,'Z9EC84AR7Q3B','Fr Jean-Claude','Dupuy','adult','watermelon, popsicles, drinks','no','',1,0,0,'Mercedes Bentz 2018','6133229508',0,'2025-07-23 03:17:21'),(10,'UMGK1D25AZ2B','Clara','Mwenge','adult','Collation','no','',0,0,0,'','',0,'2025-07-24 00:11:48'),(11,'V4SRHPUSC9XU','Rosette','Faliala','adult','','no','',0,0,0,'','',0,'2025-07-24 00:13:40'),(13,'OHWHQVZM0E1S','Soeur Brigitte','Mbuyamba','adult','Beignets','no','',1,1,3,'Ford','8193291225',0,'2025-07-24 03:02:51'),(14,'TJOI2PZDPB70','Ngoy','Matendo','toddler','','private','',0,0,0,'','',0,'2025-07-24 23:38:33'),(16,'O44ELX0W54NE','Gandhi','Kabamba','adult','','no','',1,0,0,'Mercedes B200 2009','613-797-8736',0,'2025-07-28 00:33:31'),(17,'13HYHMWKAEP5','Pascal','Kabongo','adult','100','no','',0,0,0,'','6133023542',1,'2025-07-28 16:59:15'),(18,'VU6ZIWH9PDBX','Alix','Louis Charles','adult','','no','',1,0,0,'Honda HRV 2013','4388732673',0,'2025-07-29 14:33:09');
/*!40000 ALTER TABLE `participants` ENABLE KEYS */;
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
