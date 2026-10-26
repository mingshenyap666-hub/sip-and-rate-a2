-- Sip & Rate: verified MariaDB 10.11 schema and clean demo data export.
-- Import into an empty database. No real users or test credentials are included.
/*M!999999\- enable the sandbox mode */ 

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Account` (
  `AccountID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Email` varchar(254) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Created` datetime NOT NULL DEFAULT current_timestamp(),
  `Updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`AccountID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Account` DISABLE KEYS */;
INSERT INTO `Account` VALUES
(1,'alex@example.test','!disabled-demo-account','2026-10-26 12:21:40','2026-10-26 04:21:40',0),
(2,'jamie@example.test','!disabled-demo-account','2026-10-26 12:21:40','2026-10-26 04:21:40',0),
(3,'sam@example.test','!disabled-demo-account','2026-10-26 12:21:40','2026-10-26 04:21:40',0);
/*!40000 ALTER TABLE `Account` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Favourite` (
  `UserID` int(10) unsigned NOT NULL,
  `ProductID` int(10) unsigned NOT NULL,
  `Created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UserID`,`ProductID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `Favourite_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `Favourite_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `Product` (`ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Favourite` DISABLE KEYS */;
/*!40000 ALTER TABLE `Favourite` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Image` (
  `ImageID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Filename` varchar(255) NOT NULL,
  `Caption` varchar(150) NOT NULL,
  `Created` datetime NOT NULL DEFAULT current_timestamp(),
  `Updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ImageID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Image` DISABLE KEYS */;
INSERT INTO `Image` VALUES
(1,'/images/coffee.jpg','Illustrative latte photograph','2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(2,'/images/filter.jpg','Illustrative pour-over photograph','2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(3,'/images/coldbrew.jpg','Illustrative cold brew photograph','2026-10-26 12:21:40','2026-10-26 04:21:40',1);
/*!40000 ALTER TABLE `Image` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `LoginAttempt` (
  `AttemptID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `AttemptKey` char(64) NOT NULL,
  `Created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`AttemptID`),
  KEY `attempt_window` (`AttemptKey`,`Created`),
  KEY `created_cleanup` (`Created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `LoginAttempt` DISABLE KEYS */;
/*!40000 ALTER TABLE `LoginAttempt` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product` (
  `ProductID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Description` varchar(1000) NOT NULL,
  `Brand` varchar(100) NOT NULL DEFAULT 'Independent',
  `Suburb` varchar(80) NOT NULL,
  `CoffeeStyle` varchar(80) NOT NULL,
  `BeanOrigin` varchar(80) NOT NULL,
  `Roast` varchar(40) NOT NULL,
  `TastingNotes` varchar(150) NOT NULL,
  `CoffeeDescription` varchar(1000) NOT NULL,
  `PriceFrom` decimal(6,2) NOT NULL,
  `PriceTo` decimal(6,2) NOT NULL,
  `Created` datetime NOT NULL DEFAULT current_timestamp(),
  `Updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES
(1,'Little Ritual Coffee','Small-batch coffee, slow mornings and a little ritual worth coming back for.','Independent','Fitzroy','Espresso + Filter','Colombia','Medium','Chocolate · orange · caramel','A balanced cup with chocolate sweetness, a gentle citrus finish and a smooth body. Try it as a flat white or a seasonal filter.',5.00,7.00,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(2,'Northline Roasters','A quiet corner for bright filters and conversations about the next harvest.','Independent','Carlton','Filter + Specialty','Ethiopia','Light','Jasmine · peach · bergamot','A delicate, floral filter with a lingering tea-like finish. Enjoy it black to discover the changing aromatics.',5.00,8.00,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(3,'Sunday Standard','Easy afternoons, slow-steeped coffee and a seat in the sunshine.','Independent','Melbourne CBD','Cold brew','Brazil','Medium','Cocoa · hazelnut · brown sugar','A mellow cold brew with rounded sweetness. Slowly brewed and served over ice.',5.00,7.00,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(4,'Oak & Ember','Rich espresso and thoughtfully selected beans for your daily coffee ritual.','Independent','Richmond','Espresso','Guatemala','Medium-dark','Dark chocolate · almond · toffee','A comforting espresso with a full body and gentle sweetness, especially good with milk.',4.50,6.50,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(5,'Morrow Coffee','Seasonal single origins and a fresh perspective on your morning cup.','Independent','Brunswick','Filter + Specialty','Kenya','Light','Blackcurrant · citrus · honey','A lively filter with juicy acidity and a clean, sweet finish. Ask about the seasonal pour-over.',5.50,8.00,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(6,'Paper Cup Studio','A small neighbourhood space serving carefully balanced espresso.','Independent','Collingwood','Espresso + Specialty','Colombia','Medium','Caramel · red apple · cocoa','A versatile coffee with a silky texture and a caramel finish, served as espresso or a flat white.',5.00,7.00,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(7,'Stillwater Coffee','A refreshing cold brew stop for warm Melbourne afternoons.','Independent','South Melbourne','Cold brew','Peru','Medium','Chocolate · dried fruit · vanilla','A smooth, low-acidity cold brew with a gently sweet finish. Served chilled without syrup.',5.00,7.50,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(8,'Common Ground','Friendly service, rotating origins and something new to discover every visit.','Independent','North Melbourne','Espresso + Filter','Rwanda','Light-medium','Orange · apricot · caramel','A bright and balanced seasonal lot, with both espresso and filter brewing options.',5.00,8.00,'2026-10-26 12:21:40','2026-10-26 04:21:40',1);
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product_Image` (
  `ProductID` int(10) unsigned NOT NULL,
  `ImageID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ProductID`,`ImageID`),
  KEY `ImageID` (`ImageID`),
  CONSTRAINT `Product_Image_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `Product` (`ProductID`) ON DELETE CASCADE,
  CONSTRAINT `Product_Image_ibfk_2` FOREIGN KEY (`ImageID`) REFERENCES `Image` (`ImageID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Product_Image` DISABLE KEYS */;
INSERT INTO `Product_Image` VALUES
(1,1),
(2,2),
(3,3),
(4,1),
(5,2),
(6,1),
(7,3),
(8,2);
/*!40000 ALTER TABLE `Product_Image` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Review` (
  `ReviewID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Title` varchar(80) NOT NULL,
  `Body` varchar(2000) NOT NULL,
  `ProductID` int(10) unsigned NOT NULL,
  `UserID` int(10) unsigned NOT NULL,
  `Rating` tinyint(3) unsigned NOT NULL CHECK (`Rating` between 1 and 5),
  `AtmosphereRating` tinyint(3) unsigned NOT NULL CHECK (`AtmosphereRating` between 1 and 5),
  `ServiceRating` tinyint(3) unsigned NOT NULL CHECK (`ServiceRating` between 1 and 5),
  `Created` datetime NOT NULL DEFAULT current_timestamp(),
  `Updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ReviewID`),
  UNIQUE KEY `one_review_per_user` (`ProductID`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Review_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `Product` (`ProductID`) ON DELETE CASCADE,
  CONSTRAINT `Review_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `Review` DISABLE KEYS */;
INSERT INTO `Review` VALUES
(1,'A new morning favourite.','Smooth, chocolatey and beautifully balanced. The flat white was my favourite, and the quiet corner made a lovely reading spot.',1,1,5,5,5,'2026-10-01 09:00:00','2026-10-26 04:21:40',1),
(2,'Worth slowing down for.','Friendly service and a bright filter coffee. I would come back to try another bean origin.',1,2,4,4,5,'2026-10-02 10:30:00','2026-10-26 04:21:40',1),
(3,'A delicate filter.','The floral notes came through beautifully as the coffee cooled. A lovely place to take a break.',2,2,5,4,5,'2026-10-02 11:00:00','2026-10-26 04:21:40',1),
(4,'Lovely weekend stop.','The cold brew was smooth and refreshing. An easy afternoon coffee with a pleasant chocolate finish.',3,3,5,4,4,'2026-10-03 13:00:00','2026-10-26 04:21:40',1),
(5,'A reliable flat white.','Rich flavour without bitterness and nicely textured milk. Friendly and quick service.',4,1,4,4,5,'2026-10-04 08:00:00','2026-10-26 04:21:40',1),
(6,'Something a little different.','A juicy filter with bright fruit notes. The staff explained the origin and brewing choices clearly.',5,3,5,5,4,'2026-10-04 10:00:00','2026-10-26 04:21:40',1),
(7,'A comforting cup.','Balanced espresso and a sweet caramel finish. I enjoyed the relaxed atmosphere.',6,2,4,5,4,'2026-10-05 09:00:00','2026-10-26 04:21:40',1),
(8,'Perfect over ice.','Refreshing and mellow, with a clean finish. I would happily order this cold brew again.',7,1,4,4,5,'2026-10-05 13:00:00','2026-10-26 04:21:40',1);
/*!40000 ALTER TABLE `Review` ENABLE KEYS */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `UserID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(80) NOT NULL,
  `AccountID` int(10) unsigned NOT NULL,
  `Created` datetime NOT NULL DEFAULT current_timestamp(),
  `Updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `AccountID` (`AccountID`),
  CONSTRAINT `User_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `Account` (`AccountID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES
(1,'Alex M.',1,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(2,'Jamie L.',2,'2026-10-26 12:21:40','2026-10-26 04:21:40',1),
(3,'Sam K.',3,'2026-10-26 12:21:40','2026-10-26 04:21:40',1);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

