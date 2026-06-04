"use client";

import { useAuthContext } from "@/context/AuthContext";
import { Clock, Gavel, MapPin, CreditCard } from "lucide-react";

export default function DashboardPendingPage() {
  const { user } = useAuthContext();

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 mb-6">
        <Clock className="h-10 w-10 text-amber-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Account Pending Approval</h1>
      <p className="text-zinc-400 mb-8">
        Hello, <span className="text-white font-medium">{user?.name}</span>. Your account is under review. 
        Only the main admin can approve your access. Once approved, you will be able to:
      </p>
      <ul className="space-y-4 text-left mb-10">
        <li className="flex items-center gap-3 text-zinc-300">
          <Gavel className="h-5 w-5 text-cyan-400 shrink-0" />
          <span>Participate in <strong className="text-white">Live Auctions</strong> and place bids</span>
        </li>
        <li className="flex items-center gap-3 text-zinc-300">
          <MapPin className="h-5 w-5 text-cyan-400 shrink-0" />
          <span><strong className="text-white">Track your cars</strong> and see where your vehicle has reached (live data)</span>
        </li>
        <li className="flex items-center gap-3 text-zinc-300">
          <CreditCard className="h-5 w-5 text-cyan-400 shrink-0" />
          <span>View and manage your <strong className="text-white">Payments</strong></span>
        </li>
      </ul>
      <p className="text-sm text-zinc-500">
        You will get access to these features only after admin approval. Please wait or contact support if needed.
      </p>
    </div>
  );
}
