-- Fictional cafes and sample reviews for a student prototype, not business listings.
-- Seed accounts are INACTIVE and have no usable passwords. Register a fresh account.
SET NAMES utf8mb4;
START TRANSACTION;
INSERT INTO Account (AccountID,Email,Password,Active) VALUES
 (1,'alex@example.test','!disabled-demo-account',0),
 (2,'jamie@example.test','!disabled-demo-account',0),
 (3,'sam@example.test','!disabled-demo-account',0);
INSERT INTO `User` (UserID,Name,AccountID) VALUES (1,'Alex M.',1),(2,'Jamie L.',2),(3,'Sam K.',3);
INSERT INTO Image (ImageID,Filename,Caption) VALUES
 (1,'/images/coffee.jpg','Illustrative latte photograph'),
 (2,'/images/filter.jpg','Illustrative pour-over photograph'),
 (3,'/images/coldbrew.jpg','Illustrative cold brew photograph');
INSERT INTO Product (ProductID,Name,Description,Suburb,CoffeeStyle,BeanOrigin,Roast,TastingNotes,CoffeeDescription,PriceFrom,PriceTo) VALUES
 (1,'Little Ritual Coffee','Small-batch coffee, slow mornings and a little ritual worth coming back for.','Fitzroy','Espresso + Filter','Colombia','Medium','Chocolate · orange · caramel','A balanced cup with chocolate sweetness, a gentle citrus finish and a smooth body. Try it as a flat white or a seasonal filter.',5,7),
 (2,'Northline Roasters','A quiet corner for bright filters and conversations about the next harvest.','Carlton','Filter + Specialty','Ethiopia','Light','Jasmine · peach · bergamot','A delicate, floral filter with a lingering tea-like finish. Enjoy it black to discover the changing aromatics.',5,8),
 (3,'Sunday Standard','Easy afternoons, slow-steeped coffee and a seat in the sunshine.','Melbourne CBD','Cold brew','Brazil','Medium','Cocoa · hazelnut · brown sugar','A mellow cold brew with rounded sweetness. Slowly brewed and served over ice.',5,7),
 (4,'Oak & Ember','Rich espresso and thoughtfully selected beans for your daily coffee ritual.','Richmond','Espresso','Guatemala','Medium-dark','Dark chocolate · almond · toffee','A comforting espresso with a full body and gentle sweetness, especially good with milk.',4.5,6.5),
 (5,'Morrow Coffee','Seasonal single origins and a fresh perspective on your morning cup.','Brunswick','Filter + Specialty','Kenya','Light','Blackcurrant · citrus · honey','A lively filter with juicy acidity and a clean, sweet finish. Ask about the seasonal pour-over.',5.5,8),
 (6,'Paper Cup Studio','A small neighbourhood space serving carefully balanced espresso.','Collingwood','Espresso + Specialty','Colombia','Medium','Caramel · red apple · cocoa','A versatile coffee with a silky texture and a caramel finish, served as espresso or a flat white.',5,7),
 (7,'Stillwater Coffee','A refreshing cold brew stop for warm Melbourne afternoons.','South Melbourne','Cold brew','Peru','Medium','Chocolate · dried fruit · vanilla','A smooth, low-acidity cold brew with a gently sweet finish. Served chilled without syrup.',5,7.5),
 (8,'Common Ground','Friendly service, rotating origins and something new to discover every visit.','North Melbourne','Espresso + Filter','Rwanda','Light-medium','Orange · apricot · caramel','A bright and balanced seasonal lot, with both espresso and filter brewing options.',5,8);
INSERT INTO Product_Image (ProductID,ImageID) VALUES (1,1),(2,2),(3,3),(4,1),(5,2),(6,1),(7,3),(8,2);
INSERT INTO Review (Title,Body,ProductID,UserID,Rating,AtmosphereRating,ServiceRating,Created) VALUES
 ('A new morning favourite.','Smooth, chocolatey and beautifully balanced. The flat white was my favourite, and the quiet corner made a lovely reading spot.',1,1,5,5,5,'2026-10-01 09:00:00'),
 ('Worth slowing down for.','Friendly service and a bright filter coffee. I would come back to try another bean origin.',1,2,4,4,5,'2026-10-02 10:30:00'),
 ('A delicate filter.','The floral notes came through beautifully as the coffee cooled. A lovely place to take a break.',2,2,5,4,5,'2026-10-02 11:00:00'),
 ('Lovely weekend stop.','The cold brew was smooth and refreshing. An easy afternoon coffee with a pleasant chocolate finish.',3,3,5,4,4,'2026-10-03 13:00:00'),
 ('A reliable flat white.','Rich flavour without bitterness and nicely textured milk. Friendly and quick service.',4,1,4,4,5,'2026-10-04 08:00:00'),
 ('Something a little different.','A juicy filter with bright fruit notes. The staff explained the origin and brewing choices clearly.',5,3,5,5,4,'2026-10-04 10:00:00'),
 ('A comforting cup.','Balanced espresso and a sweet caramel finish. I enjoyed the relaxed atmosphere.',6,2,4,5,4,'2026-10-05 09:00:00'),
 ('Perfect over ice.','Refreshing and mellow, with a clean finish. I would happily order this cold brew again.',7,1,4,4,5,'2026-10-05 13:00:00');
COMMIT;
