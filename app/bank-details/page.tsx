"use client";
import PageHero from "@/components/layout/PageHero";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { Copy } from "lucide-react";
import { routes } from "@/config/routes";

const foreignRemittance = [
  { label: "Beneficiary Name", value: "DVM JAPAN GROUP CO., LTD" },
  { label: "Bank Name", value: "MUFG Bank, Ltd." },
  { label: "Branch Name", value: "Main Branch, Tokyo" },
  { label: "Bank Address", value: "2-7-1 Marunouchi, Chiyoda-ku, Tokyo 100-8388, Japan" },
  { label: "SWIFT Code", value: "BOTKJPJT" },
  { label: "Account No (USD)", value: "0097014" },
  { label: "Account No (JPY)", value: "0296994" },
];

function BankDetailCard({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 rounded-[2.5rem] border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-sm">
      <h3 className="text-xl font-bold text-brand-navy mb-6">{title}</h3>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{row.label}</p>
              <p className="text-slate-900 font-semibold">{row.value}</p>
            </div>
            <button
              onClick={() => handleCopy(row.value)}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-teal-600 transition-all"
              title="Copy"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BankDetailsPage() {
  return (
    <div className="min-h-screen bg-white pb-20 pt-2">
      <PageHero
        title="Official Bank Details"
        subtitle="Secure payment information for international wires (SWIFT) and telegraphic transfers."
        variant="navy"
      />

      <div className="container-custom py-10">
        <PageBreadcrumb items={[{ label: "Home", href: routes.home }, { label: "Bank Details" }]} />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <BankDetailCard title="SWIFT Remittance Account" rows={foreignRemittance} />

          <div className="p-8 rounded-[2.5rem] bg-brand-navy text-white">
            <h3 className="text-xl font-bold mb-4">Payment Instructions</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm leading-relaxed text-slate-300">
                  1. All payments must be made in **USD** or **JPY**. <br />
                  2. Please include your **Proforma Invoice No.** in the remittance message. <br />
                  3. Send a copy of the **TT Slip** to your sales agent via email or WhatsApp. <br />
                  4. Your vehicle will be released for shipping once funds are confirmed.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-teal-600 text-white">
                <p className="font-bold mb-1">Secure Payment Guarantee</p>
                <p className="text-xs opacity-90">Verify all bank details with your account manager before transfer. DVM JAPAN will never change bank details via email.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
