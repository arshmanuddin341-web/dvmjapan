/**
 * Cost Calculator config API
 * GET /api/calculator/config
 * Returns destinations (ports, shipping rates) and fee structure for the calculator.
 * Calculator can use this so rates/fees can be updated from backend without code change.
 */

import { NextResponse } from "next/server";
import { destinations } from "@/data/destinations-ports";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FEES = {
  serviceFeePct: 0.05,
  insurancePct: 0.02,
  inspectionFee: 150,
  documentationFee: 100,
  handlingFee: 200,
  certificateFee: 80,
  warrantyFee: 120,
};

export async function GET() {
  try {
    const config = {
      destinations: destinations.map((d) => ({
        id: d.id,
        label: d.label,
        ports: d.ports,
        shippingRoro: d.shippingRoro,
        shippingContainer: d.shippingContainer,
      })),
      fees: FEES,
    };
    return NextResponse.json(config);
  } catch (e) {
    console.error("Calculator config error:", e);
    return NextResponse.json(
      { error: "Failed to load calculator config" },
      { status: 500 }
    );
  }
}
