import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUserAction } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

const initialState = {
    email: '',
    password: ''
}

function LoginPage() {
    const [formData,setFormData] = useState(initialState);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = (event) => {
        event.preventDefault();
        dispatch(loginUserAction(formData)).then((data)=>{
            console.log(data)
            if(data?.payload?.success){
                toast.success("Login successful!");
                if(data?.payload?.user?.role === "Manager"){
                    navigate("/manager",{ replace: true })
                }
                else{
                    navigate("/operator",{ replace: true })
                }
            }
            else{
                toast.error(data?.payload?.message)
            }
    })
        }

    return ( 
            <div className="mx-auto w-full max-w-md space-y-6">
                 <div className="text-center">
                 <h1 className="text-3xl font-bold tracking-tight text-foreground mb-16">Sign in to your account</h1>
                 </div>
                 <CommonForm 
            formControls={loginFormControls}
            buttonText={'Sign In'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            />
            </div>
            
     );
}

export default LoginPage;