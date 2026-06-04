"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface Status {
  lastSyncAt: string | null;
  sourceName: string | null;
  importedCount: number;
  error: string | null;
}

export default function AdminJapanAuctionsPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    sourceName?: string;
    imported?: number;
    totalFetched?: number;
    error?: string;
  } | null>(null);

  const loadStatus = async () => {
    try {
      const data = await api<Status>("/api/japan-auctions/status");
      setStatus({
        lastSyncAt: (data as Status).lastSyncAt ?? null,
        sourceName: (data as Status).sourceName ?? null,
        importedCount: (data as Status).importedCount ?? 0,
        error: (data as Status).error ?? null,
      });
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await api<{
        success: boolean;
        sourceName?: string;
        imported?: number;
        totalFetched?: number;
        error?: string;
      }>("/api/japan-auctions/sync", { method: "POST" });
      setSyncResult(result);
      await loadStatus();
    } catch (e) {
      setSyncResult({
        success: false,
        error: e instanceof Error ? e.message : "Sync failed",
      });
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Japan Auction Sync</h1>

      <div className="card p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Fetch and import vehicles from the configured Japan auction source (see <code className="bg-gray-100 px-1 rounded">JAPAN_AUCTION_API_URL</code> in .env). No fake data is used; if the source is not set or the request fails, sync will report an error.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading status…
          </div>
        ) : (
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="font-semibold text-gray-700">Last sync</dt>
              <dd className="text-gray-900">{formatDate(status?.lastSyncAt ?? null)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Source</dt>
              <dd className="text-gray-900">{status?.sourceName ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Vehicles imported (last run)</dt>
              <dd className="text-gray-900">{status?.importedCount ?? 0}</dd>
            </div>
            {status?.error && (
              <div>
                <dt className="font-semibold text-teal-700">Last error</dt>
                <dd className="text-teal-600">{status.error}</dd>
              </div>
            )}
          </dl>
        )}

        {syncResult && (
          <div
            className={
              syncResult.success
                ? "p-3 rounded-lg bg-green-50 text-green-800 text-sm"
                : "p-3 rounded-lg bg-teal-50 text-red-800 text-sm"
            }
          >
            {syncResult.success ? (
              <>
                Synced from {syncResult.sourceName}. Imported: {syncResult.imported ?? 0}
                {syncResult.totalFetched != null && ` (fetched: ${syncResult.totalFetched})`}.
              </>
            ) : (
              <>Error: {syncResult.error ?? "Unknown"}</>
            )}
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary inline-flex items-center gap-2"
          >
            {syncing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Syncing…
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                Sync now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
