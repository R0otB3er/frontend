import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store";

export function MerchStockView() {
  const navigate = useNavigate();
  const [merchStock, setMerchStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const { user_type } = useUserStore();

  useEffect(() => { 
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getMerchandiseStock`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }, 
        });
        
        const data = await response.json();
        setMerchStock(data.rows || []);
        console.log("Merchandise data:", data);
        
      } catch (err) {
        console.error("Error fetching merchandise data:", err);
        setMerchStock([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (merch_ID) => {
    // Only navigate if user is admin
    if (user_type === "admin") {
      navigate(`/admin/Merchandise_Edit/${merch_ID}`);
    }
  };

  const getRowClasses = () => {
    // Add cursor pointer only for admin users
    return user_type === "admin" 
      ? "hover:bg-blue-gray-50 cursor-pointer" 
      : "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading merchandise stock...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Merchandise Stock
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Name", "Price", "Cost", "Current Stock", "Profit"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {merchStock.map((item) => {
                const profit = (parseFloat(item.price) - parseFloat(item.cost)).toFixed(2);
                
                return (
                  <tr 
                    key={item.merch_ID}
                    onClick={() => handleRowClick(item.merch_ID)}
                    className={getRowClasses()}
                  >
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {item.merch_ID}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {item.name}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        ${item.price}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        ${item.cost}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {item.current_stock}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        ${profit}
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

export default MerchStockView;