"use client";

import Link from "next/link";
import {
  FileCheck,
  Building2,
  Headphones,
  FileSignature,
  Search,
  CircleDollarSign,
  Car,
  Gavel,
  CreditCard,
  Ship,
} from "lucide-react";
import { routes } from "@/config/routes";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import Accordion from "@/components/ui/Accordion";

const DEPOSIT_TABLE = [
  { price: "Up to 500,000", deposit: "100,000" },
  { price: "500,001 - 1,000,000", deposit: "200,000" },
  { price: "1,000,001 - 2,000,000", deposit: "300,000" },
  { price: "2,000,001 - 3,000,000", deposit: "500,000" },
  { price: "3,000,001 - 5,000,000", deposit: "800,000" },
  { price: "Above 5,000,000", deposit: "10%" },
];

const auctionProcessSteps = [
  {
    step: 1,
    title: "Registration",
    icon: FileSignature,
    body: "Create your account with DVM JAPAN. Complete the registration form and verify your identity. Once approved, you get full access to live auction inventory and bidding.",
  },
  {
    step: 2,
    title: "Vehicle Search",
    icon: Search,
    body: "Use our search filters to find vehicles that match your needs: Make & model, Year, Mileage, Auction grade, and more. Save your searches and get alerts when new matching vehicles are listed.",
  },
  {
    step: 3,
    title: "Advance Security Deposit",
    icon: CircleDollarSign,
    body: "Place a refundable security deposit based on your intended bid range. Deposit amounts are as follows:",
    table: DEPOSIT_TABLE,
  },
  {
    step: 4,
    title: "Vehicle Selection & Bid Placement",
    icon: Car,
    body: "Select your preferred vehicles and submit your maximum bid. Our team places bids on your behalf at the live auction. You can bid on multiple vehicles per session.",
  },
  {
    step: 5,
    title: "Live Auction Bidding",
    icon: Gavel,
    body: "We attend the live auction and bid on your behalf. You receive email confirmation as soon as your bid is successful. If outbid, we can help you find similar vehicles.",
  },
  {
    step: 6,
    title: "Final Payment",
    icon: CreditCard,
    body: "Pay the remaining balance via bank wire or PayPal. Once payment is confirmed, we proceed with yard inspection and shipping arrangements.",
  },
  {
    step: 7,
    title: "Yard Inspection & Vehicle Shipping",
    icon: Ship,
    body: "After payment confirmation, the vehicle undergoes yard inspection and paperwork. We then arrange shipping from Japanese ports to your destination. You receive tracking and documents.",
  },
];

const biddingFaqItems = [
  {
    id: "bid-1",
    title: "1. What is a Bid Price in Vehicle Auctions?",
    content: "A bid price is the maximum amount you are willing to pay for a vehicle at auction. Our team places bids on your behalf up to this limit. If the winning bid is below your maximum, you pay the actual winning amount plus applicable fees.",
  },
  {
    id: "bid-2",
    title: "2. How do I place a bid?",
    content: "Register with DVM JAPAN, complete the security deposit, and submit your maximum bid for the vehicles you want. We handle the live bidding and notify you of the result by email.",
  },
  {
    id: "bid-3",
    title: "3. Can I cancel my bid?",
    content: "Bids can be withdrawn before the auction starts. Once the auction has begun, bids are binding. Contact us as soon as possible if you need to change or cancel a bid.",
  },
  {
    id: "bid-4",
    title: "4. What happens if I win the bid?",
    content: "You receive an email confirmation with the winning price. The balance (vehicle price minus deposit) plus any fees is due within the stated period. We then arrange inspection and shipping.",
  },
  {
    id: "bid-5",
    title: "5. What if my bid is not successful?",
    content: "Your security deposit remains in your account. You can use it for the next auction or request a refund. We can also help you find similar vehicles for the next auction.",
  },
  {
    id: "bid-6",
    title: "6. How often are auctions held?",
    content: "Japanese vehicle auctions run frequently throughout the week. We have access to 150+ auction houses with hundreds of thousands of vehicles updated weekly.",
  },
  {
    id: "bid-7",
    title: "7. Do you provide auction sheets?",
    content: "Yes. We provide Japanese auction sheet inspection and translation. Our specialists explain condition grades and any remarks so you know exactly what you are buying.",
  },
];

const pricingFaqItems = [
  {
    id: "price-1",
    title: "1. What costs are included in the vehicle price?",
    content: "The auction price includes the vehicle and auction fees. FOB price includes port handling in Japan. Shipping, insurance, and destination port charges are quoted separately. Import duties, taxes, and decontamination/fumigation are the buyer's responsibility in the destination country.",
  },
  {
    id: "price-2",
    title: "2. How is shipping cost calculated?",
    content: "Shipping cost depends on destination port, vehicle size, and container type (RORO or container). We provide a detailed quote before you confirm. Insurance is included in our shipping quote.",
  },
  {
    id: "price-3",
    title: "3. When do I pay the balance?",
    content: "After a successful bid, the balance (vehicle price minus deposit) is due within the period stated in your confirmation (typically 3–5 business days). Payment is via bank wire or PayPal.",
  },
];

const conditionFaqItems = [
  {
    id: "cond-1",
    title: "1. How can I be sure about the vehicle condition before bidding?",
    content: "We provide auction sheets with grades and remarks, multiple photos, and optional translation. Auction grades (1–6) indicate condition. Our team can explain any grade or remark. Additional inspections can be arranged for a fee.",
  },
  {
    id: "cond-2",
    title: "2. What do auction grades mean?",
    content: "Grades range from 6 (excellent) down to 3 (poor). Grade R indicates repaired or accident history. We explain each grade and any remarks (e.g. scratches, rust) so you can bid with confidence.",
  },
];

