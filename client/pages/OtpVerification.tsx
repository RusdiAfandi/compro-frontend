import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [currentSlide, setCurrentSlide] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

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
      text: "Building Tomorrow's Architecture on Our Expertise"
    }
  ];

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Timer countdown
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    // Image slider
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      // Verify OTP here
      console.log("OTP:", otpValue);
      navigate("/dashboard");
    }
  };

  const handleResend = () => {
    setTimer(300);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
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
            to="/login"
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
                  alt={`OTP Verification Illustration ${index + 1}`}
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

          {/* Right Side - OTP Form */}
          <div className="flex flex-col items-center justify-center order-2 md:order-none">
            <div className="w-full max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold text-aira-gray-dark mb-4 text-center">
                OTP Verification
              </h1>
              <p className="text-aira-gray-dark text-center mb-8">
                Masukkan kode OTP yang sudah dikirimkan ke email Anda
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Timer */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-aira-gray-dark">
                    {formatTime(timer)}
                  </span>
                </div>

                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-2 md:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-aira-primary focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={otp.join("").length !== 6}
                  className="w-full bg-aira-primary hover:bg-aira-secondary disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-white font-bold text-xl py-4 rounded-[40px] shadow-lg"
                >
                  Submit
                </button>

                {/* Resend Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0}
                    className="text-aira-primary hover:text-aira-secondary disabled:text-gray-400 disabled:cursor-not-allowed font-medium underline"
                  >
                    Kirim ulang kode OTP
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
