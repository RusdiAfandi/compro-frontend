import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Footer from "@/components/Footer";
import { menuService } from "@/lib/api-service";
import { getAuthToken, removeAuthToken } from "@/lib/api-config";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  nama: string;
  nim: string;
  email_sso: string;
  jurusan: string;
  fakultas: string;
  angkatan: number;
  semester: string;
  ipk: number;
  sks_completed: number;
  tak: number;
  ikk: number;
  sks_tingkat: {
    tingkat_1: string;
    tingkat_2: string;
    tingkat_3: string;
    tingkat_4: string;
  };
  ip_tingkat: {
    tingkat_1: string;
    tingkat_2: string;
    tingkat_3: string;
    tingkat_4: string;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Generate academic data from profile data
  const academicData = profileData ? [
    { 
      tingkat: "I", 
      sks: profileData.sks_tingkat?.tingkat_1 || "-", 
      status: profileData.sks_tingkat?.tingkat_1 && profileData.sks_tingkat.tingkat_1 !== "-" ? "Lulus" : "Belum Lulus", 
      ips: profileData.ip_tingkat?.tingkat_1 || "-" 
    },
    { 
      tingkat: "II", 
      sks: profileData.sks_tingkat?.tingkat_2 || "-", 
      status: profileData.sks_tingkat?.tingkat_2 && profileData.sks_tingkat.tingkat_2 !== "-" ? "Lulus" : "Belum Lulus", 
      ips: profileData.ip_tingkat?.tingkat_2 || "-" 
    },
    { 
      tingkat: "III", 
      sks: profileData.sks_tingkat?.tingkat_3 || "-", 
      status: profileData.sks_tingkat?.tingkat_3 && profileData.sks_tingkat.tingkat_3 !== "-" ? "Lulus" : "Belum Lulus", 
      ips: profileData.ip_tingkat?.tingkat_3 || "-" 
    },
    { 
      tingkat: "IV", 
      sks: profileData.sks_tingkat?.tingkat_4 || "-", 
      status: profileData.sks_tingkat?.tingkat_4 && profileData.sks_tingkat.tingkat_4 !== "-" ? "Lulus" : "Belum Lulus", 
      ips: profileData.ip_tingkat?.tingkat_4 || "-" 
    },
  ] : [];

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const menuData: any = await menuService.getMainMenu();
        if (menuData.success) {
          setProfileData(menuData.data.profile);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data dashboard",
        });
        // If auth fails, redirect to login
        if (error instanceof Error && error.message.includes('authorized')) {
          removeAuthToken();
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Sidebar Toggle */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-aira-primary to-aira-secondary py-6 px-4 md:px-8 relative overflow-hidden shadow-lg">
        {/* Decorative gradient circles */}
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] rounded-full opacity-[0.08] bg-gradient-to-br from-white via-white/50 to-transparent pointer-events-none" />
        <div className="absolute -left-32 -top-32 w-[500px] h-[500px] opacity-[0.1] pointer-events-none">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <img
              src="/assets/images/logo-aira-footer.png"
              alt="AIRA Logo"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>
          <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold">
            Dashboard
          </h1>
          <div className="w-12 md:w-16"></div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed left-0 top-[96px] md:top-[112px] bottom-0 z-40 w-64 bg-gradient-to-b from-aira-primary to-aira-secondary transition-transform duration-300 ease-in-out shadow-xl`}
        >
          <nav className="p-6 space-y-4 text-white h-full flex flex-col">
            <button className="w-full text-left py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
              Profile
            </button>
            <button
              onClick={() => {
                navigate("/simulasi-ipk");
                setIsSidebarOpen(false);
              }}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
              Simulasi IPK
            </button>
            <button
              onClick={() => {
                navigate("/integrasi-minat");
                setIsSidebarOpen(false);
              }}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
              Integrasi Minat
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={() => {
                removeAuthToken();
                localStorage.removeItem('userData');
                navigate("/");
              }}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/20 transition-colors font-medium text-white"
            >
              Log Out
            </button>
          </nav>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Dashboard Content */}
        <main className="flex-1 px-4 md:px-8 py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gray-300 mb-4 overflow-hidden">
                  <img
                    src="/assets/images/profile-photo.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-black">{profileData?.nama || 'Loading...'}</h2>
                <p className="text-sm text-gray-600 underline">
                  {profileData?.email_sso || 'Loading...'}
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData?.nama || ''}
                    readOnly
                    className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                  />
                </div>

                {/* Email SSO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email SSO
                  </label>
                  <input
                    type="email"
                    value={profileData?.email_sso || ''}
                    readOnly
                    className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                  />
                </div>

                {/* NIM and Major */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIM
                    </label>
                    <input
                      type="text"
                      value={profileData?.nim || ''}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Major
                    </label>
                    <input
                      type="text"
                      value={profileData?.jurusan || ''}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                {/* Student Year and Faculty */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Year
                    </label>
                    <input
                      type="text"
                      value={profileData?.angkatan?.toString() || ''}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faculty
                    </label>
                    <input
                      type="text"
                      value={profileData?.fakultas || ''}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                {/* SKS Total and IPK */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKS Total
                    </label>
                    <input
                      type="text"
                      value={profileData?.sks_completed?.toString() || ''}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IPK
                    </label>
                    <input
                      type="text"
                      value={profileData?.ipk?.toString() || ''}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>

                {/* Academic Status Table */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Academic Status
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-gray-50 rounded-lg">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Tingkat
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            SKS
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            IPS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {academicData.map((row, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {row.tingkat}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {row.sks}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {row.status}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {row.ips}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* TAK and IKK */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TAK
                    </label>
                    <input
                      type="text"
                      value={profileData?.tak?.toString() || ''}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IKK
                    </label>
                    <input
                      type="text"
                      value={profileData?.ikk?.toString() || ''}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
