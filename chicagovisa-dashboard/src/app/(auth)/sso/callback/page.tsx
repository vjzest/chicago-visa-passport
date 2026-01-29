"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useAdminStore } from "@/store/use-admin-store";
import { Loader2, ShieldCheck } from "lucide-react";
import env from "@/lib/env.config";

function SSOCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { initialize, setAdmin } = useAdminStore((state) => state);
    const [status, setStatus] = useState("Authenticating...");
    const processedRef = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) {
            // toast.error("No SSO code provided"); // prevent double toast on strict mode rerenders
            // router.replace("/login");
            return;
        }

        if (processedRef.current) return;
        processedRef.current = true;

        const verifySSO = async () => {
            try {
                setStatus("Verifying credentials...");

                // Clear existing tokens to prevent stale session loop
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_token_passport");
                localStorage.removeItem("admin_mode");

                const chicagoUrl = env.BASE_URL || "http://localhost:4000/api/v1";
                const passportUrl = env.PASSPORT_BASE_URL || "http://localhost:4001/api/v1";

                // Attempt verification on both backends
                const [chicagoRes, passportRes] = await Promise.allSettled([
                    axios.post(`${chicagoUrl}/admin/sso/verify`, { code }),
                    axios.post(`${passportUrl}/admin/sso/verify`, { code })
                ]);

                console.log("SSO Verification Results:", {
                    chicago: chicagoRes.status === "fulfilled" ? chicagoRes.value.data : chicagoRes.reason,
                    passport: passportRes.status === "fulfilled" ? passportRes.value.data : passportRes.reason
                });

                let success = false;

                // Handle Chicago Result
                if (chicagoRes.status === "fulfilled" && chicagoRes.value.data.success) {
                    const data = chicagoRes.value.data.data;
                    localStorage.setItem("admin_token", data.token);
                    setAdmin(data.user);
                    success = true;
                }

                // Handle Passport Result
                if (passportRes.status === "fulfilled" && passportRes.value.data.success) {
                    const data = passportRes.value.data.data;
                    localStorage.setItem("admin_token_passport", data.token);
                    if (!success) setAdmin(data.user); // Fallback admin profile if Chicago failed
                    success = true;
                }

                if (success) {
                    setStatus("Initializing dashboard...");
                    await initialize();
                    toast.success("SSO Login Successful");
                    router.replace("/search");
                } else {
                    toast.error("SSO Verification failed on all services");
                    router.replace("/login");
                }

                if (chicagoRes.status !== "fulfilled" || !chicagoRes.value.data.success) {
                    toast.warning("Chicago Visa Login Failed - Check Console");
                    console.error("Chicago Login Failed:", chicagoRes);
                }
                if (passportRes.status !== "fulfilled" || !passportRes.value.data.success) {
                    toast.warning("Passport Login Failed - Check Console");
                    console.error("Passport Login Failed:", passportRes);
                }
            } catch (error: any) {
                console.error("SSO Callback Error:", error);
                toast.error("An error occurred during SSO verification");
                router.replace("/login");
            }
        };

        verifySSO();
    }, [searchParams, router, initialize, setAdmin]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 animate-pulse">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-xl font-semibold text-slate-900 mb-2">{status}</h1>
                <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait while we secure your session
                </p>
            </div>
        </div>
    );
}

export default function SSOCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <SSOCallbackContent />
        </Suspense>
    );
}
