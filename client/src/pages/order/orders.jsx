import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createOrders, deleteOrder, getOrders, editOrder } from "@/store/order-slice";
import Header from "@/components/common/header";
import notFound from "../../assets/not-found.png";
import axios from "axios";

// Fallback DatePicker Component using an Input of type "date"
function DatePicker({ selected, onChange }) {
  const formattedValue = selected ? new Date(selected).toISOString().split("T")[0] : "";
  return (
    <Input 
      type="date" 
      value={formattedValue} 
      onChange={(e) => onChange(new Date(e.target.value))} 
    />
  );
}

function OrdersTable() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const loading = useSelector((state) => state.order.isLoading);
  const [refresh, setRefresh] = useState(false);
  const [materialsData, setMaterialsData] = useState([]);
  const [workstationData, setWorkstationData] = useState([]);
  const [open, setOpen] = useState(false);
  const {user} = useSelector(state => state.auth)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = orders ? Math.ceil(orders.length / pageSize) : 1;
  const paginatedOrders = orders?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // console.log(orders, "orders");
  // console.log(materialsData, "materials");
  // console.log(workstationData, "workstations");
  // console.log(user,"user")

  const fetchMaterialsData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}api/materials/`);
      setMaterialsData(response?.data?.materials);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWorkstationData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}api/workstation`);
      // console.log(response);
      setWorkstationData(response?.data?.workstation);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMaterialsData();
    fetchWorkstationData();
  }, []);

  const [filters, setFilters] = useState({
    status: "Planned",
    workstation: "Welding",
  });
  const [newOrder, setNewOrder] = useState({
    productName: "",
    quantity: "",
    workstationId: "",
    priority: "",
    endDate: "",
    materialsUsed: []
  });

  useEffect(() => {
    setNewOrder({
      productName: "",
      quantity: "",
      workstationId: "",
      priority: "",
      endDate: "",
      materialsUsed: []
    });
  }, [open]);

  useEffect(() => {
    dispatch(
      getOrders({ status: filters.status, workstation: filters.workstation })
    );
  }, [dispatch, filters.status, filters.workstation, refresh]);

  const isDelayed = (endDate) => new Date(endDate) < new Date();

  const handleDeleteOrder = async (id) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('token'));
      dispatch(deleteOrder({ id, token })).then((data) => {
        if (data?.payload?.success) {
          toast.success("Order Deleted!");
          setRefresh(prev => !prev);
        } else {
          toast.error(data.payload?.message || "Error deleting order!");
        }
      });
    } catch (error) {
      toast.error("Error deleting order!");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      dispatch(editOrder({ id, status: newStatus })).then((data) => {
        if (data?.payload?.success) {
          toast.success("Order Status Updated!");
          setRefresh(prev => !prev);
        } else {
          toast.error("Failed to update status");
        }
      });
    } catch (error) {
      toast.error("Error updating status!");
    }
  };

  const addOrder = async () => {
    setOpen(false);
    try {
      const token = JSON.parse(sessionStorage.getItem('token'));
      dispatch(
        createOrders({ formdata: newOrder, token })
      ).then((data) => {
        if (data?.payload?.success) {
          toast.success("Order Created Successfully");
          setRefresh(prev => !prev);
        } else {
          toast.error(data.payload?.message || "Error creating order");
        }
      });
    } catch (error) {
      toast.error("Error adding order!");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-7xl mx-auto relative w-full overflow-auto">
        <h1 className="text-2xl font-semibold mb-4">Orders Management</h1>
        <div className="flex flex-wrap gap-4 mb-4 justify-center">
          <Select
            value={filters.status}
            onValueChange={(val) => setFilters({ ...filters, status: val })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="In Production">In Production</SelectItem>
              <SelectItem value="Quality Check">Quality Check</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.workstation}
            onValueChange={(val) =>
              setFilters({ ...filters, workstation: val })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Workstation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Welding">Welding</SelectItem>
              <SelectItem value="Assembly">Assembly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading && <p>Loading orders...</p>}

        <div className="overflow-x-auto flex">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Workstation</TableHead>
                <TableHead>Materials</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>End Date</TableHead>
                {user.role === "Manager" ? <TableHead>Actions</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders && orders.length > 0 ? (
                <>
                  {paginatedOrders?.map((order) => {
                    const workstation = workstationData.find(eachItem => eachItem._id === order.workstationId);
                    
                    return (
                      <TableRow
                        key={order._id}
                        className={isDelayed(order.endDate) ? "bg-red-100" : ""}
                      >
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{workstation?.name}</TableCell>
                        <TableCell>
                          {order.materialsUsed.map((mat, index) => {
                            const material = materialsData.find(eachItem => eachItem._id === mat.materialId);
                            return (
                              <div key={mat.materialId}>
                                {material?.name} - {mat.quantity}
                                {index !== order.materialsUsed.length - 1 ? ", " : ""}
                              </div>
                            );
                          })}
                        </TableCell>
                        <TableCell>{order.priority}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">{order.status}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {['Planned', 'In Production', 'Quality Check', 'Completed'].map((status) => (
                                <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(order._id, status)}>
                                  {status}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className={isDelayed(order.endDate) ? "text-red-600 font-bold" : ""}>
                          {new Date(order.endDate).toLocaleDateString()}
                        </TableCell>
                        {user.role === "Manager" ? (
                          <TableCell>
                          <Button variant="destructive" onClick={() => handleDeleteOrder(order._id)}>
                            Delete
                          </Button>
                        </TableCell>
                        ) : null}
                        
                      </TableRow>
                    );
                  })}
                </>
              ) : (
                <>
                  <TableRow>
                    <TableCell colSpan="12" className="text-center">
                      <div className="flex justify-center items-center w-full">
                        <img alt="Not Found" src={notFound} className="w-1/3" />
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {orders && orders.length > 0 && (
          <div className="mt-4 flex justify-center items-center space-x-4">
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {
          user.role === "Manager" ? (
            <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} className="mt-4">Add Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Order</DialogTitle>
            <DialogDescription>
              Fill out the order details below:
            </DialogDescription>
            <Input
              placeholder="Product Name"
              onChange={(e) =>
                setNewOrder({ ...newOrder, productName: e.target.value })
              }
            />
            <Input
              placeholder="Quantity"
              type="number"
              onChange={(e) =>
                setNewOrder({ ...newOrder, quantity: e.target.value })
              }
            />
            <Select onValueChange={(val) => setNewOrder({ ...newOrder, priority: val })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => setNewOrder({ ...newOrder, workstationId: val })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Workstation" />
              </SelectTrigger>
              <SelectContent>
                {workstationData.map((eachItem) => (
                  <SelectItem key={eachItem._id} value={eachItem._id}>
                    {eachItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Picker for End Date */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <DatePicker 
                selected={newOrder.endDate}
                onChange={(date) => setNewOrder({ ...newOrder, endDate: date.toISOString() })}
              />
            </div>
            {/* Include Materials Used Section */}
            <div className="mt-4">
              {newOrder.materialsUsed?.map((material, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <Select
                    value={material.materialId}
                    onValueChange={(val) => {
                      const updatedMaterials = [...newOrder.materialsUsed];
                      updatedMaterials[index].materialId = val;
                      setNewOrder({ ...newOrder, materialsUsed: updatedMaterials });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialsData.map((mat) => (
                        <SelectItem key={mat._id} value={mat._id}>
                          {mat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={material.quantity}
                    onChange={(e) => {
                      const updatedMaterials = [...newOrder.materialsUsed];
                      updatedMaterials[index].quantity = e.target.value;
                      setNewOrder({ ...newOrder, materialsUsed: updatedMaterials });
                    }}
                    className="w-24"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const updatedMaterials = newOrder.materialsUsed.filter((_, i) => i !== index);
                      setNewOrder({ ...newOrder, materialsUsed: updatedMaterials });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setNewOrder({
                    ...newOrder,
                    materialsUsed: [
                      ...(newOrder.materialsUsed || []),
                      { materialId: "", quantity: "" },
                    ],
                  });
                }}
              >
                Add Material
              </Button>
            </div>

            <Button onClick={addOrder}>Submit</Button>
          </DialogContent>
        </Dialog>
          ) : null
        }
      </div>
    </>
  );
}

export default OrdersTable;
