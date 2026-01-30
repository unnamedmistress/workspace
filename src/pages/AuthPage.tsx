import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { signIn, signUp, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!ready) {
        throw new Error("Firebase is not configured yet.");
      }
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to authenticate.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isLogin ? "Sign in" : "Create account"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in with your email to access PermitPath."
              : "Create an account to save your permit jobs."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Working..." : isLogin ? "Sign in" : "Create account"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin((prev) => !prev)}
            >
              {isLogin ? "Need an account? Sign up" : "Have an account? Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
