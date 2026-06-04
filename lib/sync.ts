import { Vehicle } from "@prisma/client";

export async function syncToDVM(vehicle: any, method: "POST" | "PUT" = "POST") {
    const baseUrl = process.env.SYNC_DVM_URL; // e.g. https://dvmjapan.com/api/vehicles
    if (!baseUrl) {
        console.warn("SYNC_DVM_URL not configured. Skipping sync.");
        return;
    }

    const syncUrl = method === "PUT" ? `${baseUrl}/${vehicle.stockId}` : baseUrl;

    try {
        // Map DVM JAPAN fields to DVM fields
        const dvmData = {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            price: vehicle.price,
            engineSize: vehicle.engineSize?.toString() || "",
            mileage: vehicle.mileage,
            transmission: vehicle.transmission,
            fuelType: vehicle.fuelType,
            drive: vehicle.driveType || "",
            color: vehicle.color,
            chassisNo: vehicle.chassis || "",
            images: Array.isArray(vehicle.images) ? vehicle.images : JSON.parse(vehicle.images || "[]"),
            status: "AVAILABLE",
            specs: vehicle.description || "",
        };

        console.log(`Syncing (${method}) vehicle ${vehicle.stockId} to DVM...`);

        const response = await fetch(syncUrl, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dvmData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`DVM Sync failed: ${response.status} ${errorText}`);
            return { success: false, error: errorText };
        }

        const result = await response.json();
        console.log(`DVM Sync successful for ${vehicle.stockId}`);
        return { success: true, data: result };
    } catch (error: any) {
        console.error("DVM Sync Error:", error);
        return { success: false, error: error.message };
    }
}
