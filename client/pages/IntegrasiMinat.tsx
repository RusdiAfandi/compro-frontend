import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Plus, Search, ArrowLeft, Menu, Home, ChevronRight, LogOut } from "lucide-react";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { interestsService } from "@/lib/api-service";
import { getAuthToken, removeAuthToken } from "@/lib/api-config";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  name: string;
}

interface SelectedSkill {
  id: string;
  name: string;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
}

export default function IntegrasiMinat() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedHardskills, setSelectedHardskills] = useState<SelectedSkill[]>([]);
  const [selectedSoftskills, setSelectedSoftskills] = useState<SelectedSkill[]>([]);
  const [hardskillSearch, setHardskillSearch] = useState("");
  const [softskillSearch, setSoftskillSearch] = useState("");
  const [isHardskillDialogOpen, setIsHardskillDialogOpen] = useState(false);
  const [isSoftskillDialogOpen, setIsSoftskillDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [error, setError] = useState("");
  const [availableSkills, setAvailableSkills] = useState<{hard_skills: string[], soft_skills: string[]}>({hard_skills: [], soft_skills: []});
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from API
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const loadInterests = async () => {
      try {
        const response: any = await interestsService.getInterests();
        if (response.success) {
          setAvailableSkills(response.data.available_options);
          // Set user's current interests
          if (response.data.user_interests) {
            const userHardSkills = response.data.user_interests.hard_skills.map((skill: string, index: number) => ({
              id: index.toString(),
              name: skill
            }));
            const userSoftSkills = response.data.user_interests.soft_skills.map((skill: string, index: number) => ({
              id: index.toString(),
              name: skill
            }));
            setSelectedHardskills(userHardSkills);
            setSelectedSoftskills(userSoftSkills);
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data minat",
        });
        if (error instanceof Error && error.message.includes('authorized')) {
          removeAuthToken();
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInterests();
  }, [navigate, toast]);

  // Convert API data to Skill format
  const hardskills: Skill[] = availableSkills.hard_skills.map((skill, index) => ({
    id: index.toString(),
    name: skill
  }));

  const softskills: Skill[] = availableSkills.soft_skills.map((skill, index) => ({
    id: index.toString(),
    name: skill
  }));

  const filteredHardskills = hardskills.filter(skill =>
    skill.name.toLowerCase().includes(hardskillSearch.toLowerCase())
  );

  const filteredSoftskills = softskills.filter(skill =>
    skill.name.toLowerCase().includes(softskillSearch.toLowerCase())
  );

  const canGenerate = selectedHardskills.length > 0 && selectedSoftskills.length > 0;

  const addHardskill = (skill: Skill) => {
    if (selectedHardskills.length >= 5) {
      setError("*Maximum 5 skills allowed. Choose wisely, every skill defines your profile.");
      return;
    }
    
    if (!selectedHardskills.find(s => s.id === skill.id)) {
      setSelectedHardskills([...selectedHardskills, skill]);
      setError("");
    }
  };

  const addSoftskill = (skill: Skill) => {
    if (selectedSoftskills.length >= 5) {
      setError("*Maximum 5 skills allowed. Choose wisely, every skill defines your profile.");
      return;
    }
    
    if (!selectedSoftskills.find(s => s.id === skill.id)) {
      setSelectedSoftskills([...selectedSoftskills, skill]);
      setError("");
    }
  };

  const removeHardskill = (skillId: string) => {
    setSelectedHardskills(selectedHardskills.filter(s => s.id !== skillId));
  };

  const removeSoftskill = (skillId: string) => {
    setSelectedSoftskills(selectedSoftskills.filter(s => s.id !== skillId));
  };

  const handleGenerate = async () => {
    if (!canGenerate) {
      setError("Tambahkan minimal satu hardskill dan satu softskill untuk melanjutkan.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // First save the interests
      await interestsService.updateInterests({
        hard_skills: selectedHardskills.map(skill => skill.name),
        soft_skills: selectedSoftskills.map(skill => skill.name)
      });

      // Then get recommendations
      const recResponse: any = await interestsService.getRecommendations();
      if (recResponse.success && recResponse.data?.recommendations) {
        const formattedRecs = recResponse.data.recommendations.map((rec: any, index: number) => ({
          id: index + 1,
          title: rec.name || rec.nama_mk || rec.title,
          description: rec.description || "Mata kuliah yang direkomendasikan berdasarkan minat Anda."
        }));
        setRecommendations(formattedRecs);
      } else {
        // Fallback if no recommendations
        setRecommendations([{
          id: 1,
          title: "Rekomendasi akan ditampilkan di sini",
          description: "Sistem sedang memproses minat Anda. Silakan coba lagi nanti."
        }]);
      }
      setShowResults(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghasilkan rekomendasi. Silakan coba lagi.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    setShowResults(false);
  };

  const handleEndSession = () => {
    setShowEndSessionDialog(true);
  };

  const confirmEndSession = () => {
    // Reset all state
    setSelectedHardskills([]);
    setSelectedSoftskills([]);
    setShowResults(false);
    setShowEndSessionDialog(false);
    // Navigate to dashboard or home
    navigate("/dashboard");
  };

  // Show warning before page unload if data exists
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((selectedHardskills.length > 0 || selectedSoftskills.length > 0) && !showResults) {
        e.preventDefault();
        e.returnValue = "Apakah kamu yakin ingin keluar? Data belum disimpan.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selectedHardskills, selectedSoftskills, showResults]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aira-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header with Sidebar Toggle */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-aira-primary to-aira-secondary h-[72px] px-4 md:px-8 relative overflow-visible shadow-lg">
          {/* Decorative gradient circles */}
          <div className="absolute right-0 top-1/3 w-[600px] h-[600px] rounded-full opacity-[0.08] bg-gradient-to-br from-white via-white/50 to-transparent pointer-events-none" />
          <div className="absolute -left-32 -top-32 w-[500px] h-[500px] opacity-[0.1] pointer-events-none">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-transparent" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto h-full flex items-center justify-between">
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
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="p-0 bg-transparent mt-1.5 -ml-[43px]"
                aria-label="Ke Dashboard"
              >
                <img
                  src="/assets/images/logo-aira-footer.png"
                  alt="AIRA Logo"
                  className="w-[140px] h-[140px] object-contain -my-[35px]"
                />
              </button>
            </div>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-white text-xl md:text-2xl font-bold text-center">
              Integrasi Minat
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
            } fixed left-0 top-[72px] md:top-[72px] bottom-0 z-40 w-64 bg-gradient-to-b from-aira-primary to-aira-secondary transition-transform duration-300 ease-in-out shadow-xl`}
          >
            <nav className="p-6 space-y-4 text-white h-full flex flex-col">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsSidebarOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
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
              <button className="w-full text-left py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
                Integrasi Minat
              </button>
              <div className="flex-1"></div>
              <button
                onClick={() => {
                  navigate("/");
                  setIsSidebarOpen(false);
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

          {/* Main Content */}
          <main className="flex-1 px-4 md:px-8 py-8 bg-white">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link
                  to="/dashboard"
                  className="hover:text-aira-primary transition-colors flex items-center gap-1"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Integrasi Minat</span>
              </div>

              <h2 className="text-2xl font-semibold mb-8 text-gray-800">AIRA's Recommendation:</h2>
              
              <div className="space-y-4 mb-8">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-start space-x-4">
                    <div className="bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {String(rec.id).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-full px-6 py-3 border border-gray-300">
                        <h3 className="text-lg font-medium text-gray-800">{rec.title}</h3>
                      </div>
                      <p className="text-gray-600 mt-2 ml-2">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleEndSession}
                  className="px-6 py-3 bg-aira-primary text-white rounded-lg hover:bg-aira-secondary transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* End Session Confirmation Dialog */}
        <Dialog open={showEndSessionDialog} onOpenChange={setShowEndSessionDialog}>
          <DialogContent className="p-0 overflow-hidden max-w-sm">
            <div className="relative bg-white rounded-lg text-center">
              {/* Illustration */}
              <div className="flex justify-center items-center pt-8 pb-4">
                <img
                  src="/assets/images/endSession-ilustration.png"
                  alt="End Session"
                  className="w-20 h-20 object-contain"
                />
              </div>
              {/* Question Text */}
              <div className="px-6 pb-6">
                <DialogTitle className="text-xl font-bold text-aira-primary">
                  End Session?
                </DialogTitle>
              </div>
              {/* Buttons */}
              <div className="flex justify-center gap-4 px-6 pb-6">
                <button
                  onClick={() => setShowEndSessionDialog(false)}
                  className="px-8 py-2 bg-[#690E0E] hover:bg-[#510a0a] text-white font-medium rounded-lg transition-colors"
                >
                  No
                </button>
                <button
                  onClick={confirmEndSession}
                  className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Yes, End Session
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Sidebar Toggle */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-aira-primary to-aira-secondary h-[72px] px-4 md:px-8 relative overflow-visible shadow-lg">
        {/* Decorative gradient circles */}
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] rounded-full opacity-[0.08] bg-gradient-to-br from-white via-white/50 to-transparent pointer-events-none" />
        <div className="absolute -left-32 -top-32 w-[500px] h-[500px] opacity-[0.1] pointer-events-none">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-between">
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
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="p-0 bg-transparent mt-1.5 -ml-[43px]"
              aria-label="Ke Dashboard"
            >
              <img
                src="/assets/images/logo-aira-footer.png"
                alt="AIRA Logo"
                className="w-[140px] h-[140px] object-contain -my-[35px]"
              />
            </button>
          </div>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-white text-xl md:text-2xl font-bold text-center">
            Integrasi Minat
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
          } fixed left-0 top-[72px] md:top-[72px] bottom-0 z-40 w-64 bg-gradient-to-b from-aira-primary to-aira-secondary transition-transform duration-300 ease-in-out shadow-xl`}
        >
          <nav className="p-6 space-y-4 text-white h-full flex flex-col">
            <button
              onClick={() => {
                navigate("/dashboard");
                setIsSidebarOpen(false);
              }}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
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
            <button className="w-full text-left py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
              Integrasi Minat
            </button>
            <div className="flex-1"></div>
            <button
              onClick={() => {
                navigate("/");
                setIsSidebarOpen(false);
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

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-8 bg-white">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link
                to="/dashboard"
                className="hover:text-aira-primary transition-colors flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Integrasi Minat</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {/* Technical Potential Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  AIRA is ready to analyze your <span className="font-bold text-red-800">technical potential.</span>
                </h2>
                <p className="text-gray-600 mb-2">
                  Select the Hard Skills that best represent you, so our system can calibrate your unique intelligence profile.
                </p>
              </div>
              
              <div className="flex items-center justify-start mb-4">
                <Dialog open={isHardskillDialogOpen} onOpenChange={setIsHardskillDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="bg-aira-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-aira-secondary transition-colors">
                      Add Hard Skill
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pencarian Hardskill</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Matematika Diskrit"
                        value={hardskillSearch}
                        onChange={(e) => setHardskillSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2635] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      {filteredHardskills.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {filteredHardskills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border"
                            >
                              <span className="text-gray-800">{skill.name}</span>
                              <button
                                onClick={() => addHardskill(skill)}
                                disabled={selectedHardskills.find(s => s.id === skill.id) !== undefined}
                                className="p-1 bg-blue-200 rounded-full hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4 text-blue-700" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <img
                            src="/assets/images/notfoundintegrasiminatsearch.png"
                            alt="Hard Skill Not Found"
                            className="w-40 h-40 mb-4"
                          />
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Hard Skill Not Found.
                          </h3>
                          <p className="text-gray-600 text-sm">
                            AIRA couldn't detect any matching hard skills. Please try selecting again.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

              {/* Selected Hardskills */}
              <div className="flex flex-wrap gap-3 mt-4">
                {selectedHardskills.map((skill) => (
                  <div key={skill.id} className="flex items-center bg-gray-100 border border-gray-300 px-4 py-2 rounded-full">
                    <span className="text-gray-800 mr-2">{skill.name}</span>
                    <button
                      onClick={() => removeHardskill(skill.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Human Side Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Now, let AIRA understand your <span className="font-bold text-red-800">human side.</span>
                </h2>
                <p className="text-gray-600 mb-2">
                  Select the Soft Skills that best represent you, so our system can calibrate your unique intelligence profile.
                </p>
              </div>
              
              <div className="flex items-center justify-start mb-4">
                <Dialog open={isSoftskillDialogOpen} onOpenChange={setIsSoftskillDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="bg-aira-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-aira-secondary transition-colors">
                      Add Soft Skill
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Pencarian Softskill</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Matematika Diskrit"
                        value={softskillSearch}
                        onChange={(e) => setSoftskillSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B2635] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      {filteredSoftskills.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {filteredSoftskills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border"
                            >
                              <span className="text-gray-800">{skill.name}</span>
                              <button
                                onClick={() => addSoftskill(skill)}
                                disabled={selectedSoftskills.find(s => s.id === skill.id) !== undefined}
                                className="p-1 bg-blue-200 rounded-full hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4 text-blue-700" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <img
                            src="/assets/images/notfoundintegrasiminatsearch.png"
                            alt="Soft Skill Not Found"
                            className="w-40 h-40 mb-4"
                          />
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Soft Skill Not Found.
                          </h3>
                          <p className="text-gray-600 text-sm">
                            AIRA couldn't detect any matching soft skills. Please try selecting again.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

              {/* Selected Softskills */}
              <div className="flex flex-wrap gap-3 mt-4">
                {selectedSoftskills.map((skill) => (
                  <div key={skill.id} className="flex items-center bg-gray-100 border border-gray-300 px-4 py-2 rounded-full">
                    <span className="text-gray-800 mr-2">{skill.name}</span>
                    <button
                      onClick={() => removeSoftskill(skill.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end mt-12">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className={`px-12 py-3 rounded-full font-semibold text-lg transition-colors ${
                  canGenerate && !isGenerating
                    ? 'bg-aira-primary text-white hover:bg-aira-secondary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
