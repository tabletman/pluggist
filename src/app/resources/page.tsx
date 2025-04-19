import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/5 py-12">
          <div className="container">
            <h1 className="text-4xl font-bold mb-6">EV Resources & Education</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mb-8">
              Find helpful guides, educational content, and resources to help you navigate
              the world of electric vehicles and charging infrastructure.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">EV Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "EV Charging 101",
                  description: "Learn about the different types of EV charging, connector types, and charging speeds."
                },
                {
                  title: "First-Time EV Buyer's Guide",
                  description: "Everything you need to know before purchasing your first electric vehicle."
                },
                {
                  title: "Home Charging Installation",
                  description: "Step-by-step guide to installing a home charging station for your electric vehicle."
                },
                {
                  title: "EV Road Trip Planning",
                  description: "Tips and strategies for planning long-distance travel in your electric vehicle."
                },
                {
                  title: "EV Tax Incentives",
                  description: "Understanding federal, state, and local incentives for electric vehicle purchases."
                },
                {
                  title: "Charging Etiquette",
                  description: "Best practices and etiquette for using public charging stations."
                }
              ].map((guide, i) => (
                <div key={i} className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                  <p className="text-muted-foreground mb-4">{guide.description}</p>
                  <a href="#" className="text-primary font-medium hover:underline">Read guide →</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Educational Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((video) => (
                <div key={video} className="bg-card rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">EV Video Title #{video}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Duration: 12:34 • 1.2K views</p>
                    <p className="text-muted-foreground mb-4">
                      Short description of this educational video about electric vehicles and charging.
                    </p>
                    <a href="#" className="text-primary font-medium hover:underline">Watch video →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">FAQ</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "How long does it take to charge an electric vehicle?",
                  answer: "Charging time depends on the vehicle's battery size, the charging station's power output, and the current battery level. Level 1 charging (standard household outlet) can take 8-24 hours for a full charge. Level 2 charging stations typically provide a full charge in 4-10 hours. DC Fast Charging can charge a battery to 80% in 20-60 minutes."
                },
                {
                  question: "What's the difference between Level 1, Level 2, and DC Fast Charging?",
                  answer: "Level 1 charging uses a standard 120V household outlet and provides about 2-5 miles of range per hour of charging. Level 2 charging uses a 240V outlet (like those for dryers) and provides 10-30 miles of range per hour. DC Fast Charging uses direct current and can provide 100-200+ miles of range in 30 minutes, but not all EVs support this."
                },
                {
                  question: "How much does it cost to charge an electric vehicle?",
                  answer: "The cost varies depending on your electricity rates and charging location. Home charging typically costs $0.08-$0.20 per kWh, making a full charge cost $5-$15 for most EVs. Public charging stations may charge $0.20-$0.50 per kWh or by session. Some locations offer free charging as a customer incentive."
                },
                {
                  question: "How far can electric vehicles go on a single charge?",
                  answer: "The range varies by model. Current EVs offer anywhere from 100 miles to over 500 miles on a single charge. Most new EVs on the market have ranges between 200-300 miles, which is sufficient for daily commuting and many road trips with planned charging stops."
                },
                {
                  question: "Can I install a home charging station in my apartment?",
                  answer: "This depends on your apartment's parking situation and management. If you have a dedicated parking space with access to electricity, you might be able to install a charging station with permission. Some apartment complexes are adding EV charging as an amenity. Discuss options with your property manager or landlord."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">Have More Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team is ready to help you with any questions you might have about electric vehicles,
              charging infrastructure, or using PLUGGIST.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium">
                Contact Support
              </a>
              <a href="#" className="inline-flex items-center bg-card text-card-foreground border hover:bg-accent px-6 py-3 rounded-md font-medium">
                Join Community
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}