/* This is the data the Adbulkpurchase_query.jsx draws from. Will be deprecated once backend is connected */
export const BulkPurchaseQuery = [
  {
    Merchant_Name: "ABC Supplies",
    Item_name: "Elephant Food",
    Bulk_cost: "$234.50",
    Amount_of_items: 500,
    Date_purchased: "11/12/2024",
    Producer: "Nature's Best",
  },
  {
    Merchant_Name: "XYZ Wholesale",
    Item_name: "Giraffe Pellets",
    Bulk_cost: "$120.75",
    Amount_of_items: 300,
    Date_purchased: "11/15/2024",
    Producer: "Farm Fresh",
  },
  {
    Merchant_Name: "Green Distributors",
    Item_name: "Zebra Hay",
    Bulk_cost: "$95.20",
    Amount_of_items: 400,
    Date_purchased: "11/18/2024",
    Producer: "Nature's Best",
  },
  {
    Merchant_Name: "Animal Supply Co.",
    Item_name: "Penguin Fish",
    Bulk_cost: "$305.10",
    Amount_of_items: 200,
    Date_purchased: "11/22/2024",
    Producer: "Ocean Harvest",
  },
  {
    Merchant_Name: "Wildlife Foods",
    Item_name: "Bear Berries",
    Bulk_cost: "$180.45",
    Amount_of_items: 150,
    Date_purchased: "11/25/2024",
    Producer: "Forest Fresh",
  },
  {
    Merchant_Name: "Eco Farm Ltd.",
    Item_name: "Monkey Bananas",
    Bulk_cost: "$76.30",
    Amount_of_items: 600,
    Date_purchased: "11/28/2024",
    Producer: "Tropical Delights",
  },
];

/**
 * Function to get unique values for dropdowns
 * ✅ Ensures `Merchant_Name`, `Item_name`, and `Producer` values are unique
 */
export const getUniqueBulkPurchaseValues = () => {
  const uniqueMerchantNames = [...new Set(BulkPurchaseQuery.map((entry) => entry.Merchant_Name))];
  const uniqueItemNames = [...new Set(BulkPurchaseQuery.map((entry) => entry.Item_name))];
  const uniqueProducers = [...new Set(BulkPurchaseQuery.map((entry) => entry.Producer))];

  return { uniqueMerchantNames, uniqueItemNames, uniqueProducers };
};

export default BulkPurchaseQuery;
