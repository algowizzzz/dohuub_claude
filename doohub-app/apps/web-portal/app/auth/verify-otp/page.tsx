"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/ui/toaster";
import api, { ENDPOINTS } from "@/lib/api";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { verifyOtp, isLoading, error, clearError } = useAuthStore();

  const email = searchParams.get("email") || "";
  const mode = searchParams.get("mode") || "login";
  const isRegistration = mode === "register";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.replace("/auth/login");
    }
  }, [email, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newOtp.every((digit) => digit) && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("");
    if (code.length !== 6) {
      toast({ title: "Error", description: "Please enter the 6-digit code", variant: "destructive" });
      return;
    }

    clearError();

    try {
      await verifyOtp(email, code, isRegistration);

      if (isRegistration) {
        router.replace("/vendor/onboarding");
      } else {
        router.replace("/");
      }
    } catch (err) {
      toast({ title: "Error", description: error || "Invalid OTP", variant: "destructive" });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await api.post(ENDPOINTS.AUTH.RESEND_OTP, { email });
      setResendCountdown(60);
      toast({ title: "Success", description: "OTP sent to your email", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to resend OTP", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit code to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
            ))}
          </div>

          <Button
            onClick={() => handleVerify()}
            className="w-full"
            loading={isLoading}
            disabled={otp.some((digit) => !digit)}
          >
            Verify Code
          </Button>

          <div className="text-center">
            {resendCountdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in {resendCountdown}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Resend code
              </button>
            )}
          </div>

          {/* Dev bypass hint */}
          <div className="text-center text-xs text-gray-400 border-t pt-4 mt-4">
            <p>Dev Mode: Use code <strong>000000</strong> to bypass</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}

