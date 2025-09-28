import { createServer } from "@/lib/supabaseServer"; 
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard"

async function HomePage() {
    const server = createServer();
    const {
        data: { user },
    } = await server.auth.getUser();

    if (!user) {
        return redirect('/login')
    }

    // ==================== DEBUGGING LOG ====================
    console.log(`[Middleware] User: ${user ? user.email : 'null'}`)
    // =======================================================
        
    return (
        <Dashboard user = {user}/>
    )
}

export default HomePage;