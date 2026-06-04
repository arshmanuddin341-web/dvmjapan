import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeNewsletter } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        // Send the welcome email
        const { sendWelcomeNewsletter, sendNewsletterToAdmin } = await import("@/lib/email");
        const result = await sendWelcomeNewsletter(email);

        // Notify admin
        sendNewsletterToAdmin(email).catch(console.error);

        if (!result.success) {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ message: "Subscribed successfully" });
    } catch (error) {
        console.error("Newsletter API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
