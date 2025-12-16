import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, ChevronDown, Home, ChevronRight, Plus, Search, Trash2, Download, ArrowLeft, Pencil } from "lucide-react";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { simulationService, coursesService } from "@/lib/api-service";
import { getAuthToken, removeAuthToken } from "@/lib/api-config";
import { useToast } from "@/hooks/use-toast";

// Default courses for semester 3
const defaultCoursesSemester3 = [
  { id: 1, mataKuliah: "Organisasi dan arsitektur komputer", sks: 3, tingkat: "II", prediksi: "" },
  { id: 2, mataKuliah: "Struktur data", sks: 3, tingkat: "II", prediksi: "" },
  { id: 3, mataKuliah: "Analisis Kompleksitas Algoritma", sks: 3, tingkat: "II", prediksi: "" },
  { id: 4, mataKuliah: "Sistem Basis Data", sks: 3, tingkat: "II", prediksi: "" },
  { id: 5, mataKuliah: "Teori Peluang", sks: 3, tingkat: "II", prediksi: "" },
  { id: 6, mataKuliah: "Wawasan Global TIK", sks: 2, tingkat: "II", prediksi: "" },
  { id: 7, mataKuliah: "RPL : Analisis dan Perancangan Aplikasi", sks: 3, tingkat: "III", prediksi: "" },
];

