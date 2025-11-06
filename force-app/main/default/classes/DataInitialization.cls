public class DataInitialization {
    
    public static void initializeData() {
    
    PriceBook2 standartPriceBook = [SELECT Id FROM PriceBook2
                               WHERE IsStandard = true LIMIT 1];
Id priceBookId = standartPriceBook.Id;

Set<Id> productIdsWithPrice = new Set<Id>();
for(PriceBookEntry pbe : [SELECT Product2Id FROM PriceBookEntry 
                          WHERE PriceBook2Id = :priceBookId]) {
    productIdsWithPrice.add(pbe.Product2Id);
}

List<Product2> allProducts = [SELECT Id FROM Product2];

List<PriceBookEntry> entriesToCreate = new List<PriceBookEntry>();

for(Product2 p2 : allProducts) {
    
    if(!productIdsWithPrice.contains(p2.Id)) {
    PriceBookEntry newEntry = new PriceBookEntry();
    newEntry.PriceBook2Id = priceBookId;
    newEntry.Product2Id = p2.Id;
    newEntry.UnitPrice = 210.0;
    newEntry.IsActive = true;
    entriesToCreate.add(newEntry);
}
}
if(!entriesToCreate.isEmpty()) {
    insert entriesToCreate;

System.debug(entriesToCreate.size() + ' new entries were successfull created.');
    } else {
        System.debug('No new book entries found create. All products already have a price.');
    }
  }
}