import {Navigate, Outlet} from 'react-router-dom'
import { Card } from '../ui/card';
import { useSelector } from 'react-redux';


function AuthLayout() {

    const { isAuthenticated,user } = useSelector((state) => state.auth);
    const token = sessionStorage.getItem("token");

    if(isAuthenticated || token){
        if(user?.role === "Manager"){
            return <Navigate to="/manager" replace />;
        }
        else{
            return <Navigate to="/operator" replace />;
        }
    }

    return ( 
        <div className="flex min-h-screen w-full">
            <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12" >
                <div className="max-w-md space-y-6 text-center text-primary-foreground">
                    <h1 className="text-4xl font-extrabold tracking-tighter">Welcome to Management System</h1>
                </div>
            </div>
            <div className='flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8' style={{backgroundColor: '#e5e4f2'}}>
                <Card className="px-6 md:px-20 py-20 shadow-lg">
                <Outlet/>
                </Card>
            </div>
        </div>
     );
}

export default AuthLayout;