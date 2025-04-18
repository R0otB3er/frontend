import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function BulkPurchaseHistory() {
    const navigate = useNavigate();
    const [bulkPurchases, setBulkPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
    
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/BulkPurchase/BulkPurchaseView`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            setBulkPurchases(data.data || []);
            console.log("Bulk Purchase History:", data);
    
          } catch (err) {
            console.error("Error fetching bulk purchase history:", err);
            setBulkPurchases([]);
          } finally {
            setIsLoading(false);
          }
        };

        fetchData();
      }, []);

    const handleRowClick = (purchaseId) => {
        // Navigate to edit page if needed
        // navigate(`/bulk-purchase/edit/${purchaseId}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Typography variant="h5">Loading bulk purchase history...</Typography>
            </div>
        );
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Bulk Purchase History
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["ID", "Vendor", "Item Name", "Item Type", "Quantity", "Bulk Cost", "Sale Price", "Date"].map((el) => (
                                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bulkPurchases.map((purchase) => {
                                const purchaseDate = new Date(purchase.date_purchased);
                                const formattedDate = purchaseDate.toLocaleDateString();
                                
                                return (
                                    <tr 
                                        key={purchase.Purchase_ID} 
                                        onClick={() => handleRowClick(purchase.Purchase_ID)}
                                        className="hover:bg-blue-gray-50"
                                    >
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                                                {purchase.Purchase_ID}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                                                {purchase.For_vendor}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                                                {purchase.Item_name}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                                                {purchase.Item_type}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                                                {purchase.amount_of_items}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                                                ${purchase.Bulk_cost}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                                                ${purchase.Item_sale_price}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                                                {formattedDate}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
}

export default BulkPurchaseHistory;