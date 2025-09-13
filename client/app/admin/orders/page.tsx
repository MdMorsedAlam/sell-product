"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi, useDelete, usePatchStatus } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { getImageUrl } from "@/hooks/useGetImage";

export default function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);

  const { data, isLoading, refetch } = useApi<any[]>(["orders"], "/orders");
  const { mutate: deleteSingleOrder } = useDelete(
    (id) => `/orders/${id}`,
    ["orders"]
  );
  const { mutate: updateOrderStatus } = usePatchStatus();
  // Function to handle status update
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      // Build the dynamic endpoint
      const endpoint = `/orders/${id}/status`;

      const payload = { status: newStatus };

      // Now call the mutation with the endpoint and payload
      await updateOrderStatus({ endpoint, data: payload });

      refetch();
      // Optionally refetch orders here or update the local state
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  useEffect(() => {
    if (data) {
      setOrders(data.reverse());
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSingleOrder(id);
      toast.success("Order deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Error deleting quiz");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <button className="text-xl font-semibold" onClick={() => refetch()}>Refresh</button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Photo</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, i) => (
            <TableRow key={order._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{order.product?.name}</TableCell>
              <TableCell>
                <img
                  className="w-12 h-12"
                  src={getImageUrl(order?.product?.imageUrl)}
                  alt={order?.product?.name}
                />
              </TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.phone}</TableCell>
              <TableCell>{order.orderDate.slice(0,10)}</TableCell>
              <TableCell>{order.address}</TableCell>
              <TableCell>{order.totalPrice}</TableCell>
              <TableCell>
                {/* Add the button or dropdown for updating the status */}
                <select
                  className={`py-2 px-3 rounded-lg ${
                    order.status === "Pending"
                      ? "bg-yellow-400"
                      : order.status === "Cancelled"
                      ? "bg-red-400"
                      : "bg-green-400"
                  }`}
                  value={order.status}
                  onChange={(e) =>
                    handleUpdateStatus(order._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </TableCell>

              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(order._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
