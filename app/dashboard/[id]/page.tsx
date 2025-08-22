"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { RootState } from "@/store/appStore";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Sans_Font } from "@/fonts/DashboardFonts";
import { Manrope_Font } from "@/fonts/signupPageFont";
import ProductForm, { IProductForm } from "@/app/components/ProductForm";
import axios from "axios";
import { logoutUser } from "@/slices/userSlice";
import { useRouter } from "next/navigation";
import toast , {Toaster} from "react-hot-toast";

export default function Dashboard() {
  const reduxDataOfUser = useSelector((store: RootState) => store.user);
  const currentUserData = reduxDataOfUser.currentUser;
  const updatedProfile = reduxDataOfUser.updatedProfileOfUser;

  const [userProfile, setUserProfile] = useState({});

  const EXCLUDED_KEYS = ["password", "refreshToken", "__v", "_id", "userId"];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setUserProfile({ ...currentUserData, ...updatedProfile });
  }, [currentUserData, updatedProfile]);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  const handleProductSubmit = async (product: IProductForm) => {
    try {
      const fd = new FormData();
      fd.append("title", product.title);
      fd.append("description", product.description);
      fd.append("price", String(product.price));
      if (product.imageFile) {
        fd.append("image", product.imageFile);
      }
      fd.append("college", product.college);
      fd.append("phoneNumber", product.phoneNumber);
      fd.append("postedBy", String(product.postedBy));
      fd.append("type" , product.type);
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/addProduct`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response);
      if(response && response.status ==200){
        toast.success("Product added to the Card")
      }
      
    } catch (error : any) {
      console.log(error)
      toast.error(error?.response?.data?.message)
      
    }
  };

  return (
    <ProtectedRoute>
      <Toaster/>
      <div className="h-screen w-screen flex" style={{ backgroundColor: "#0A0A0A" }}>
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 ease-in-out overflow-hidden ${Sans_Font.className}`}
          style={{ backgroundColor: "#1A1D23" }}
        >
          <div className="p-4 flex justify-between items-center" style={{ borderBottom: "1px solid #2D3748" }}>
            <h2 className="text-lg font-medium text-white">User Profile</h2>
            <button className="text-white hover:opacity-75" onClick={() => setSidebarOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {userProfile && (
            <div className="p-4 space-y-3">
              {Object.entries(userProfile)
                .filter(([key]) => !EXCLUDED_KEYS.includes(key))
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg border hover:opacity-90"
                    style={{ backgroundColor: "#0F172A", borderColor: "#334155" }}
                  >
                    <p className="text-xs uppercase mb-1" style={{ color: "#7DD3FC" }}>
                      {key}
                    </p>
                    <p className="text-sm text-white break-words">{String(value)}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: "#111827" }}>
          {/* Header */}
          <div className={`p-4 flex items-center justify-between shadow-lg ${Manrope_Font.className}`} style={{ backgroundColor: "#0F172A" }}>
            <div className="flex items-center">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-white rounded-lg mr-4 hover:opacity-75"
                  style={{ backgroundColor: "#1E40AF" }}
                >
                  <FaBars />
                </button>
              )}
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </div>

            <div className="flex gap-2">
              {/* My Products Button */}
              <button
                onClick={()=>router.push(`/myProducts/${currentUserData?._id}`)}
                className="px-4 py-2 text-white rounded-lg hover:opacity-75"
                style={{ backgroundColor: "#2563EB" }}
              >
                My Products
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white rounded-lg hover:opacity-75"
                style={{ backgroundColor: "#DC2626" }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {currentUserData?._id && <ProductForm postedBy={currentUserData._id} onSubmit={handleProductSubmit} />}
            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