export default function SimulasiIPK() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("3");
  const [selectedStudyPlan, setSelectedStudyPlan] = useState("Reguler");
  const [courses, setCourses] = useState<
    Array<{
      id: number;
      mataKuliah: string;
      sks: number;
      tingkat: string;
      prediksi: string;
    }>
  >([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Load initial data
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        // Load simulation plan
        const planResponse: any = await simulationService.getSimulationPlan(
          parseInt(selectedSemester),
          selectedStudyPlan
        );
        
        if (planResponse.success && planResponse.data) {
          const formattedCourses = planResponse.data.map((course: any, index: number) => ({
            id: index + 1,
            mataKuliah: course.nama_mk || course.nama,
            sks: course.sks || 3,
            tingkat: course.tingkat || "II",
            prediksi: ""
          }));
          setCourses(formattedCourses);
        } else {
          // Use default if no data
          setCourses([...defaultCoursesSemester3]);
        }

        // Load available courses for adding
        const coursesResponse: any = await coursesService.getCourses();
        if (coursesResponse.success) {
          // Backend returns data as array directly, not data.courses
          setAvailableCourses(coursesResponse.data || []);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data simulasi",
        });
        if (error instanceof Error && error.message.includes('authorized')) {
          removeAuthToken();
          navigate("/login");
        }
        // Use default on error
        setCourses([...defaultCoursesSemester3]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedSemester, selectedStudyPlan, navigate, toast]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTingkat, setFilterTingkat] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExitConfirmationOpen, setIsExitConfirmationOpen] = useState(false);
  const [isEndSessionDialogOpen, setIsEndSessionDialogOpen] = useState(false);
  const [isSKSWarningOpen, setIsSKSWarningOpen] = useState(false);

  // Use availableCourses from state (loaded from API)

  // Filter courses berdasarkan search dan tingkat
  const filteredCourses = availableCourses.filter((course) => {
    const courseName = course.nama_mk || course.nama || '';
    const matchesSearch = courseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Map frontend filter to backend format
    const tingkatMap: { [key: string]: string } = {
      'I': 'TINGKAT I',
      'II': 'TINGKAT II', 
      'III': 'TINGKAT III',
      'IV': 'TINGKAT IV'
    };
    
    const backendTingkat = tingkatMap[filterTingkat] || filterTingkat;
    const matchesTingkat = !filterTingkat || course.tingkat === backendTingkat;
    return matchesSearch && matchesTingkat;
  });

  const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const studyPlanOptions = ["Reguler", "Fast Track", "MBKM"];

  const prediksiOptions = ["A", "AB", "B", "BC", "C", "D", "E"];

  const tingkatOptions = ["I", "II", "III", "IV"];

  const handleGenerate = async () => {
    // Generate directly submits to results page
    if (selectedSemester && selectedStudyPlan && allCoursesHavePrediksi) {
      setIsGenerated(true);
      setIsLoadingDialogOpen(true);
      
      try {
        const simulatedCourses = courses.map(course => ({
          nama_mk: course.mataKuliah,
          sks: course.sks,
          nilai: course.prediksi
        }));

        const response: any = await simulationService.calculateSimulation({
          target_semester: parseInt(selectedSemester),
          study_plan: selectedStudyPlan,
          simulated_courses: simulatedCourses
        });

        if (response.success) {
          setSimulationResult(response.data);
          setIsSubmitted(true);
          toast({
            title: "Simulasi Berhasil",
            description: "Hasil simulasi IPK telah dihitung!",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal menghitung simulasi IPK",
        });
      } finally {
        setIsLoadingDialogOpen(false);
      }
    }
  };

  // Check if all courses have prediksi (indeks nilai)
  const allCoursesHavePrediksi = courses.length > 0 && courses.every((course) => course.prediksi !== "");

  const handleSubmit = async () => {
    setIsLoadingDialogOpen(true);
    
    try {
      const simulatedCourses = courses.map(course => ({
        nama_mk: course.mataKuliah,
        sks: course.sks,
        nilai: course.prediksi
      }));

      const response: any = await simulationService.calculateSimulation({
        target_semester: parseInt(selectedSemester),
        study_plan: selectedStudyPlan,
        simulated_courses: simulatedCourses
      });

      if (response.success) {
        setSimulationResult(response.data);
        setIsSubmitted(true);
        toast({
          title: "Simulasi Berhasil",
          description: "Hasil simulasi IPK telah dihitung!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghitung simulasi IPK",
      });
    } finally {
      setIsLoadingDialogOpen(false);
    }
  };

  // Convert prediksi to numeric value
  const getNilaiFromPrediksi = (prediksi: string): number => {
    const nilaiMap: { [key: string]: number } = {
      A: 4.0,
      AB: 3.5,
      B: 3.0,
      BC: 2.5,
      C: 2.0,
      D: 1.0,
      E: 0.0,
    };
    return nilaiMap[prediksi] || 0;
  };

  // Calculate IPS (Indeks Prestasi Semester) - use API result if available
  const calculateIPS = (): number => {
    if (simulationResult?.ips_semester) {
      return simulationResult.ips_semester;
    }
    
    if (courses.length === 0) return 0;
    // Only calculate if all courses have prediksi
    const allHavePrediksi = courses.every((course) => course.prediksi !== "");
    if (!allHavePrediksi) return 0;
    
    let totalNilai = 0;
    let totalSKS = 0;
    courses.forEach((course) => {
      const nilai = getNilaiFromPrediksi(course.prediksi);
      totalNilai += nilai * course.sks;
      totalSKS += course.sks;
    });
    return totalSKS > 0 ? totalNilai / totalSKS : 0;
  };

  // Calculate IPK (Indeks Prestasi Kumulatif) - use API result if available
  const calculateIPK = (): number => {
    if (simulationResult?.ipk_kumulatif) {
      return simulationResult.ipk_kumulatif;
    }
    
    const currentIPS = calculateIPS();
    // Fallback calculation
    const previousSKS = 60; // Mock: SKS dari semester sebelumnya
    const previousIPK = 3.5; // Mock: IPK dari semester sebelumnya
    const currentSKS = totalSKS;
    const totalSKSAll = previousSKS + currentSKS;
    
    if (totalSKSAll === 0) return 0;
    return ((previousIPK * previousSKS) + (currentIPS * currentSKS)) / totalSKSAll;
  };

  // Calculate total SKS selesai (completed credits) - use API result if available
  const calculateTotalSKSSelesai = (): number => {
    if (simulationResult?.total_sks_completed) {
      return simulationResult.total_sks_completed;
    }
    // Fallback calculation
    const previousSKS = 60; // Mock: SKS dari semester sebelumnya
    return previousSKS + totalSKS;
  };

  const handleDeleteCourse = (id: number) => {
    setCourseToDelete(id);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter((course) => course.id !== courseToDelete));
      setIsDeleteConfirmationOpen(false);
      setIsDeleteSuccessOpen(true);
      setCourseToDelete(null);
    }
  };

  const handleEditCourse = (course: {
    id: number;
    mataKuliah: string;
    sks: number;
    tingkat: string;
    prediksi: string;
  }) => {
    setEditingCourse(course.id);
    setIsConfirmationDialogOpen(true);
  };

  const handleUpdateCourseFromList = (course: {
    _id?: string;
    id?: number;
    nama_mk?: string;
    nama?: string;
    tingkat: string;
    sks: number;
  }) => {
    if (editingCourse) {
      // Update existing course
      setCourses(
        courses.map((c) =>
          c.id === editingCourse
            ? {
                ...c,
                mataKuliah: course.nama_mk || course.nama || 'Mata Kuliah',
                sks: course.sks,
                tingkat: course.tingkat,
              }
            : c
        )
      );
      setIsDialogOpen(false);
      setEditingCourse(null);
      setSearchQuery("");
      setFilterTingkat("");
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setSearchQuery("");
    setFilterTingkat("");
    setIsDialogOpen(true);
  };

  const handleAddCourseFromList = (course: {
    _id?: string;
    id?: number;
    nama_mk?: string;
    nama?: string;
    tingkat: string;
    sks: number;
  }) => {
    const newId = courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    const newCourses = [
      ...courses,
      {
        id: newId,
        mataKuliah: course.nama_mk || course.nama || 'Mata Kuliah',
        sks: course.sks,
        tingkat: course.tingkat,
        prediksi: "",
      },
    ];
    setCourses(newCourses);
    
    // Check if total SKS exceeds 24
    const newTotalSKS = newCourses.reduce((sum, c) => sum + c.sks, 0);
    if (newTotalSKS > 24) {
      setIsSKSWarningOpen(true);
    }
  };


  const handleUpdatePrediksi = (id: number, newPrediksi: string) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, prediksi: newPrediksi } : course
      )
    );
  };

  const totalSKS = courses.reduce((sum, course) => sum + course.sks, 0);
  const ips = calculateIPS();
  const ipk = calculateIPK();
  const totalSKSSelesai = calculateTotalSKSSelesai();

  // Check if there are unsaved changes (any course has prediksi or isGenerated is true or isSubmitted is true)
  // We want to show confirmation even after submit, until user clicks "End Session"
  const hasUnsavedChanges = isGenerated || isSubmitted || courses.some((course) => course.prediksi !== "");

  // Handle beforeunload event (browser close/refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Note: Navigation blocking via React Router is handled by intercepting navigation
  // For browser close/refresh, beforeunload event is used above

  // Handle exit confirmation
  const handleExitConfirm = () => {
    setIsExitConfirmationOpen(false);
    // Reset all simulation data
    setCourses([...defaultCoursesSemester3]);
    setSelectedSemester("3");
    setSelectedStudyPlan("");
    setIsGenerated(false);
    setIsSubmitted(false);
    setIsDialogOpen(false);
    setIsConfirmationDialogOpen(false);
    setIsDeleteConfirmationOpen(false);
    setIsDeleteSuccessOpen(false);
    setCourseToDelete(null);
    setEditingCourse(null);
    setSearchQuery("");
    setFilterTingkat("");
    setIsLoadingDialogOpen(false);
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleExitCancel = () => {
    setIsExitConfirmationOpen(false);
  };

  // Handle End Session confirmation
  const handleEndSessionConfirm = async () => {
    setIsEndSessionDialogOpen(false);
    
    try {
      // Call end session API
      await simulationService.endSession();
    } catch (error) {
      console.warn("Failed to end simulation session:", error);
      // Continue anyway since it's not critical
    }
    
    // Reset all simulation data
    setCourses([]);
    setSelectedSemester("3");
    setSelectedStudyPlan("Reguler");
    setIsGenerated(false);
    setIsSubmitted(false);
    setIsDialogOpen(false);
    setIsConfirmationDialogOpen(false);
    setIsDeleteConfirmationOpen(false);
    setIsDeleteSuccessOpen(false);
    setCourseToDelete(null);
    setEditingCourse(null);
    setSearchQuery("");
    setFilterTingkat("");
    setIsLoadingDialogOpen(false);
    setSimulationResult(null);
    // Navigate to main page (dashboard)
    navigate("/dashboard");
  };

  const handleEndSessionCancel = () => {
    setIsEndSessionDialogOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aira-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data simulasi...</p>
        </div>
      </div>
    );
  }

  // Result Page (after submit)
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header with Sidebar Toggle */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-aira-primary to-aira-secondary h-[72px] relative overflow-visible shadow-lg">
          {/* Decorative gradient circles */}
          <div className="absolute right-0 top-1/3 w-[600px] h-[600px] rounded-full opacity-[0.08] bg-gradient-to-br from-white via-white/50 to-transparent pointer-events-none" />
          <div className="absolute -left-32 -top-32 w-[500px] h-[500px] opacity-[0.1] pointer-events-none">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-transparent" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
          <div className="relative h-full flex items-center justify-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-white text-xl md:text-2xl font-bold text-center">
              Simulasi IPK
            </h1>
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
              {/* Logo di Sidebar */}
              <div className="flex justify-center mb-6 -mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="p-0 bg-transparent"
                  aria-label="Ke Dashboard"
                >
                  <img
                    src="/assets/images/logo-aira-footer.png"
                    alt="AIRA Logo"
                    className="w-[160px] h-[160px] object-contain"
                  />
                </button>
              </div>
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsSidebarOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
                Profile
              </button>
              <button className="w-full text-left py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
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
              {/* Breadcrumbs with Download PDF Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Link
                    to="/dashboard"
                    className="hover:text-aira-primary transition-colors flex items-center gap-1"
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-900 font-medium">Simulasi IPK</span>
                </div>
                <button
                  onClick={() => {
                    // Handle PDF download
                    window.print();
                  }}
                  className="px-4 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download pdf
                </button>
              </div>

              {/* Results Card */}
              <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 md:p-8 space-y-6 origin-top scale-[0.9]">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* IPS Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IPS
                    </label>
                    <input
                      type="text"
                      value={ips.toFixed(2)}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700 text-lg font-medium"
                    />
                  </div>

                  {/* IPK Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IPK
                    </label>
                    <input
                      type="text"
                      value={ipk.toFixed(2)}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700 text-lg font-medium"
                    />
                  </div>

                  {/* Total SKS Semester Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total SKS Semester
                    </label>
                    <input
                      type="text"
                      value={totalSKS}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700 text-lg font-medium"
                    />
                  </div>

                  {/* Total SKS Selesai Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total SKS Selesai
                    </label>
                    <input
                      type="text"
                      value={totalSKSSelesai}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700 text-lg font-medium"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Academic Status
                  </h3>

                  {/* Mobile Card Layout */}
                  <div className="space-y-3 md:hidden">
                    {courses.length === 0 ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center text-gray-500">
                        No courses available
                      </div>
                    ) : (
                      courses.map((course) => (
                        <div
                          key={course.id}
                          className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2"
                        >
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Mata Kuliah
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                              {course.mataKuliah}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                SKS
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {course.sks}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Tingkat
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {course.tingkat || "-"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              Prediksi
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                              {course.prediksi || "-"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:block bg-gray-100 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Mata Kuliah
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              SKS
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Tingkat
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Prediksi
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-4 py-8 text-center text-gray-500 bg-white"
                              >
                                No courses available
                              </td>
                            </tr>
                          ) : (
                            courses.map((course, index) => (
                              <tr
                                key={course.id}
                                className={`${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                              >
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {course.mataKuliah}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {course.sks}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {course.tingkat || ""}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {course.prediksi || ""}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => setIsEndSessionDialogOpen(true)}
                      className="w-full sm:w-auto px-6 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                      End Session
                    </button>
                  </div>
                  <div className="flex items-center gap-0 text-sm text-gray-500">
                    <span>made by</span>
                    <img
                      src="/assets/images/logo-aira.png"
                      alt="AIRA"
                      className="w-12 h-12 -ml-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Exit Confirmation Dialog */}
        <Dialog
          open={isExitConfirmationOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleExitCancel();
            }
          }}
        >
          <DialogContent className="p-0 overflow-hidden max-w-sm">
            <div className="relative bg-white rounded-lg text-center">
              {/* Icon */}
              <div className="flex justify-center items-center pt-8 pb-4">
                <div className="w-20 h-20 border-4 border-aira-primary rounded-full flex items-center justify-center">
                  <span className="text-aira-primary text-4xl font-bold">?</span>
                </div>
              </div>
              {/* Question Text */}
              <div className="px-6 pb-2">
                <DialogTitle className="text-xl font-bold text-gray-800">
                  Keluar dari Simulasi IPK?
                </DialogTitle>
              </div>
              {/* Subtitle */}
              <div className="px-6 pb-6">
                <DialogDescription className="text-sm text-gray-600">
                  Perubahan yang belum disimpan akan hilang.
                </DialogDescription>
              </div>
              {/* Buttons */}
              <div className="flex justify-center gap-4 px-6 pb-6">
                <button
                  onClick={handleExitCancel}
                  className="px-8 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleExitConfirm}
                  className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Yes
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* End Session Confirmation Dialog */}
        <Dialog
          open={isEndSessionDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleEndSessionCancel();
            }
          }}
        >
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
                  onClick={handleEndSessionCancel}
                  className="px-8 py-2 bg-[#690E0E] hover:bg-[#510a0a] text-white font-medium rounded-lg transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleEndSessionConfirm}
                  className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Yes, End Session
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // Form Page (before submit)
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Sidebar Toggle */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-aira-primary to-aira-secondary h-[72px] relative overflow-visible shadow-lg">
        {/* Decorative gradient circles */}
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] rounded-full opacity-[0.08] bg-gradient-to-br from-white via-white/50 to-transparent pointer-events-none" />
        <div className="absolute -left-32 -top-32 w-[500px] h-[500px] opacity-[0.1] pointer-events-none">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
        <div className="relative h-full flex items-center justify-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <h1 className="text-white text-xl md:text-2xl font-bold text-center">
            Simulasi IPK
          </h1>
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
            {/* Logo di Sidebar (besar tapi tidak mendorong tombol) */}
            <div className="relative flex justify-center mb-6 -mt-2 h-[160px] overflow-visible">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="p-0 bg-transparent"
                aria-label="Ke Dashboard"
              >
                <img
                  src="/assets/images/logo-aira-footer.png"
                  alt="AIRA Logo"
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-8 w-[240px] h-[240px] object-contain"
                />
              </button>
            </div>
            <button
              onClick={() => {
                navigate("/dashboard");
                setIsSidebarOpen(false);
              }}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/20 transition-colors font-medium"
            >
              Profile
            </button>
            <button className="w-full text-left py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
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
              <span className="text-gray-900 font-medium">Simulasi IPK</span>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 origin-top scale-[0.9]">
              <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-end">
                {/* Semester Dropdown */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester*
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-[20px] border border-gray-300 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-aira-primary focus:border-transparent cursor-pointer"
                    >
                      <option value="" disabled>
                        Choose your semester prediction
                      </option>
                      {semesterOptions.map((semester) => (
                        <option key={semester} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180" />
                  </div>
                </div>

                {/* Study Plan Dropdown */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Plan*
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedStudyPlan}
                      onChange={(e) => setSelectedStudyPlan(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-[20px] border border-gray-300 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-aira-primary focus:border-transparent cursor-pointer"
                    >
                      <option value="" disabled>
                        Choose your study plan
                      </option>
                      {studyPlanOptions.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180" />
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex-1 md:flex-none">
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedSemester || !selectedStudyPlan || !allCoursesHavePrediksi}
                    className="w-full md:w-auto px-8 py-3 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-[20px] transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 origin-top scale-[0.9]">
              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-4">
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No courses available.
                  </div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          Mata Kuliah
                        </h4>
                        <p className="text-sm text-gray-700">{course.mataKuliah}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            SKS
                          </h4>
                          <p className="text-sm text-gray-700">{course.sks}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            Tingkat
                          </h4>
                          <p className="text-sm text-gray-700">{course.tingkat}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          Prediksi
                        </h4>
                        <div className="relative inline-block group w-full">
                          <select
                            value={course.prediksi}
                            onChange={(e) =>
                              handleUpdatePrediksi(course.id, e.target.value)
                            }
                            className="w-full pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-aira-primary focus:border-transparent cursor-pointer text-sm"
                          >
                            <option value="">Pilih</option>
                            {prediksiOptions.map((prediksi) => (
                              <option key={prediksi} value={prediksi}>
                                {prediksi}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          Action
                        </h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Mata Kuliah
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        SKS
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tingkat
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Prediksi
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No courses available.
                        </td>
                      </tr>
                    ) : (
                      courses.map((course) => (
                        <tr
                          key={course.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.mataKuliah}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.sks}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.tingkat}
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative inline-block group">
                              <select
                                value={course.prediksi}
                                onChange={(e) =>
                                  handleUpdatePrediksi(course.id, e.target.value)
                                }
                                className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-aira-primary focus:border-transparent cursor-pointer text-sm min-w-[70px]"
                              >
                                <option value="">Pilih</option>
                                {prediksiOptions.map((prediksi) => (
                                  <option key={prediksi} value={prediksi}>
                                    {prediksi}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180" />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold text-sm rounded-lg transition-colors flex items-center justify-center"
                              >
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm rounded-lg transition-colors flex items-center justify-center"
                              >
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  {courses.length > 0 && (
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700">
                        Total SKS: {totalSKS}
                      </p>
                      {totalSKS > 24 && (
                        <p className="text-sm font-medium text-red-600 mt-1">
                          ⚠️ Warning: Total SKS melebihi 24 SKS
                        </p>
                      )}
                    </div>
                  )}
                  {courses.length === 0 && <div />}
                  <button
                    onClick={handleAddCourse}
                    className="px-6 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Mata Kuliah
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Boxes - Shown after Generate */}
            {isGenerated && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Hasil Perhitungan
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* IPS Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IPS (Indeks Prestasi Semester)
                    </label>
                    <input
                      type="text"
                      value={ips.toFixed(2)}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700 text-lg font-medium"
                    />
                  </div>

                  {/* IPK Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IPK (Indeks Prestasi Kumulatif)
                    </label>
                    <input
                      type="text"
                      value={ipk.toFixed(2)}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700 text-lg font-medium"
                    />
                  </div>

                  {/* Total SKS Semester Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total SKS Semester
                    </label>
                    <input
                      type="text"
                      value={totalSKS}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700 text-lg font-medium"
                    />
                  </div>

                  {/* Total SKS Selesai Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total SKS Selesai
                    </label>
                    <input
                      type="text"
                      value={totalSKSSelesai}
                      readOnly
                      className="w-full px-6 py-4 rounded-[20px] border border-gray-300 bg-gray-50 text-gray-700 text-lg font-medium"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Course Dialog - Search & Select */}
      {!editingCourse && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Tambah Mata Kuliah
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              {/* Filter/Search Section */}
              <div className="flex gap-3 items-end flex-shrink-0">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat
                  </label>
                  <div className="relative group">
                    <select
                      value={filterTingkat}
                      onChange={(e) => setFilterTingkat(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-aira-primary focus:border-transparent cursor-pointer"
                    >
                      <option value="">Semua Tingkat</option>
                      {tingkatOptions.map((tingkat) => (
                        <option key={tingkat} value={tingkat}>
                          Tingkat {tingkat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Mata Kuliah
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-aira-primary"
                      placeholder="Masukkan nama mata kuliah"
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Search className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Course List Table */}
              <div className="border rounded-lg overflow-hidden flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Nama Mata Kuliah
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tingkat
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        SKS
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                        Add
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          Tidak ada mata kuliah yang ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((course, index) => (
                        <tr
                          key={course.id}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-blue-50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.nama_mk || course.nama}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.tingkat}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.sks}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                handleAddCourseFromList(course);
                                setIsDialogOpen(false);
                                setSearchQuery("");
                                setFilterTingkat("");
                              }}
                              className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-5 h-5 text-white" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Course Dialog - Search & Select */}
      {editingCourse && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Edit Mata Kuliah
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              {/* Filter/Search Section */}
              <div className="flex gap-3 items-end flex-shrink-0">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat
                  </label>
                  <div className="relative">
                    <select
                      value={filterTingkat}
                      onChange={(e) => setFilterTingkat(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-aira-primary focus:border-transparent cursor-pointer"
                    >
                      <option value="">Semua Tingkat</option>
                      {tingkatOptions.map((tingkat) => (
                        <option key={tingkat} value={tingkat}>
                          Tingkat {tingkat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Mata Kuliah
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-aira-primary"
                      placeholder="Masukkan nama mata kuliah"
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Search className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Course List Table */}
              <div className="border rounded-lg overflow-hidden flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Nama Mata Kuliah
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tingkat
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        SKS
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                        Add
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          Tidak ada mata kuliah yang ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((course, index) => (
                        <tr
                          key={course.id}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-blue-50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.nama_mk || course.nama}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.tingkat}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.sks}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                handleUpdateCourseFromList(course);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-5 h-5 text-white" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onOpenChange={setIsDeleteConfirmationOpen}
      >
        <DialogContent className="p-0 overflow-hidden max-w-sm">
          <div className="relative bg-white rounded-lg text-center">
            {/* Trash Icon */}
            <div className="flex justify-center items-center pt-8 pb-4">
              <Trash2 className="w-20 h-20 text-aira-primary" />
            </div>
            {/* Question Text */}
            <div className="px-6 pb-6">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Delete Mata Kuliah?
              </DialogTitle>
            </div>
            {/* Buttons */}
            <div className="flex justify-center gap-4 px-6 pb-6">
              <button
                onClick={() => {
                  setIsDeleteConfirmationOpen(false);
                  setCourseToDelete(null);
                }}
                className="px-8 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmDeleteCourse}
                className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <DialogContent className="p-0 overflow-hidden max-w-sm">
          <div className="relative bg-white rounded-lg text-center">
            {/* Illustration */}
            <div className="flex justify-center items-center pt-8 pb-4">
              <img
                src="/assets/images/edit-ilustration.png"
                alt="Confirmation"
                className="w-20 h-20 object-contain"
              />
            </div>
            {/* Question Text */}
            <div className="px-6 pb-6">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Edit Mata Kuliah ?
              </DialogTitle>
            </div>
            {/* Buttons */}
            <div className="flex justify-center gap-4 px-6 pb-6">
              <button
                onClick={() => setIsConfirmationDialogOpen(false)}
                className="px-8 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  setIsConfirmationDialogOpen(false);
                  setSearchQuery("");
                  setFilterTingkat("");
                  setIsDialogOpen(true);
                }}
                className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Success Dialog */}
      <Dialog
        open={isDeleteSuccessOpen}
        onOpenChange={setIsDeleteSuccessOpen}
      >
        <DialogContent className="p-0 overflow-hidden max-w-sm">
          <div className="relative bg-white rounded-lg text-center">
            {/* Trash Icon */}
            <div className="flex justify-center items-center pt-8 pb-4">
              <Trash2 className="w-20 h-20 text-aira-primary" />
            </div>
            {/* Success Message */}
            <div className="px-6 pb-6">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Mata Kuliah successfully deleted
              </DialogTitle>
            </div>
            {/* Button */}
            <div className="flex justify-center px-6 pb-6">
              <button
                onClick={() => setIsDeleteSuccessOpen(false)}
                className="px-12 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading Dialog */}
      <Dialog 
        open={isLoadingDialogOpen} 
        onOpenChange={() => {
          // Prevent closing during loading - do nothing
        }}
      >
        <DialogContent className="p-0 overflow-hidden border-0 [&>button]:hidden">
          <div className="relative bg-white rounded-lg">
            {/* Illustration */}
            <div className="flex justify-center items-center pt-8 pb-4">
              <img
                src="/assets/images/generate-ilustration.png"
                alt="Generating Study Plan"
                className="w-full max-w-md h-auto"
              />
            </div>
            {/* Loading Text */}
            <div className="px-6 pb-8 text-center">
              <p className="text-lg font-medium text-gray-700">
                Generating Your Study Plan.....
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog
        open={isExitConfirmationOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleExitCancel();
          }
        }}
      >
        <DialogContent className="p-0 overflow-hidden max-w-sm">
          <div className="relative bg-white rounded-lg text-center">
            {/* Icon */}
            <div className="flex justify-center items-center pt-8 pb-4">
              <div className="w-20 h-20 border-4 border-aira-primary rounded-full flex items-center justify-center">
                <span className="text-aira-primary text-4xl font-bold">?</span>
              </div>
            </div>
            {/* Question Text */}
            <div className="px-6 pb-2">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Keluar dari Simulasi IPK?
              </DialogTitle>
            </div>
            {/* Subtitle */}
            <div className="px-6 pb-6">
              <DialogDescription className="text-sm text-gray-600">
                Perubahan yang belum disimpan akan hilang.
              </DialogDescription>
            </div>
            {/* Buttons */}
            <div className="flex justify-center gap-4 px-6 pb-6">
              <button
                onClick={handleExitCancel}
                className="px-8 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={handleExitConfirm}
                className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* End Session Confirmation Dialog */}
      <Dialog
        open={isEndSessionDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleEndSessionCancel();
          }
        }}
      >
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
                onClick={handleEndSessionCancel}
                className="px-8 py-2 bg-[#690E0E] hover:bg-[#510a0a] text-white font-medium rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={handleEndSessionConfirm}
                className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Yes, End Session
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SKS Warning Dialog */}
      <Dialog
        open={isSKSWarningOpen}
        onOpenChange={setIsSKSWarningOpen}
      >
        <DialogContent className="p-0 overflow-hidden max-w-sm">
          <div className="relative bg-white rounded-lg text-center">
            {/* Warning Icon */}
            <div className="flex justify-center items-center pt-8 pb-4">
              <div className="w-20 h-20 border-4 border-red-600 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-4xl font-bold">!</span>
              </div>
            </div>
            {/* Warning Message */}
            <div className="px-6 pb-2">
              <DialogTitle className="text-xl font-bold text-gray-800">
                SKS yang diambil lebih dari 24
              </DialogTitle>
            </div>
            {/* Subtitle */}
            <div className="px-6 pb-6">
              <DialogDescription className="text-sm text-gray-600">
                Total SKS melebihi batas maksimal 24 SKS.
              </DialogDescription>
            </div>
            {/* Button */}
            <div className="flex justify-center px-6 pb-6">
              <button
                onClick={() => setIsSKSWarningOpen(false)}
                className="px-8 py-2 bg-aira-primary hover:bg-aira-secondary text-white font-medium rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}

