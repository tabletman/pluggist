import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PlannerContainer } from "@/components/trip-planner/planner-container";

export default function TripPlannerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PlannerContainer />
      </main>
      <Footer />
    </div>
  );
}
