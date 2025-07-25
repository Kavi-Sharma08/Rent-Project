import ProtectedRoute from "@/app/components/ProtectedRoute";
export default function Dashboard(){
    
    return (
        <ProtectedRoute>
            <div>
                Dashboard
            </div>

        </ProtectedRoute>
        
    )
}