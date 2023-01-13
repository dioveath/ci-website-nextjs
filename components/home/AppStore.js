import { useRef } from "react";
import Image from "next/image";

export default function AppStore() {
  const emailRef = useRef();

  const onSendClicked = () => {
    console.log("Mission failed successfully!");
  };

  return (
    <div className="w-full flex justify-center px-8 md:px-10 xl:px-20 2xl:px-48">
      <div className="flex flex-wrap justify-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="max-w-xs object-contain"
          alt="Charicha Institute App"
          src="/app.png"
        />
        <div className="max-w-lg flex flex-col justify-center">
          <p className="text-3xl text-white"> Find us in PlayStore </p>
          <p className="text-white mt-10 font-normal">
            Enter your email id for the download link
          </p>
          <div className="mt-2 flex gap-4">
            <input
              ref={emailRef}
              className="w-full px-4 py-2 border-full border-[2px] border-white/60 bg-gray-50/60 rounded-xl outline-none transition-all"
              name=""
              type="text"
            />
            <button
              className="w-full rounded-xl bg-cheeseyellow text-white shadow-lg"
              onClick={onSendClicked}
            >
              Send Link
            </button>
          </div>
          <p className="mt-2 text-xs text-white">
            {" "}
            By clicking &quot;Send Link&quot; you agree to our Terms of Serivice
            & Privacy Policy.
          </p>
          <a href="https:play.google.com/store/apps/dev?id=8427452924742673238&hl=en&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Get it on Google Play" src="/google-play-badge.png" />
          </a>
        </div>
      </div>
    </div>
  );
}
