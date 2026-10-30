function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="js-contact-details space-y-2">
      <h4 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
        {label}
      </h4>
      {children}
    </div>
  );
}

const linkClass = "block text-lg font-light text-neutral-800 hover:text-neutral-500 transition-colors";

export function ContactDetails() {
  return (
    <div className="lg:col-span-1 flex flex-col justify-center space-y-10 lg:pl-4">
      <InfoBlock label="Nouvelles Affaires">
        <a href="mailto:marie.clcasa@gmail.com" className={`${linkClass} border-b border-transparent hover:border-neutral-400 w-max`}>
          marie.clcasa@gmail.com
        </a>
      </InfoBlock>

      <InfoBlock label="Téléphone">
        <a href="tel:+33652055586" className={`${linkClass} font-mono`}>
          +33 6 52 05 55 86
        </a>
      </InfoBlock>

      <InfoBlock label="Le Studio">
        <address className="text-base font-light text-neutral-600 not-italic leading-relaxed">
          A Tiusella, Strada di Zora
          <br />
          20126 Evisa, Corse,
          <br />
          France
        </address>
      </InfoBlock>
    </div>
  );
}
