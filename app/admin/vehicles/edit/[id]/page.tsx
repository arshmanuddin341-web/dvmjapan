"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Save, Trash2, Car, DollarSign, Gauge, Fuel, Settings, MapPin, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import { getToken } from "@/lib/api-client";

const MAKES = [
  "TOYOTA", "HONDA", "NISSAN", "MAZDA", "SUBARU", "MITSUBISHI", "SUZUKI",
  "LEXUS", "DAIHATSU", "ISUZU", "DATSUN", "INFINITI", "ACURA",
  "BMW", "MERCEDES-BENZ", "AUDI", "VOLKSWAGEN", "VOLVO", "LAND ROVER",
  "FORD", "CHEVROLET", "DODGE"
];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "MPV", "Van", "Truck", "Station Wagon", "Coupe", "Convertible", "Pickup"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "Petrol/Hybrid"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];
const LOCATIONS = [
  "Yokohama Port, Japan", "Kobe Port, Japan", "Osaka Port, Japan", "Nagoya Port, Japan",
  "Mombasa Port, Kenya", "Nairobi, Kenya",
  "Southampton Port, UK", "Tilbury Port, London (UK)", "Sheerness Port, UK", "Bristol Port, UK",
  "Laem Chabang Port, Thailand", "Bangkok, Thailand",
  "Karachi Port, Pakistan", "Durban Port, South Africa",
  "Dar es Salaam, Tanzania", "Limassol, Cyprus", "Dublin, Ireland"
];
const CONDITIONS = ["Excellent", "Very Good", "Good", "Fair", "Used"];
const GRADES = ["6", "5", "4.5", "4", "3.5", "3", "R", "RA", "S", "A", "B", "C", "D"];

const inputClass = "w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all";
const selectClass = `${inputClass} appearance-none cursor-pointer`;
const labelClass = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide";

function SectionTitle({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
        <Icon className="h-4 w-4 text-teal-600" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
    </div>
  );
}

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    stockId: "",
    make: "",
    model: "",
    year: "",
    price: "",
    priceCif: "",
    currency: "USD",
    mileage: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "",
    color: "",
    engineSize: "",
    auctionGrade: "",
    condition: "Good",
    location: "Yokohama Port",
    chassis: "",
    description: "",
    images: [] as string[],
    featured: false,
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/vehicles/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Not found"))))
      .then((v) => {
        setForm({
          stockId: v.stockId ?? "",
          make: v.make?.toUpperCase() ?? "",
          model: v.model ?? "",
          year: String(v.year ?? ""),
          price: String(v.price ?? ""),
          priceCif: v.priceCif ? String(v.priceCif) : "",
          currency: v.currency ?? "USD",
          mileage: String(v.mileage ?? ""),
          fuelType: v.fuelType ?? "Petrol",
          transmission: v.transmission ?? "Automatic",
          bodyType: v.bodyType ?? "",
          color: v.color ?? "",
          engineSize: v.engineSize ? String(v.engineSize) : "",
          auctionGrade: v.auctionGrade ?? "",
          condition: v.condition ?? "Good",
          location: v.location ?? "Yokohama Port",
          chassis: v.chassis ?? "",
          description: v.description ?? "",
          images: Array.isArray(v.images) ? v.images : [],
          featured: !!v.featured,
        });
      })
      .catch(() => setError("Vehicle not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleImagesUpload = (urls: string[]) => {
    setForm(prev => ({ ...prev, images: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const token = getToken();
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year, 10),
          price: parseFloat(form.price),
          priceCif: form.priceCif ? parseFloat(form.priceCif) : null,
          mileage: parseInt(form.mileage, 10),
          engineSize: form.engineSize ? parseFloat(form.engineSize) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update vehicle");
      }

      setSuccess("✅ Vehicle updated successfully!");
      setTimeout(() => {
        router.push("/admin/vehicles");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Loading Vehicle Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/vehicles" className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Vehicles
        </Link>
        <div className="h-5 w-px bg-slate-200" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit: {form.make} {form.model}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Stock ID: {form.stockId} • Year: {form.year}</p>
        </div>
      </div>

      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-800 text-sm font-medium">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={Car} title="Vehicle Identity" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Stock ID *</label>
              <input type="text" name="stockId" required value={form.stockId} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Make *</label>
              <select name="make" required value={form.make} onChange={handleChange} className={selectClass}>
                <option value="">Select Make</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Model *</label>
              <input type="text" name="model" required value={form.model} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Year *</label>
              <input type="number" name="year" required value={form.year} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Body Type</label>
              <select name="bodyType" value={form.bodyType} onChange={handleChange} className={selectClass}>
                <option value="">Select Body Type</option>
                {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <input type="text" name="color" value={form.color} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={DollarSign} title="Pricing" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className={selectClass}>
                <option value="USD">USD ($)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>FOB Price *</label>
              <input type="number" name="price" required value={form.price} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>CIF Price</label>
              <input type="number" name="priceCif" value={form.priceCif} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={Settings} title="Specifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Mileage (km) *</label>
              <input type="number" name="mileage" required value={form.mileage} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fuel Type</label>
              <select name="fuelType" value={form.fuelType} onChange={handleChange} className={selectClass}>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Transmission</label>
              <select name="transmission" value={form.transmission} onChange={handleChange} className={selectClass}>
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Grade</label>
              <select name="auctionGrade" value={form.auctionGrade} onChange={handleChange} className={selectClass}>
                <option value="">—</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={MapPin} title="Location & Status" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Location</label>
              <select name="location" value={form.location} onChange={handleChange} className={selectClass}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-5 h-5 accent-teal-600"
              />
              <label htmlFor="featured" className="text-sm font-bold text-slate-800 cursor-pointer">Mark as Featured Vehicle</label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={ImageIcon} title="Vehicle Images" />
          <ImageUpload value={form.images} onUpload={handleImagesUpload} />
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={FileText} title="Description" />
          <textarea name="description" rows={5} value={form.description} onChange={handleChange} className={`${inputClass} h-auto py-3`} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="h-12 px-10 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-teal-600/20 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Update Vehicle
          </button>
          <Link href="/admin/vehicles" className="h-12 px-6 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

