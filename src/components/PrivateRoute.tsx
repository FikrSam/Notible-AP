// // @/components/PrivateRoute.tsx

// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";

// export function PrivateRoute({ children }: { children: React.ReactNode }) {
//   const { authenticated } = useAuth();

//   if (!authenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// }