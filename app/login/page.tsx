"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email);

    if (error) {
      toast.error(error.message || "Failed to send magic link");
      setLoading(false);
    } else {
      toast.success("Magic link sent! Check your email 📧");
      setEmailSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-to-br from-[#141C2E] to-[#0F1626] border-white/10">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 w-16 h-16 flex items-center justify-center"
            >
              <span className="text-2xl">🔱</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-300 text-transparent bg-clip-text">
              PEAK Dashboard
            </CardTitle>
            <CardDescription className="text-slate-400">
              Empire Operations Command Center
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Mail className="h-12 w-12 mx-auto mb-2 text-green-400" />
                  <p className="text-sm font-medium text-green-400 mb-2">
                    Magic link sent!
                  </p>
                  <p className="text-xs text-slate-400">
                    Check your email ({email}) and click the link to sign in.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Send Another Link
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Magic Link
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-slate-500 mt-4">
                  We'll send you a secure link to sign in. No password needed.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

