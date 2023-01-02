import Head from "next/head";
import Navbar from "../../components/Navbar.js";
import { BsChevronDoubleDown } from "react-icons/bs";
import styles from "../../styles/services/Services.module.css";
import ServiceCard from "../../components/services/ServiceCard.js";
import Footer from "../../components/footer/Footer.js";

import { services } from "./service_list";

import { useCallback } from 'react';
import { loadFull } from 'tsparticles';
import Particles from 'react-particles';
import { particleConfig } from '../../lib/particle_config';

export default function Services() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    console.log(container);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title> Charicha Insitute </title>
        <meta name="description" content="Charicha Institute Services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={"bg-gradient-[-45deg] from-eggblue to-slategray pb-10"}>
        <Navbar path={'/services'}/>
        <Particles init={particlesInit} loaded={particlesLoaded} options={particleConfig}/>        

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
