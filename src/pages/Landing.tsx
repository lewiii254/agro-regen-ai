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
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Sprout className="h-12 w-12 text-accent" />
              <h1 className="text-6xl font-bold text-white">AgroReGen</h1>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              AI-Powered Climate-Smart Agriculture for Regenerative Farming
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Monitor soil health, predict climate risks, and get expert AI guidance to transform your farm into a sustainable, regenerative ecosystem.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-6 text-lg shadow-strong"
                asChild
              >
                <Link to="/auth">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-6 text-lg"
                asChild
              >
                <Link to="/auth">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need for Regenerative Farming
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by AI, driven by science, designed for farmers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-medium transition-all duration-300 border-border/50 bg-card">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sprout className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">AI Soil Analyzer</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get detailed AI-powered soil health reports with actionable recommendations for improving pH, nutrients, and organic matter.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-medium transition-all duration-300 border-border/50 bg-card">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <CloudRain className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Climate Prediction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hyperlocal weather forecasts and climate risk alerts help you prepare for droughts, floods, and temperature extremes.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-medium transition-all duration-300 border-border/50 bg-card">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Smart Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor all your farms in one place with real-time data visualization and trend analysis for informed decisions.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-medium transition-all duration-300 border-border/50 bg-card">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Leaf className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">AI Farm Advisor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chat with our AI expert for personalized regenerative farming advice tailored to your soil and climate conditions.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-medium transition-all duration-300 border-border/50 bg-card">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Community Hub</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with fellow farmers, share success stories, and learn from the collective wisdom of regenerative agriculture.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-medium transition-all duration-300 border-border/50 bg-card">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <MapPin className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Farm Mapping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize your farms on interactive maps with detailed health indicators and satellite data integration.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
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
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg text-white/95">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of farmers building a sustainable future through regenerative agriculture.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-6 text-lg shadow-strong"
            asChild
          >
            <Link to="/auth">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="h-8 w-8" />
            <span className="text-2xl font-bold">AgroReGen</span>
          </div>
          <p className="text-white/80">
            Climate-Smart Agriculture for a Sustainable Future
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;