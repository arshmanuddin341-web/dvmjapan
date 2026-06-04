"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Save, Star, Car, DollarSign, Gauge, Fuel, Settings, MapPin, FileText, Image as ImageIcon } from "lucide-react";
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

export default function AddVehiclePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);

  const [form, setForm] = useState({
    stockId: "",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleImagesUpload = (urls: string[]) => {
    setImages(urls);
  };

  const autoStockId = () => {
    const mk = form.make.slice(0, 3).toUpperCase() || "STK";
    const mod = form.model.slice(0, 3).toUpperCase() || "VEH";
    const id = `DVM-${mk}${mod}-${Date.now().toString().slice(-5)}`;
    setForm(prev => ({ ...prev, stockId: id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          make: form.make.toUpperCase(),
          year: parseInt(form.year, 10),
          price: parseFloat(form.price) || 0,
          priceCif: form.priceCif ? parseFloat(form.priceCif) : null,
          mileage: parseInt(form.mileage, 10) || 0,
          engineSize: form.engineSize ? parseFloat(form.engineSize) : null,
          images,
          featured,
          status: "available",
          features: [],
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to save vehicle.");
        setSubmitting(false);
        return;
      }

      setSuccess(`✅ Vehicle added successfully! StockID: ${data.vehicle?.stockId || form.stockId}`);
      setTimeout(() => {
        router.push("/admin/vehicles");
        router.refresh();
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <Link href="/admin/vehicles" className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Vehicles
        </Link>
        <div className="h-5 w-px bg-slate-200" />
        <h1 className="text-2xl font-bold text-slate-900">Add New Vehicle</h1>
      </div>

      {success && <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-800 text-sm font-medium">{success}</div>}
      {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm font-medium">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={Car} title="Vehicle Identity" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Stock ID *</label>
              <div className="flex gap-2">
                <input type="text" name="stockId" required value={form.stockId} onChange={handleChange} className={`${inputClass} flex-1`} />
                <button type="button" onClick={autoStockId} className="h-11 px-3 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 transition whitespace-nowrap">Auto</button>
              </div>
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={ImageIcon} title="Vehicle Images" />
          <ImageUpload value={images} onUpload={handleImagesUpload} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle icon={FileText} title="Description" />
          <textarea name="description" rows={5} value={form.description} onChange={handleChange} className={`${inputClass} h-auto py-3`} />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={submitting} className="h-12 px-10 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 disabled:opacity-50 shadow-lg shadow-teal-600/20 flex items-center gap-2">
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Vehicle
          </button>
          <Link href="/admin/vehicles" className="h-12 px-6 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 flex items-center">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

