interface ProjectSpecsProps {
  localisation: string;
  annee: number | string;
  surface: number | string;
}

export function ProjectSpecs({ localisation, annee, surface }: ProjectSpecsProps) {
  return (
    <div className="bg-white border border-neutral-200/80 rounded-sm p-8 space-y-6 lg:sticky lg:top-28 shadow-sm">
      <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-3">
        Fiche Technique
      </h3>
      <dl className="space-y-4 text-sm font-light">
        <div className="flex justify-between items-baseline border-b border-neutral-50 pb-2">
          <dt className="text-neutral-400">Localisation</dt>
          <dd className="font-medium text-neutral-800 text-right">{localisation}</dd>
        </div>
        <div className="flex justify-between items-baseline border-b border-neutral-50 pb-2">
          <dt className="text-neutral-400">Année de livraison</dt>
          <dd className="font-mono text-neutral-800">{annee}</dd>
        </div>
        <div className="flex justify-between items-baseline pb-2">
          <dt className="text-neutral-400">Superficie</dt>
          <dd className="font-mono text-neutral-800">{surface} m²</dd>
        </div>
      </dl>
    </div>
  );
}
