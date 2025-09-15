import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Result from "./Result";
import AddProperty from "./addProperty";
import OwnerPanel from "./OwnerPanel";
import LoginOwner from "./LoginOwner";
import AdminPanel from "./AdminPanel";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import SignupOwner from "./SignUpOwner";


export default function App() {
    return(
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} /> 
                        <Route path="/result" element={<Result />} />
                        <Route path="/addproperty" element={<AddProperty />} />
                        
                        {/* Protected Owner Routes */}
                        <Route path="/ownerpanel" element={
                            <ProtectedRoute>
                                <OwnerPanel />
                            </ProtectedRoute>
                        } />
                        
                        {/* Protected Admin Route - Add if needed */}
                        <Route path="/adminpanel" element={
                            <ProtectedRoute>
                                <AdminPanel />
                            </ProtectedRoute>
                        } />   
                        
                        {/* Public Auth Routes */}
                        <Route path="/login_owner" element={<LoginOwner />} />
                        <Route path="/signup_owner" element={<SignupOwner />} />

                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    )
}