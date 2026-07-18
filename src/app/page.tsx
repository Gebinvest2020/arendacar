import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { PopularCars } from "@/components/home/PopularCars";
import { Advantages } from "@/components/home/Advantages";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Terms } from "@/components/home/Terms";
import { Contacts } from "@/components/home/Contacts";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <PopularCars />
      <Advantages />
      <HowItWorks />
      <Terms />
      <Contacts />
      <FinalCta />
    </>
  );
}
