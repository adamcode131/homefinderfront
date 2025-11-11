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
import UpdateProperty from "./UpdateProperty";
import UserPanel from "./UserPanel";
import SignupUser from "./SignUpUser";
import LoginUser from "./LoginUser";

// testing
import SignUpTest from "./TEST/SignUpTest.jsx";
import LoginTest from "./TEST/LoginTest.jsx";
import ResultDetails from "./ResultDetails.jsx";
import Loading from "./Loading.jsx";
import AdminProfile from "./AdminProfile.jsx";
import ChangeState from "./ChangeState.jsx";


export default function App() {
    return(
        <>
            <AuthProvider>
                <BrowserRouter>
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
                        
                        {/* Protected Admin Route - Add if needed */}
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
                            } 
                        /> 

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

                        
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    )
}