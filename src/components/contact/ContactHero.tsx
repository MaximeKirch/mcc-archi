export function ContactHero() {
  return (
    <div className="lg:col-span-3 flex flex-col justify-center pr-0 lg:pr-12">
      <h1 className="text-4xl md:text-6xl xl:text-7xl font-extralight tracking-tighter uppercase leading-[1.05] text-neutral-900">
        <div className="overflow-hidden block py-1 js-contact-title">
          <span className="block">Bâtissons votre</span>
        </div>
        <div className="overflow-hidden block py-1 js-contact-title">
          <span className="block font-semibold">prochain espace.</span>
        </div>
      </h1>
      <p className="js-contact-details text-neutral-500 font-light mt-8 text-base md:text-lg max-w-md leading-relaxed">
        Nous sommes toujours à la recherche de nouveaux défis architecturaux.
        Partagez votre vision avec notre studio à Evisa.
      </p>
    </div>
  );
}
