import DashboardComponent from "./DashboardClient";
import { fetchDefaultUserCurrency } from "@/app/data/currency";

export default async function DashboardPage() {
  const defaultUserCurrency = await fetchDefaultUserCurrency();
  return <DashboardComponent defaultUserCurrency={defaultUserCurrency} />;
}
