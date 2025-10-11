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

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-accent/85 to-primary/90 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <Sprout className="h-14 w-14 text-white animate-float" />
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
                className="bg-white text-primary hover:bg-white/95 font-semibold px-10 py-7 text-lg shadow-strong hover:scale-105 transition-all duration-300 group"
                asChild
              >
                <Link to="/auth">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-24 bg-gradient-to-b from-background via-accent-light/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              Everything You Need for Regenerative Farming
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Powered by AI, driven by science, designed for farmers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group" style={{ animationDelay: '0.1s' }}>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">AI Soil Analyzer</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get detailed AI-powered soil health reports with actionable recommendations for improving pH, nutrients, and organic matter.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group" style={{ animationDelay: '0.2s' }}>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300">
                <CloudRain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">Climate Prediction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hyperlocal weather forecasts and climate risk alerts help you prepare for droughts, floods, and temperature extremes.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group" style={{ animationDelay: '0.3s' }}>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">Smart Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor all your farms in one place with real-time data visualization and trend analysis for informed decisions.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group" style={{ animationDelay: '0.4s' }}>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary-glow flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">AI Farm Advisor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chat with our AI expert for personalized regenerative farming advice tailored to your soil and climate conditions.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group" style={{ animationDelay: '0.5s' }}>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">Community Hub</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with fellow farmers, share success stories, and learn from the collective wisdom of regenerative agriculture.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-strong transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in-up hover:-translate-y-2 group" style={{ animationDelay: '0.6s' }}>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">Farm Mapping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize your farms on interactive maps with detailed health indicators and satellite data integration.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-accent to-primary-glow text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
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
                "Personalized regenerative farming advice",
                "Community knowledge sharing",
                "Interactive farm mapping",
                "Data-driven decision making",
                "Sustainable agriculture practices",
                "Increased crop yields & soil health"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 animate-fade-in-up hover:scale-105" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CheckCircle className="h-7 w-7 text-white flex-shrink-0 mt-1" />
                  <p className="text-lg text-white/98 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-accent-light/30 via-background to-background relative">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-8">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of farmers building a sustainable future through regenerative agriculture.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent text-white font-semibold px-14 py-8 text-xl shadow-strong hover:scale-110 hover:shadow-accent transition-all duration-300 group"
              asChild
            >
              <Link to="/auth">
                Get Started Free <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary to-primary-glow text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
            <Sprout className="h-10 w-10 animate-float" />
            <span className="text-3xl font-bold">AgroReGen</span>
          </div>
          <p className="text-white/90 text-lg">
            Climate-Smart Agriculture for a Sustainable Future
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;