"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge,
  Calendar,
  Clock,
  User,
  Zap,
  Loader2,
  ArrowLeft,
  Play,
  Pause,
  Flag,
  Trophy,
  Award,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketProvider";
import { routes } from "@/config/routes";
import { getToken } from "@/lib/api-client";

interface BidRow {
  id: string;
  amount: number;
  bidderName: string;
  createdAt: string;
}

interface AuctionResult {
  finalPrice: number | null;
  winner: { id: string; name: string } | null;
  bidCount: number;
}

interface AuctionData {
  id: string;
  lot: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  engine: string;
  image: string;
  chassis: string | null;
  grade: string | null;
  startPrice: number;
  currentBid: number;
  status: string;
  startTime: string | null;
  endTime: string | null;
  bids: BidRow[];
  result?: AuctionResult;
}

export default function AuctionRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user, isAdmin } = useAuthContext();
  const socketContext = useSocket();
  const socket = socketContext?.socket ?? null;
  const connected = socketContext?.connected ?? false;
  const joinAuction = socketContext?.joinAuction ?? (() => {});
  const leaveAuction = socketContext?.leaveAuction ?? (() => {});

  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pulseBidId, setPulseBidId] = useState<string | null>(null);
  const [adminAction, setAdminAction] = useState(false);

  const fetchAuction = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/auctions/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load");
      setAuction(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load auction");
      setAuction(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]);

  useEffect(() => {
    if (!id || !socket) return;
    joinAuction(id);
    return () => leaveAuction(id);
  }, [id, socket, joinAuction, leaveAuction]);

  useEffect(() => {
    if (!socket) return;
    const onBid = (payload: { id: string; amount: number; bidderName: string; createdAt: string }) => {
      setAuction((prev) => {
        if (!prev) return prev;
        setPulseBidId(payload.id);
        setTimeout(() => setPulseBidId(null), 1200);
        return {
          ...prev,
          currentBid: payload.amount,
          bids: [
            {
              id: payload.id,
              amount: payload.amount,
              bidderName: payload.bidderName,
              createdAt: payload.createdAt,
            },
            ...prev.bids,
          ].slice(0, 50),
        };
      });
    };
    const onStatus = (payload: { status: string; endTime?: string | null; startTime?: string | null }) => {
      setAuction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: payload.status,
          endTime: payload.endTime ?? prev.endTime,
          startTime: payload.startTime ?? prev.startTime,
        };
      });
    };
    const onEnded = (payload: {
      status: string;
      finalPrice: number | null;
      winner: { id: string; name: string } | null;
      noWinner?: boolean;
      bidCount: number;
    }) => {
      setAuction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "ended",
          result: {
            finalPrice: payload.finalPrice,
            winner: payload.winner,
            bidCount: payload.bidCount,
          },
        };
      });
    };
    socket.on("bid:new", onBid);
    socket.on("auction:status", onStatus);
    socket.on("auction:ended", onEnded);
    return () => {
      socket.off("bid:new", onBid);
      socket.off("auction:status", onStatus);
      socket.off("auction:ended", onEnded);
    };
  }, [socket]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    if (!id || isNaN(amount) || amount <= 0) return;
    if (!user) {
      router.push(routes.login + "?next=" + encodeURIComponent("/auction/" + id));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/auctions/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Bid failed");
      setBidAmount("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bid failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminStatus = async (status: string) => {
    if (!id || !isAdmin) return;
    setAdminAction(true);
    try {
      const res = await fetch(`/api/auctions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status, ...(status === "active" ? { endMinutes: 60 } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Update failed");
      setAuction((prev) => (prev ? { ...prev, status: data.status ?? status, endTime: data.endTime ?? prev.endTime } : prev));
      await fetchAuction();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setAdminAction(false);
    }
  };

  /** Admin-only: run winner selection if auction ended but not yet settled (or re-settle). */
  const handleSettleAuction = async () => {
    if (!id || !isAdmin) return;
    setAdminAction(true);
    setError("");
    try {
      const res = await fetch(`/api/auctions/${id}/settle`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Settle failed");
      setAuction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          result: {
            finalPrice: data.finalPrice ?? prev.result?.finalPrice ?? null,
            winner: data.winner ?? prev.result?.winner ?? null,
            bidCount: data.bidCount ?? prev.result?.bidCount ?? 0,
          },
        };
      });
      await fetchAuction();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Settle failed");
    } finally {
      setAdminAction(false);
    }
  };

  const endTime = auction?.endTime ? new Date(auction.endTime) : null;
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!endTime || auction?.status !== "active") {
      setTimeLeft(null);
      return;
    }
    const tick = () => {
      const ms = Math.max(0, endTime.getTime() - Date.now());
      setTimeLeft(ms);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endTime, auction?.status]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const h = Math.floor(ms / 3600000);
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const minBid = (auction?.currentBid ?? auction?.startPrice ?? 0) + (auction?.startPrice ? Math.max(100, auction.startPrice * 0.05) : 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />
      </div>
    );
  }

  if (error && !auction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-950 gap-4 p-4">
        <p className="text-red-400">{error}</p>
        <Link href={routes.auction} className="text-red-400 hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to auctions
        </Link>
      </div>
    );
  }

  if (!auction) return null;

  const isActive = auction.status === "active";
  const isEnded = auction.status === "ended" || (timeLeft !== null && timeLeft <= 0);

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <Link
          href={routes.auction}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to live auctions
        </Link>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Vehicle & image */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-xl overflow-hidden bg-dark-800"
            >
              {auction.image ? (
                <Image
                  src={auction.image}
                  alt={`${auction.make} ${auction.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-sm font-medium">
                Lot {auction.lot}
              </div>
              {auction.grade && (
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500/90 text-dark-950 text-sm font-semibold">
                  {auction.grade}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-4 text-sm text-gray-400"
            >
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {auction.year} {auction.make} {auction.model}
              </span>
              <span className="flex items-center gap-1">
                <Gauge className="h-4 w-4" /> {auction.mileage.toLocaleString()} km
              </span>
              {auction.engine && (
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4" /> {auction.engine}
                </span>
              )}
            </motion.div>
          </div>

          {/* Bid panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Status & countdown */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl bg-dark-800/80 border border-dark-700 p-4"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-gray-400 text-sm uppercase tracking-wider">Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-sm font-medium ${
                    isActive
                      ? "bg-green-500/20 text-green-400"
                      : isEnded
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {isActive ? "Live" : isEnded ? "Ended" : auction.status}
                </span>
              </div>

              {isActive && timeLeft !== null && (
                <motion.div
                  key={timeLeft}
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1 }}
                  className={`text-2xl font-mono font-bold mb-2 ${
                    timeLeft < 60000 ? "text-red-400" : "text-white"
                  }`}
                >
                  {formatTime(timeLeft)}
                </motion.div>
              )}
              {!isActive && auction.endTime && (
                <p className="text-sm text-gray-500">
                  End: {new Date(auction.endTime).toLocaleString()}
                </p>
              )}

              {/* Current bid (or final price when ended) */}
              <div className="mt-3 pt-3 border-t border-dark-600">
                {isEnded && auction.result ? (
                  <>
                    <p className="text-gray-400 text-sm">Final price</p>
                    <p className="text-2xl font-bold text-red-400">
                      {auction.result.finalPrice != null
                        ? `$${auction.result.finalPrice.toLocaleString()}`
                        : "No bids"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {auction.result.bidCount} bid{auction.result.bidCount !== 1 ? "s" : ""} total
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm">Current bid</p>
                    <p className="text-2xl font-bold text-red-400">
                      ${(auction.currentBid ?? auction.startPrice).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Starting: ${auction.startPrice.toLocaleString()}</p>
                  </>
                )}
              </div>
            </motion.div>

            {/* Auction Ended banner + winner */}
            {isEnded && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-dark-800/80 border border-dark-700 p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Flag className="h-5 w-5" /> Auction ended
                </div>
                {auction.result?.winner ? (
                  <div
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      user?.id === auction.result.winner.id
                        ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                        : "bg-dark-700/50 text-gray-300"
                    }`}
                  >
                    <Trophy className="h-5 w-5 shrink-0" />
                    <span>
                      Winner: <strong>{auction.result.winner.name}</strong>
                      {user?.id === auction.result.winner.id && (
                        <span className="ml-2 text-red-400">(You)</span>
                      )}
                    </span>
                  </div>
                ) : (
                  auction.result && (
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Award className="h-4 w-4" /> No winning bid (no bids placed).
                    </p>
                  )
                )}
              </motion.div>
            )}

            {/* Bid form (only when active and time left; disabled when ended) */}
            {isActive && timeLeft !== null && timeLeft > 0 && (
              <motion.form
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleBid}
                className="rounded-xl bg-dark-800/80 border border-dark-700 p-4 space-y-3"
              >
                <label className="block text-sm font-medium text-gray-300">Your bid (USD)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={minBid}
                    step="100"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min $${minBid.toLocaleString()}`}
                    className="flex-1 rounded-lg bg-dark-900 border border-dark-600 px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !user}
                    className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Bid"}
                  </button>
                </div>
                {!user && (
                  <p className="text-sm text-amber-400">
                    <Link href={routes.login} className="underline">Log in</Link> to place a bid.
                  </p>
                )}
                {connected ? (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" /> Live
                  </p>
                ) : (
                  <p className="text-xs text-amber-500">Reconnecting…</p>
                )}
              </motion.form>
            )}

            {/* Admin controls */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="rounded-xl bg-dark-800/50 border border-dark-700 p-4"
              >
                <p className="text-sm font-medium text-gray-400 mb-2">Admin</p>
                {/* Final result when ended */}
                {isEnded && auction.result && (
                  <div className="mb-3 p-2 rounded-lg bg-dark-700/50 text-sm">
                    <p className="text-gray-400">Final result</p>
                    <p className="text-white font-medium">
                      {auction.result.finalPrice != null
                        ? `$${auction.result.finalPrice.toLocaleString()}`
                        : "No bids"}
                      {auction.result.winner && (
                        <span className="text-red-400 ml-2">· Winner: {auction.result.winner.name}</span>
                      )}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{auction.result.bidCount} bid(s)</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {auction.status !== "active" && (
                    <button
                      type="button"
                      onClick={() => handleAdminStatus("active")}
                      disabled={adminAction}
                      className="px-3 py-1.5 rounded-lg bg-green-600/80 hover:bg-green-600 text-white text-sm inline-flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" /> Start
                    </button>
                  )}
                  {auction.status === "active" && (
                    <button
                      type="button"
                      onClick={() => handleAdminStatus("paused")}
                      disabled={adminAction}
                      className="px-3 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-sm inline-flex items-center gap-1"
                    >
                      <Pause className="h-4 w-4" /> Pause
                    </button>
                  )}
                  {(auction.status === "active" || auction.status === "paused") && (
                    <button
                      type="button"
                      onClick={() => handleAdminStatus("ended")}
                      disabled={adminAction}
                      className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm inline-flex items-center gap-1"
                    >
                      <Flag className="h-4 w-4" /> End
                    </button>
                  )}
                  {isEnded && (
                    <button
                      type="button"
                      onClick={handleSettleAuction}
                      disabled={adminAction}
                      className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm inline-flex items-center gap-1"
                    >
                      {adminAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                      Settle Auction
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bid history */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" /> Bid history
          </h2>
          <div className="rounded-xl bg-dark-800/60 border border-dark-700 overflow-hidden">
            {auction.bids.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">No bids yet.</p>
            ) : (
              <ul className="divide-y divide-dark-600">
                <AnimatePresence mode="popLayout">
                  {auction.bids.map((bid) => (
                    <motion.li
                      key={bid.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        backgroundColor: pulseBidId === bid.id ? "rgba(6, 182, 212, 0.15)" : "transparent",
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-300">{bid.bidderName}</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(bid.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className="font-semibold text-red-400">
                        ${bid.amount.toLocaleString()}
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </motion.section>

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
