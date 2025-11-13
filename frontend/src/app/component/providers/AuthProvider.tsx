"use client";

import useAuth from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push("/login");
    }
  }, [isClient, isLoggedIn, router]);

  if (!isClient || !isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
