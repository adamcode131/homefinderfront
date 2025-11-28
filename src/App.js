import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "./Loading.jsx";

// Lazy load all components
const Home = lazy(() => import("./Home"));
const Result = lazy(() => import("./Result"));
const AddProperty = lazy(() => import("./addProperty"));
const OwnerPanel = lazy(() => import("./OwnerPanel"));
const LoginOwner = lazy(() => import("./LoginOwner"));
const AdminPanel = lazy(() => import("./AdminPanel"));
const SignupOwner = lazy(() => import("./SignUpOwner"));
const UpdateProperty = lazy(() => import("./UpdateProperty"));
const UserPanel = lazy(() => import("./UserPanel"));
const SignupUser = lazy(() => import("./SignUpUser"));
const LoginUser = lazy(() => import("./LoginUser"));
const ResultDetails = lazy(() => import("./ResultDetails.jsx"));
const AdminProfile = lazy(() => import("./AdminProfile.jsx"));
const ChangeState = lazy(() => import("./ChangeState.jsx"));
const Payment = lazy(() => import("./Payment.jsx"));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-100">
    <div className="text-center">
      <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-lg"></div>
      <p className="text-blue-700 font-semibold text-lg">Loading your experience...</p>
      <p className="text-blue-500 text-sm mt-2">Please wait a moment</p>
    </div>
  </div>
);

export default function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/loading" element={<Loading />} />
              <Route path="/result" element={<Result />} />
              <Route path="/addproperty" element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <AddProperty />
                </ProtectedRoute>
              } />

              {/* Protected Owner Routes */}
              <Route path="/ownerpanel" element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerPanel />
                </ProtectedRoute>
              } />
              
              {/* Protected Admin Route */}
              <Route path="/adminpanel" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              } />   
              
              {/* Public Auth Routes */}
              <Route path="/login_owner" element={<LoginOwner />} />
              <Route path="/signup_owner" element={<SignupOwner />} />
              <Route path="/updateproperty/:propertyId" element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <UpdateProperty />
                </ProtectedRoute>
              } /> 

              <Route path="/userpanel" element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserPanel />
                </ProtectedRoute>
              } />

              <Route path="/signup_user" element={<SignupUser/>}/>
              <Route path="/login_user" element={<LoginUser/>}/>
              
              <Route path="/details/:slug" element={<ResultDetails/>} />
              <Route path="/admin-profile" element={<AdminProfile/>} />
              <Route path="/admin-update-property/:propertyId" element={<UpdateProperty/>} />
              <Route path="/change-state" element={<ChangeState/>} />
              <Route path="/payment" element={<Payment/>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}