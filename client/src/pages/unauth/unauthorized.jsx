import Header from "@/components/common/header";
import unauth from "@/assets/unauth.png"; // Use correct file extension


function Unauthorized() {
    return ( 
        <div>
            <Header/>
            <div className="flex justify-center items-center min-h-screen">
                <img className="md:w-1/3" alt="unath" src={unauth} />
            </div>
        </div>
     );
}

export default Unauthorized;