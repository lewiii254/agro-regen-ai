import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  CloudRain, 
  TrendingUp, 
  Users, 
  MapPin, 
  Leaf,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import heroImage from "@/assets/hero-farmland.jpg";
import Footer from "@/components/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background with Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-emerald-800/90 to-teal-900/95 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
        </div>
        
        {/* Floating Animated Particles/Icons */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Floating Leaf Icons */}
          <div className="absolute top-20 left-10 text-white/10 animate-float">
            <Leaf className="h-20 w-20" />
          </div>
          <div className="absolute top-40 right-20 text-white/10 animate-float-delayed">
            <Sprout className="h-24 w-24" />
          </div>
          <div className="absolute bottom-32 left-1/4 text-white/10 animate-float" style={{ animationDelay: '1s' }}>
            <CloudRain className="h-16 w-16" />
          </div>
          <div className="absolute bottom-20 right-1/3 text-white/10 animate-float-delayed" style={{ animationDelay: '1.5s' }}>
            <Leaf className="h-12 w-12" />
          </div>
          
          {/* Animated Circuit-like Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <circle cx="50" cy="50" r="2" fill="white" className="animate-pulse" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" opacity="0.3" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit)" />
              </svg>
            </div>
          </div>
          
          {/* Animated Data Stream Effect */}
          <div className="absolute top-1/4 left-0 w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-slide-up" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/3 right-1/4 w-px h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-slide-up" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-px h-28 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-slide-up" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="relative">
                <Sprout className="h-14 w-14 text-white animate-pulse-scale" />
                <div className="absolute inset-0 animate-glow-pulse rounded-full" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white">AgroReGen</h1>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              AI-Powered Climate-Smart Agriculture for Regenerative Farming
            </h2>
            
            <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Monitor soil health, predict climate risks, and get expert AI guidance to transform your farm into a sustainable, regenerative ecosystem.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/95 font-semibold px-10 py-7 text-lg shadow-strong hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                asChild
              >
                <Link to="/auth">
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-10 py-7 text-lg hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/auth">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background via-accent-light/20 to-background relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary-glow/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              Everything You Need for Regenerative Farming
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Powered by AI, driven by science, designed for farmers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <Sprout className="h-8 w-8 text-white animate-wiggle" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-primary-glow opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">AI Soil Analyzer</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get detailed AI-powered soil health reports with actionable recommendations for improving pH, nutrients, and organic matter.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <CloudRain className="h-8 w-8 text-white animate-bounce-subtle" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent to-primary opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">Climate Prediction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hyperlocal weather forecasts and climate risk alerts help you prepare for droughts, floods, and temperature extremes.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <TrendingUp className="h-8 w-8 text-white animate-pulse" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">Yield Prediction</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered crop yield forecasting helps you plan harvest schedules and optimize farm productivity.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary-glow flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <Leaf className="h-8 w-8 text-white animate-float" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent to-primary-glow opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">AI Farm Advisor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chat with our AI expert for personalized regenerative farming advice tailored to your soil and climate conditions.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <Users className="h-8 w-8 text-white animate-pulse-scale" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">Community Hub</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with fellow farmers, share success stories, and learn from the collective wisdom of regenerative agriculture.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <MapPin className="h-8 w-8 text-white animate-bounce-subtle" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent to-primary opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">Farm Mapping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize your farms on interactive maps with detailed health indicators and satellite data integration.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.7s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-blue-600 transition-colors">Smart Irrigation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimize water usage with intelligent irrigation scheduling and automated water management recommendations.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.8s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-red-600 transition-colors">Pest & Disease Detection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Early warning system for pest and disease outbreaks with AI-powered treatment recommendations.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group relative overflow-hidden" style={{ animationDelay: '0.9s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300 relative">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 opacity-50 blur-md group-hover:blur-lg transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-emerald-600 transition-colors">Market Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time crop price tracking and market trends to help you make informed selling decisions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-accent to-primary-glow text-white relative overflow-hidden">
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-20 opacity-20">
          <div className="w-32 h-32 border-4 border-white rounded-full animate-rotate-slow" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <div className="w-24 h-24 border-4 border-white rounded-lg animate-rotate-slow" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold mb-16 text-center animate-fade-in-up">
              Why Choose AgroReGen?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "AI-powered soil health analysis",
                "Real-time climate risk predictions",
                "Crop yield forecasting & planning",
                "Smart irrigation management",
                "Pest & disease early detection",
                "Market price intelligence",
                "Community knowledge sharing",
                "Interactive farm mapping",
                "Educational resources & tutorials",
                "Data-driven decision making",
                "Sustainable agriculture practices",
                "Increased crop yields & soil health"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 animate-fade-in-up hover:scale-105 group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CheckCircle className="h-7 w-7 text-white flex-shrink-0 mt-1 group-hover:animate-pulse" />
                  <p className="text-lg text-white/98 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-accent-light/30 via-background to-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-8">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of farmers building a sustainable future through regenerative agriculture.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent text-white font-semibold px-14 py-8 text-xl shadow-strong hover:scale-110 hover:shadow-accent transition-all duration-300 group relative overflow-hidden"
              asChild
            >
              <Link to="/auth">
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;