export default function AuctionPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="container-custom max-w-4xl py-8 md:py-10">
        <PageBreadcrumb
          items={[
            { label: "Services", href: routes.about },
            { label: "Auctions" },
          ]}
        />
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-10">
          Vehicle Auctions
        </h1>

        {/* DVM JAPAN Group Live Auctions */}
        <section className="mb-12">
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-2">
            Transparent Auction Pricing
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-4">
            DVM JAPAN Group Live Auctions
          </h2>
          <p className="text-slate-700 leading-relaxed mb-8 max-w-3xl">
            Our DVM JAPAN Group Live Auction Service connects you directly to Japanese vehicle auctions for procurement, inspection, payment, and shipping. We handle the entire process so you can buy with confidence from the world&apos;s largest vehicle auction network.
          </p>

          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-navy mb-2">
                  Buying from Japanese Car Auctions Made Simple
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  DVM JAPAN Group gives you direct access to Japanese vehicle auctions. We handle registration, bidding, payment, and shipping so you get the vehicle you want without the complexity. Our team has years of experience connecting buyers with the right auctions and vehicles.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm">
                150+
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-navy mb-2">
                  Access to Over 150 Japanese Auction Houses
                </h3>
                <ul className="list-disc list-inside text-slate-700 space-y-1 mb-3">
                  <li>150+ Japanese auction houses</li>
                  <li>500,000+ vehicles updated weekly</li>
                  <li>Passenger cars, SUVs, trucks, vans, and commercial vehicles</li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  We aggregate inventory from the largest auction network in Japan. Whatever type of vehicle you need, you can search and bid through one platform with full transparency and support.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-navy mb-2">
                  Free Consultation & Auction Sheet Translation
                </h3>
                <ul className="list-disc list-inside text-slate-700 space-y-1 mb-3">
                  <li>Import regulations by country</li>
                  <li>Recommended model year & engine size</li>
                  <li>Compliance with local laws</li>
                  <li>Japanese auction sheet inspection & translation</li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  Our specialists help you understand auction grades, import rules for your country, and which vehicles meet your requirements. We translate and explain auction sheets so you know exactly what you are buying.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DVM JAPAN Group Auction Process - light blue panel */}
        <section className="mb-12 rounded-2xl bg-sky-50/80 border border-sky-100 p-6 md:p-8">
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-2">
            Browse Live Auction Inventory
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-6">
            DVM JAPAN Group Auction Process
          </h2>
          <div className="space-y-6">
            {auctionProcessSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="flex gap-4">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-200/80 text-brand-navy">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-teal-600 font-semibold text-sm">Step {s.step}</p>
                    <h3 className="font-display text-lg font-bold text-brand-navy mb-2">
                      {s.title}
                    </h3>
                    <p className="text-slate-700 leading-relaxed mb-2">{s.body}</p>
                    {s.table && (
                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white mt-3">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                              <th className="text-left py-2 px-3 font-semibold text-slate-700">
                                Vehicle Price (JPY)
                              </th>
                              <th className="text-left py-2 px-3 font-semibold text-slate-700">
                                Required Deposit (JPY)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.table.map((row, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0">
                                <td className="py-2 px-3 text-slate-700">{row.price}</td>
                                <td className="py-2 px-3 text-slate-700">{row.deposit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Important Notice */}
        <div className="mb-12 rounded-xl bg-teal-600 px-5 py-4 text-center text-white text-sm font-medium">
          Important Notice: Import duties, port charges, taxes, and decontamination/fumigation charges are the buyer&apos;s responsibility. Please consult your local authorities for exact costs.
        </div>

        {/* Auction And Bidding FAQ's */}
        <section className="mb-12">
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-1">
            How to Buy Cars From Japan Auctions
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-6">
            Auction And Bidding FAQ&apos;s
          </h2>
          <Accordion
            items={biddingFaqItems.map((item) => ({
              id: item.id,
              title: item.title,
              content: <p className="text-slate-700">{item.content}</p>,
            }))}
            allowMultiple
            defaultOpen={["bid-1"]}
            variant="light"
          />
        </section>

        {/* Vehicle Pricing & Shipping */}
        <section className="mb-12">
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-1">
            Vehicle Costs, Pricing & Global Shipping Information
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-6">
            Vehicle Pricing & Shipping
          </h2>
          <Accordion
            items={pricingFaqItems.map((item) => ({
              id: item.id,
              title: item.title,
              content: <p className="text-slate-700">{item.content}</p>,
            }))}
            allowMultiple
            defaultOpen={["price-1"]}
            variant="light"
          />
        </section>

        {/* Vehicle Condition */}
        <section className="mb-12">
          <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-1">
            Overall Vehicle Condition
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-6">
            Vehicle Condition
          </h2>
          <Accordion
            items={conditionFaqItems.map((item) => ({
              id: item.id,
              title: item.title,
              content: <p className="text-slate-700">{item.content}</p>,
            }))}
            allowMultiple
            defaultOpen={["cond-1"]}
            variant="light"
          />
        </section>

        <div className="pt-4 border-t border-slate-200">
          <Link
            href={routes.inventory}
            className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
          >
            Browse auction inventory
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
