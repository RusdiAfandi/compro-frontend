import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-aira-primary w-full overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute right-0 top-1/3 w-[1027px] h-[1157px] rounded-full opacity-[0.06] bg-gradient-to-br from-white via-white/50 to-transparent pointer-events-none" />
      <div className="absolute -left-32 -top-[583px] w-[1027px] h-[1157px] opacity-[0.13] pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/assets/images/logo-aira-footer.png"
              alt="AIRA Logo"
              className="w-48 h-48 md:w-56 md:h-56"
            />
          </div>

          {/* Get in Touch Section */}
          <div className="flex flex-col">
            <h3 className="text-white font-rubik text-xl font-semibold mb-6">
              Get in Touch
            </h3>
            <div className="space-y-4 text-aira-text-light">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                <span className="text-base">Telkomuniversity@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
                <span className="text-base">081929328191</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
                <span className="text-base">
                  Jl. Telekomunikasi Terusan Buahbatu No.1, Sukapura, Kec.
                  Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257
                </span>
              </div>
            </div>
          </div>

          {/* Explore and Socials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Explore Links */}
            <div>
              <h3 className="text-white font-rubik text-xl font-semibold mb-6">
                Explore
              </h3>
              <ul className="space-y-3 text-aira-text-light text-base">
                <li>
                  <Link 
                    to="/dashboard" 
                    className="hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/simulasi-ipk" 
                    className="hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Simulasi IPK
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/integrasi-minat" 
                    className="hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Integrasi Minat
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-white font-rubik text-xl font-semibold mb-6">
                Socials
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <img
                      src="/assets/icons/icon-line.png"
                      alt="Line"
                      className="w-5 h-5"
                    />
                  </div>
                  <span className="text-aira-text-light text-base">Line</span>
                </li>
                <li className="flex items-center gap-3">
                  <img
                    src="/assets/icons/icon-linkedin.png"
                    alt="LinkedIn"
                    className="w-7 h-7"
                  />
                  <span className="text-aira-text-light text-base">
                    Linkedin
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <img
                    src="/assets/icons/icon-instagram.png"
                    alt="Instagram"
                    className="w-7 h-7"
                  />
                  <span className="text-aira-text-light text-base">
                    Instagram
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <img
                    src="/assets/icons/icon-facebook.png"
                    alt="Facebook"
                    className="w-6 h-7"
                  />
                  <span className="text-aira-text-light text-base">
                    Facebook
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-aira-accent py-4">
        <p className="text-center text-[#333] font-semibold text-lg">
          Copyright © 2025 AIRA
        </p>
      </div>
    </footer>
  );
}
