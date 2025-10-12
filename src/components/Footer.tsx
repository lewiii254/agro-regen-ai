import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary to-primary-glow text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sprout className="h-8 w-8 animate-float" />
              <span className="text-2xl font-bold">AgroReGen</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              AI-Powered Climate-Smart Agriculture for Regenerative Farming. Transform your farm into a sustainable ecosystem.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/soil-analyzer" className="text-white/80 hover:text-white transition-colors text-sm">
                  Soil Analyzer
                </Link>
              </li>
              <li>
                <Link to="/climate-alerts" className="text-white/80 hover:text-white transition-colors text-sm">
                  Climate Alerts
                </Link>
              </li>
              <li>
                <Link to="/learning-hub" className="text-white/80 hover:text-white transition-colors text-sm">
                  Learning Hub
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-white/80 hover:text-white transition-colors text-sm">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/community-hub" className="text-white/80 hover:text-white transition-colors text-sm">
                  Community Hub
                </Link>
              </li>
              <li>
                <Link to="/market-prices" className="text-white/80 hover:text-white transition-colors text-sm">
                  Market Prices
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-white/80 hover:text-white transition-colors text-sm">
                  AI Farm Advisor
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">support@agroregen.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm">Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm">
              © 2025 AgroReGen. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
