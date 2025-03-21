// app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Home from '@/components/LandingPage';
import DashboardContent from '@/components/DashboardContents';

/**
 * Checks if the user is authorized by verifying the existence of a valid token.
 * @returns {boolean} True if the token exists, false otherwise.
 */
async function checkAuthorization() {
  const cookieStore = await cookies();
  const token = cookieStore.get('supabase_session')?.value; // Get token from cookie

  // If the token exists, the user is authorized
  return !!token;
}

export default async function DashboardPage() {
  const isAuthorized = await checkAuthorization();

  // Redirect if unauthorized
  if (!isAuthorized) {
    return <Home /> // Redirect to unauthorized page or login page
  }

  // Render the dashboard content if authorized
  return <DashboardContent />;
}