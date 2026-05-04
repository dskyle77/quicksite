import { getPricing } from "@/server/adminFirestore";
import PricingScreen from "@/screen/admin/PricingScreen";
import { DEFAULT_PRICING } from "@/screen/admin/adminTypes";

export default async function AdminPricingPage() {
  const pricing = await getPricing();
  return <PricingScreen initialPricing={pricing ?? DEFAULT_PRICING} />;
}