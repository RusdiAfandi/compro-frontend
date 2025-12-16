import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { authService } from "@/lib/api-service";
import { setAuthToken } from "@/lib/api-config";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const slides = [
    {
      image: "/assets/images/login-illustration.png",
      text: "Empowering Intelligence Through Innovation"
    },
    {
      image: "/assets/images/login-illustration2.png",
      text: "Advancing Knowledge Through Technology"
    },
    {
      image: "/assets/images/login-illustration3.png",
      text: "Building Tomorrow with Our Expertise"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      username: !username,
      password: !password,
    };
    setErrors(newErrors);

    if (!newErrors.username && !newErrors.password) {
      setIsLoading(true);
      try {
        const response = await authService.login(username, password);
        
        if (response.success) {
          // Store the token
          setAuthToken(response.data.token);
          
          // Store user data in localStorage for later use
          localStorage.setItem('userData', JSON.stringify(response.data));
          
          toast({
            title: "Login Berhasil",
            description: `Selamat datang, ${response.data.nama}!`,
          });
          
          // Skip OTP and go directly to dashboard
          navigate("/dashboard");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: error instanceof Error ? error.message : "Terjadi kesalahan saat login",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Logo and Back Button */}
      <header className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <img
            src="/assets/images/logo-aira.png"
            alt="AIRA Logo"
            className="w-32 md:w-48 h-32 md:h-48"
          />
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-aira-secondary" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Illustration */}
          <div className="flex flex-col items-center justify-center order-1 md:order-none">
            <div className="relative w-full max-w-xs md:max-w-md aspect-square">
              {slides.map((slide, index) => (
                <img
                  key={index}
                  src={slide.image}
                  alt={`Login Illustration ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
            <p className="text-aira-gray-dark text-lg md:text-2xl font-medium text-center mt-4 md:mt-8 transition-opacity duration-500">
              {slides[currentSlide].text}
            </p>
            <div className="flex justify-center gap-3 mt-4">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-2 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? "bg-aira-gray-dark" : "bg-aira-gray-light"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-lg mx-auto md:mx-0 order-2 md:order-none">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
                  SSO LOGIN
                </h1>
                <p className="text-xl md:text-2xl font-light text-black">
                  Single Account, Single Sign On login
                </p>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Student ID"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((prev) => ({ ...prev, username: false }));
                  }}
                  className="w-full px-6 py-5 rounded-[20px] border border-aira-gray-medium bg-[#FFFBFB] text-lg font-poppins font-medium placeholder:text-aira-text-gray focus:outline-none focus:ring-2 focus:ring-aira-secondary"
                />
                {errors.username && (
                  <p className="text-[#D71616] text-sm opacity-60">
                    *Please input username
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: false }));
                    }}
                    className="w-full px-6 py-5 rounded-[20px] border border-aira-gray-medium bg-[#FFFBFB] text-lg font-poppins font-medium placeholder:text-aira-text-gray focus:outline-none focus:ring-2 focus:ring-aira-secondary pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#ABA0A0]"
                  >
                    <Eye className="w-8 h-5" />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#D71616] text-sm opacity-60">
                    *Please enter password
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-[20px] border border-aira-gray-medium bg-aira-primary hover:bg-aira-secondary transition-colors text-white text-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
