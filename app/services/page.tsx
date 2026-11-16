import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charicha Institute',
  description: 'Charicha Institute Services'
};

export const revalidate = 60;

import Navbar from "../../components/Navbar";
import { BsChevronDoubleDown } from "react-icons/bs";
import styles from "../../styles/services/Services.module.css";
import ServiceCard from "../../components/services/ServiceCard";
import Footer from "../../components/footer/Footer";

import { services as servicesFallback } from "../../components/services/service_list";
import { getServices } from "../../lib/sanity/fetchers";
import ParticlesBackground from '../../components/ParticlesBackground';


export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className={styles.container}>

      <main className={"bg-linear-[-45deg] from-eggblue to-slategray pb-10"}>
        <Navbar path={'/services'}/>
        <ParticlesBackground/>

        <div className="px-8 md:px-10 xl:px-20 2xl:px-48 mt-10">
          <h2 className="text-2xl text-white"> Our Services </h2>
          <p className={"text-white font-light mt-2"}>
            Our computer institute offers training courses, certification exam
            prep, computer repair, network and security consulting, web design
            and development, and data recovery services. Our team of
            professionals is dedicated to providing high-quality service.
          </p>

          <div className="w-full flex justify-center mt-10 mb-6">
            <BsChevronDoubleDown className="text-white text-[40px] animate-bounce" />
          </div>

          <div className={styles["service-container"]}>
            {services.map((s) => (
              <ServiceCard key={s.title} title={s.title}>
                {s.description}
              </ServiceCard>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

