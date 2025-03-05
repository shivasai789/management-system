import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import LoginPage from "./pages/auth/login";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthenticate } from "./store/auth-slice";
import Unauthorized from "./pages/unauth/unauthorized";
import ManagersHome from "./pages/managers-view/home";
import OperatorsHome from "./pages/operators-view/home";
import Orders from "./pages/order/orders";
import ProtectedRoute from "./components/common/protectedRoute";
import ManagerRegister from "./pages/managers-view/register";
import { MutatingDots } from "react-loader-spinner";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // No need for JSON.parse for string values
    if (token) {
      dispatch(checkAuthenticate(JSON.parse(token))).then((data) => {
        if(!data?.payload?.success){
          navigate("/auth/login",{replace: true})
          // console.log(data?.payload?.success)
        }
      });
    }
  }, [dispatch]);

  // console.log(`${sessionStorage.getItem("token")} app reloaded`)

  const {isLoading} = useSelector(state => state.auth)

  if(isLoading){
    return (
      <div className="min-h-screen flex justify-center items-center">
        <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="black"
        secondaryColor="black"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
      </div>
    )
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role-Based Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
            <Route path="/manager" element={<ManagersHome />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
            <Route path="/register" element={<ManagerRegister />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Operator"]} />}>
            <Route path="/operator" element={<OperatorsHome />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Manager", "Operator"]} />}>
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
