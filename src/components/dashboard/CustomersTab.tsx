"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  Star,
  Wine,
  DollarSign,
  Edit,
  Trash2,
  MessageSquare,
  Users,
  TrendingUp,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalSpent: number;
  eventsAttended: number;
  averageRating: number;
  lastVisit: string;
  preferredWineType: string;
  notes: string;
  status: "active" | "inactive" | "vip";
}

export default function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Wine Street, Napa, CA 94558",
      joinDate: "2024-01-15",
      totalSpent: 1250,
      eventsAttended: 8,
      averageRating: 4.8,
      lastVisit: "2024-07-20",
      preferredWineType: "Cabernet Sauvignon",
      notes:
        "Loves bold reds, prefers intimate tastings. Regular at weekend events.",
      status: "vip",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@businessmail.com",
      phone: "+1 (555) 987-6543",
      address: "456 Corporate Blvd, San Francisco, CA 94102",
      joinDate: "2024-02-20",
      totalSpent: 2100,
      eventsAttended: 12,
      averageRating: 4.6,
      lastVisit: "2024-07-18",
      preferredWineType: "Pinot Noir",
      notes:
        "Corporate event coordinator. Books team building events quarterly.",
      status: "vip",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.r@gmail.com",
      phone: "+1 (555) 456-7890",
      address: "789 Valley Road, Sonoma, CA 95476",
      joinDate: "2024-03-10",
      totalSpent: 680,
      eventsAttended: 4,
      averageRating: 4.2,
      lastVisit: "2024-07-15",
      preferredWineType: "Chardonnay",
      notes: "New to wine, enjoys educational events. Prefers white wines.",
      status: "active",
    },
    {
      id: "4",
      name: "Robert Williams",
      email: "robert.w@email.com",
      phone: "+1 (555) 234-5678",
      address: "321 Oak Avenue, Healdsburg, CA 95448",
      joinDate: "2023-11-05",
      totalSpent: 3200,
      eventsAttended: 18,
      averageRating: 4.9,
      lastVisit: "2024-07-22",
      preferredWineType: "Bordeaux Blend",
      notes:
        "Wine collector and enthusiast. Attends premium tastings regularly.",
      status: "vip",
    },
    {
      id: "5",
      name: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      phone: "+1 (555) 345-6789",
      address: "654 Vine Lane, St. Helena, CA 94574",
      joinDate: "2024-06-01",
      totalSpent: 420,
      eventsAttended: 2,
      averageRating: 4.0,
      lastVisit: "2024-06-25",
      preferredWineType: "Rosé",
      notes: "Recent member, enjoys casual tastings with friends.",
      status: "active",
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    preferredWineType: "",
    notes: "",
  });

  const handleCreateCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) return;

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      joinDate: new Date().toISOString().split("T")[0],
      totalSpent: 0,
      eventsAttended: 0,
      averageRating: 0,
      lastVisit: new Date().toISOString().split("T")[0],
      preferredWineType: newCustomer.preferredWineType,
      notes: newCustomer.notes,
      status: "active",
    };

    setCustomers([...customers, customer]);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      preferredWineType: "",
      notes: "",
    });
    setIsCreateDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalCustomers = customers.length;
  const vipCustomers = customers.filter((c) => c.status === "vip").length;
  const avgSpentPerCustomer =
    customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Customer Management
          </h2>
          <p className="text-gray-600">Manage your wine enthusiast community</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer profile for your wine business
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredWineType">Preferred Wine Type</Label>
                <Select
                  value={newCustomer.preferredWineType}
                  onValueChange={(value) =>
                    setNewCustomer({ ...newCustomer, preferredWineType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wine preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cabernet Sauvignon">
                      Cabernet Sauvignon
                    </SelectItem>
                    <SelectItem value="Chardonnay">Chardonnay</SelectItem>
                    <SelectItem value="Pinot Noir">Pinot Noir</SelectItem>
                    <SelectItem value="Merlot">Merlot</SelectItem>
                    <SelectItem value="Sauvignon Blanc">
                      Sauvignon Blanc
                    </SelectItem>
                    <SelectItem value="Rosé">Rosé</SelectItem>
                    <SelectItem value="Bordeaux Blend">
                      Bordeaux Blend
                    </SelectItem>
                    <SelectItem value="Sparkling">Sparkling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                  placeholder="123 Wine Street, Napa, CA 94558"
                />
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, notes: e.target.value })
                  }
                  placeholder="Customer preferences, special requests, etc."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCustomer}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {totalCustomers}
                </p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {vipCustomers}
                </p>
                <p className="text-sm text-gray-600">VIP Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${avgSpentPerCustomer.toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Avg Spent per Customer</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>
            Search and filter your customer base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="vip">VIP Customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer List */}
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-full font-semibold">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {customer.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                          customer.status
                        )}`}
                      >
                        {customer.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phone || "No phone"}
                    </div>
                    <div className="flex items-center">
                      <Wine className="w-4 h-4 mr-2" />
                      {customer.preferredWineType || "No preference"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last visit: {customer.lastVisit}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />$
                      {customer.totalSpent.toLocaleString()} spent
                    </span>
                    <span className="flex items-center text-blue-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {customer.eventsAttended} events
                    </span>
                    <span className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-1" />
                      {customer.averageRating.toFixed(1)} rating
                    </span>
                  </div>
                  {customer.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      &ldquo;{customer.notes}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
