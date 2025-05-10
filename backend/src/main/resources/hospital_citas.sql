-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: hospital_citas
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `activa` bit(1) NOT NULL,
  `consultorio_id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  `horario_consulta` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `paciente_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_doctor_horario` (`doctor_id`,`horario_consulta`),
  UNIQUE KEY `UK_consultorio_horario` (`consultorio_id`,`horario_consulta`),
  KEY `FKnqrsxxcuysfcxiekvixm7h8r1` (`paciente_id`),
  CONSTRAINT `FKa0culq17omm7ln12kktrip4em` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`),
  CONSTRAINT `FKii45k48batxulockxh03nhobf` FOREIGN KEY (`consultorio_id`) REFERENCES `consultorios` (`id`),
  CONSTRAINT `FKnqrsxxcuysfcxiekvixm7h8r1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultorios`
--

DROP TABLE IF EXISTS `consultorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultorios` (
  `numero_consultorio` int NOT NULL,
  `piso` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ms9e6879jc7i104ay0lg47flw` (`numero_consultorio`),
  CONSTRAINT `consultorios_chk_1` CHECK ((`piso` >= 1))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultorios`
--

LOCK TABLES `consultorios` WRITE;
/*!40000 ALTER TABLE `consultorios` DISABLE KEYS */;
INSERT INTO `consultorios` VALUES (101,1,1),(102,1,2),(201,2,3),(202,2,4),(301,3,5);
/*!40000 ALTER TABLE `consultorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctores`
--

DROP TABLE IF EXISTS `doctores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `apellido_materno` varchar(255) DEFAULT NULL,
  `apellido_paterno` varchar(255) DEFAULT NULL,
  `especialidad` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctores`
--

LOCK TABLES `doctores` WRITE;
/*!40000 ALTER TABLE `doctores` DISABLE KEYS */;
INSERT INTO `doctores` VALUES (1,'Pérez','García','Medicina Interna','Juan'),(2,'Sánchez','López','Medicina Interna','María'),(3,'Rodríguez','Martínez','Medicina Interna','Roberto'),(4,'González','Hernández','Medicina Interna','Ana'),(5,'Torres','Ramírez','Medicina Interna','Carlos');
/*!40000 ALTER TABLE `doctores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `apellidos` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,'Sánchez Gómez','Pedro'),(2,'Martínez López','Laura'),(3,'González Ruiz','Miguel'),(4,'Rodríguez Flores','Isabel'),(5,'Pérez García','José');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-09 18:33:33
