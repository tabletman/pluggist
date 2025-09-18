import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import PremiumSubscription from "@/components/PremiumSubscription";

export default function SubscriptionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-8">
          <div className="container">
            <PremiumSubscription />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
