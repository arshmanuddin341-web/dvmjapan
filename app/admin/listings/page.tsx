import { Metadata } from "next";
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { vehicles } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "Manage Listings | DVM JAPAN Admin",
};

export default function ListingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </div>
                    <div className="text-sm text-gray-600">{vehicle.stockId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary-600 hover:text-primary-700">
                      <ToggleRight className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">1,234</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:text-primary-600" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-primary-600" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-teal-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
