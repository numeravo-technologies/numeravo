import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import GuidePageShell from "@/components/guides/GuidePageShell";

const faqItems = [
  {
    question: "How do you prepare ground for a concrete slab?",
    answer:
      "A practical sequence is to mark the slab layout, remove vegetation and organic topsoil, excavate to the required elevation, grade the subgrade, place the specified base material, compact the soil and base as required, set the forms, and verify final elevation before concrete placement. Site conditions and local requirements can change the exact sequence.",
  },
  {
    question: "Do I need gravel under a concrete slab?",
    answer:
      "A compactable granular base is commonly used beneath many slabs, but the required material and depth depend on slab use, soil, drainage, project specifications, and the locally adopted code. Do not treat a general planning depth as a structural or code requirement.",
  },
  {
    question: "How deep should I dig for a concrete slab?",
    answer:
      "For quantity planning, total excavation depth starts with the planned slab thickness plus the planned base depth. That geometric total does not include every site-specific requirement, such as frost protection, unsuitable-soil removal, drainage work, or engineered subgrade improvements.",
  },
  {
    question: "Should ground be compacted before concrete?",
    answer:
      "Uniform support matters. Fill and granular base are commonly compacted so the slab is not placed over loose, unstable material. The required compaction method, lift thickness, moisture conditioning, and verification should follow the project specification or qualified professional when those requirements apply.",
  },
  {
    question: "Where does a vapor retarder go under a concrete slab?",
    answer:
      "Interior slabs that require moisture protection may also require a vapor retarder. Its material and placement should follow the project specification and locally adopted code. NRMCA CIP 29 discusses vapor retarders under slabs on grade and why placement details matter.",
  },
  {
    question: "Does frost depth change slab preparation?",
    answer:
      "Frost protection can affect foundations, supports, insulation, and site preparation in cold climates. The excavation formula in this guide is a material-planning formula only; verify the locally adopted frost provisions and project design before construction.",
  },
  {
    question: "When should I involve a contractor or engineer?",
    answer:
      "Get qualified help when the site has expansive or weak soil, deep or uncontrolled fill, drainage problems, significant slopes, heavy or structural loads, frost-protection requirements, or other conditions that make slab support or drainage more than a basic material-planning task.",
  },
] as const;

const references = [
  {
    organization: "American Concrete Institute (ACI)",
    title: "ACI 302.1R-15 — Guide to Concrete Floor and Slab Construction",
    href: "https://www.concrete.org/Portals/0/Files/PDF/302.1R-15_Chapter5.pdf",
    type: "Technical guidance",
    supports:
      "Site-preparation, soil-support-system, base/subbase, and moisture-protection context for slabs-on-ground.",
  },
  {
    organization: "International Code Council (ICC)",
    title: "2024 International Residential Code — Section R506, Concrete Floors (On Ground)",
    href: "https://codes.iccsafe.org/content/IRC2024V1.1/chapter-5-floors",
    type: "2024 model code reference",
    supports:
      "Example model-code provisions for slab-on-ground site preparation, fill support, base course, and vapor-retarder requirements. Local jurisdictions may adopt a different edition or amendments.",
  },
  {
    organization: "International Code Council (ICC)",
    title: "2024 International Residential Code — Section R403.1.4.1 Frost Protection",
    href: "https://codes.iccsafe.org/content/IRC2024V1.1/chapter-4-foundations",
    type: "2024 model code reference",
    supports:
      "Example model-code frost-protection provisions showing why frost requirements must be verified separately from simple slab/base quantity calculations. Local adoption and amendments vary.",
  },
  {
    organization: "National Ready Mixed Concrete Association (NRMCA)",
    title: "CIP 29 — Vapor Retarders Under Slabs on Grade",
    href: "https://www.nrmca.org/wp-content/uploads/2021/01/29pr.pdf",
    type: "Technical guidance",
    supports:
      "Vapor-retarder purpose, material considerations, and placement guidance for moisture-sensitive slab applications.",
  },
  {
    organization: "811 / Common Ground Alliance",
    title: "811 Before You Dig",
    href: "https://811beforeyoudig.com/",
    type: "Official utility-locate resource",
    supports:
      "The excavation checklist reminder to contact 811 or the applicable state 811 center before digging so buried utilities can be located.",
  },
] as const;

const workflowSteps = [
  {
    number: "1",
    title: "Layout",
    text: "Confirm slab dimensions, setbacks, finished elevation, and access before excavation.",
  },
  {
    number: "2",
    title: "Remove organics",
    text: "Remove grass, roots, topsoil, and other organic or unstable material from the slab area.",
  },
  {
    number: "3",
    title: "Excavate",
    text: "Excavate for the planned slab and base while allowing for any site-specific correction work.",
  },
  {
    number: "4",
    title: "Grade",
    text: "Shape the subgrade to the required elevation and drainage plan; correct obvious soft spots.",
  },
  {
    number: "5",
    title: "Place base",
    text: "Install the specified gravel, crushed stone, or other compactable base material in appropriate lifts.",
  },
  {
    number: "6",
    title: "Compact",
    text: "Compact the subgrade and base as the project requires so the slab has uniform support.",
  },
  {
    number: "7",
    title: "Set forms & verify",
    text: "Set forms, recheck dimensions and elevation, and confirm the site is ready for the remaining slab scope.",
  },
] as const;

const toolsAndMaterials = [
  {
    title: "Plate compactor",
    text: "Useful for compacting many granular base materials in accessible slab areas. Match equipment and lift thickness to the material and project requirements.",
  },
  {
    title: "Laser or rotary level",
    text: "Helps verify excavation depth, base elevation, form height, and finished-grade relationships.",
  },
  {
    title: "String line, stakes & marking tools",
    text: "Useful for layout, square checks, edges, grade reference, and keeping excavation tied to the planned slab footprint.",
  },
  {
    title: "Rake, shovel & grading tools",
    text: "Used to remove loose material, distribute base, shape grade, and correct small elevation differences.",
  },
  {
    title: "Form materials",
    text: "Boards, stakes, fasteners, and bracing define slab edges and help preserve finished elevation before placement.",
  },
  {
    title: "PPE",
    text: "Use task-appropriate personal protective equipment and follow equipment-manufacturer and site-safety requirements.",
  },
] as const;

export const metadata: Metadata = {
  title: "How to Prepare Ground for Concrete Slab | Gravel Base Guide",
  description:
    "Learn how to prepare ground for a concrete slab, including excavation, grading, gravel base depth, compaction, forms, and slab preparation steps.",
  alternates: {
    canonical:
      "https://numeravo.com/construction/how-to-prepare-ground-for-concrete-slab",
  },
  openGraph: {
    title: "How to Prepare Ground for Concrete Slab | Numeravo",
    description:
      "Step-by-step guide to prepare ground for concrete slabs, patios, driveways, shed pads, and walkways.",
    url: "https://numeravo.com/construction/how-to-prepare-ground-for-concrete-slab",
    siteName: "Numeravo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Prepare Ground for Concrete Slab | Numeravo",
    description:
      "Prepare ground for a concrete slab with excavation, grading, gravel base, compaction, and slab layout steps.",
  },
};

export default function PrepareGroundForConcreteSlabPage() {
  const faqSchema = faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  return (
    <GuidePageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://numeravo.com",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Construction",
                    item: "https://numeravo.com/construction",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "How to Prepare Ground for Concrete Slab",
                    item: "https://numeravo.com/construction/how-to-prepare-ground-for-concrete-slab",
                  },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: faqSchema,
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />

      <div
        className="-mx-6 -my-16 min-h-screen px-6 py-16"
        style={{
          backgroundColor: "#090D14",
          backgroundImage: `
            linear-gradient(rgba(249,115,22,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.035) 1px, transparent 1px),
            radial-gradient(circle at 50% 0%, rgba(249,115,22,0.10), transparent 34rem)
          `,
          backgroundSize: "32px 32px, 32px 32px, auto",
        }}
      >
        <section className="mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Concrete Slab Prep Guide
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How to Prepare Ground for Concrete Slab
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#A0AEC0]">
            Prepare a slab site by establishing the layout and elevation,
            removing unsuitable surface material, grading and compacting the
            support system, placing the required base, setting forms, and
            verifying the site before concrete placement.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#7F8A9B]">
            This guide helps with construction planning and material quantity.
            It does not determine structural adequacy, drainage design, frost
            protection, soil remediation, or code compliance. Verify those
            requirements for the actual site and jurisdiction.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/construction/gravel-calculator"
              className="rounded-xl bg-[#F97316] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#fb8a3c]"
            >
              Estimate Gravel Base
            </Link>

            <Link
              href="/construction/project/concrete-slab-equipment-pad"
              className="rounded-xl border border-[#F97316]/60 bg-[#2A170D] px-5 py-3 text-center text-sm font-semibold text-[#FDBA74] transition hover:border-[#F97316] hover:text-white"
            >
              Plan the Slab Project
            </Link>

            <Link
              href="/construction/concrete-slab-calculator"
              className="rounded-xl border border-[#1F2937] px-5 py-3 text-center text-sm font-semibold text-[#A0AEC0] transition hover:border-[#F97316] hover:text-white"
            >
              Concrete Slab Guide
            </Link>
          </div>
        </div>

        <section className="mt-10 border-l-4 border-[#F97316] pl-5 sm:pl-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">
            Direct answer
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            What is the practical ground-preparation sequence?
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#A0AEC0]">
            A practical sequence is: lay out the slab, remove organic and
            unstable material, excavate to the planned elevation, grade the
            subgrade, place the specified base, compact the support system, set
            the forms, and verify dimensions and finished elevation. The exact
            base, compaction, drainage, vapor, frost, and soil requirements
            remain project- and jurisdiction-specific.
          </p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Ground preparation sequence">
            {workflowSteps.map((step, index) => (
              <span
                key={step.number}
                className="inline-flex items-center gap-2 rounded-full border border-[#2A3444] bg-[#0B0F19] px-3 py-2 text-xs font-semibold text-[#D1D5DB]"
              >
                <span className="text-[#F97316]">{step.number}</span>
                {step.title}
                {index < workflowSteps.length - 1 ? (
                  <span className="text-[#4B5563]" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <VisualCard
            src="/guides/concrete-slab-ground-preparation-cross-section.webp"
            width={768}
            height={904}
            alt="Conceptual concrete slab ground-preparation cross-section showing the concrete slab, optional moisture-control layer, compacted base, prepared subgrade, natural soil, and finished-grade drainage relationship."
            eyebrow="Technical visual"
            title="Slab preparation cross-section"
            caption="Conceptual only. Base thickness, moisture protection, insulation, drainage, and soil treatment must match the project requirements."
          />

          <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
              Know the boundary
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Planning guidance is not site design
            </h2>
            <div className="mt-5 space-y-3">
              <AssumptionRow
                label="Numeravo planning assumption"
                text="Use measured length, width, planned slab thickness, and planned base depth to estimate quantities."
              />
              <AssumptionRow
                label="Common construction practice"
                text="Remove organic/unstable material and provide reasonably uniform support before placing the slab system."
              />
              <AssumptionRow
                label="Supplier-dependent value"
                text="Aggregate density, gradation, delivered quantity, and compaction behavior vary by material and supplier."
              />
              <AssumptionRow
                label="Site-specific condition"
                text="Soil strength, moisture, drainage, slope, fill history, groundwater, and access can change the preparation plan."
              />
              <AssumptionRow
                label="Engineering requirement"
                text="Structural slabs, weak or expansive soils, heavy loads, and unusual site conditions may require a designed support system."
              />
              <AssumptionRow
                label="Model code"
                text="The 2024 IRC references on this page are model-code examples that illustrate relevant slab-on-ground and frost topics; they are not automatically the governing requirements for a project."
              />
              <AssumptionRow
                label="Local adopted code"
                text="The project jurisdiction may adopt a different code edition or local amendments. Verify the currently adopted requirements, permits, and inspections before construction."
              />
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
              Field sequence
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Ground preparation steps for a concrete slab
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#A0AEC0]">
              Good slab preparation starts before concrete arrives. Work from
              layout and elevation toward a stable, uniformly supported slab
              area, and stop to resolve site conditions that do not match the
              project assumptions.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                text={step.text}
              />
            ))}
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl border border-[#263041] bg-[#0B0F19]">
            <ResponsiveGuideImage
              src="/guides/concrete-slab-ground-preparation-workflow.svg"
              width={600}
              height={1040}
              alt="Seven-step concrete slab ground preparation workflow: layout, remove organics, excavate, grade, place base, compact, and set forms and verify elevation."
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-7">
            <h2 className="text-2xl font-semibold">
              Excavation and base calculation
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#A0AEC0]">
              Use the geometry below for planning quantities. Keep the raw
              calculated base volume separate from waste, density, supplier
              rounding, and delivery assumptions.
            </p>

            <div className="mt-5 space-y-4">
              <FormulaBox
                title="Total planning depth"
                formula="Slab thickness + Base depth = Planned excavation depth"
                text="Use the same length unit for both thickness values. This is a geometric planning total, not a frost-depth or soil-design calculation."
              />
              <FormulaBox
                title="Raw base volume"
                formula="Length × Width × Base depth = Base material volume"
                text="For imperial calculations, convert base depth from inches to feet before multiplying. Divide cubic feet by 27 to convert to cubic yards."
              />
              <FormulaBox
                title="Ordering allowance"
                formula="Raw volume × (1 + allowance %) = Allowance-adjusted volume"
                text="The Numeravo Gravel Calculator applies the selected waste/allowance after the raw volume calculation, then uses the selected material density to estimate weight."
              />
            </div>

            <div className="mt-6 rounded-2xl border border-[#2A3444] bg-[#0B0F19] p-5">
              <h3 className="font-semibold text-white">Variables and units</h3>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Definition label="Length / width" value="feet or meters" />
                <Definition label="Slab / base depth" value="inches or centimeters for planning inputs" />
                <Definition label="Raw base volume" value="ft³, yd³, or m³" />
                <Definition label="Allowance" value="separate percentage added after raw volume" />
                <Definition label="Material density" value="supplier/material-dependent" />
                <Definition label="Order quantity" value="verify with supplier and field conditions" />
              </dl>
            </div>
          </div>

          <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-7">
            <h2 className="text-2xl font-semibold">
              Worked example: 12 × 20 ft patio
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#A0AEC0]">
              Assume a 12 ft × 20 ft slab area, a 4 in concrete slab, and a 4 in
              planned granular base. The simple excavation planning depth is 8
              in before any site-specific correction. For the base quantity:
            </p>

            <div className="mt-5 rounded-2xl border border-[#F97316]/30 bg-[#2A170D]/50 p-5">
              <p className="font-mono text-sm leading-7 text-[#FDBA74]">
                12 ft × 20 ft × (4 in ÷ 12) = 80 ft³
                <br />
                80 ft³ ÷ 27 = 2.96 yd³
              </p>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#A0AEC0]">
              The 2.96 yd³ result is the raw geometric base volume. Waste,
              compaction/placement allowance, material density, and supplier
              ordering rules are separate inputs. Use the Gravel Calculator to
              model those values rather than embedding a second calculator here.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ExampleCard label="Slab area" value="12 × 20 ft" />
              <ExampleCard label="Planned slab" value="4 in" />
              <ExampleCard label="Planned base" value="4 in" />
              <ExampleCard label="Raw base volume" value="2.96 yd³" />
            </div>
          </div>
        </section>

        <section className="mt-12 border-t border-[#263041] pt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
                Base-depth context
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Let site conditions drive the base requirement
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#A0AEC0]">
                This pilot intentionally avoids broad depth recommendations.
                Base requirements depend on subgrade, drainage, loading,
                material properties, climate, and the project requirements. Use
                the dedicated base-depth guide for deeper planning context, then
                verify the actual site and governing requirements.
              </p>
            </div>

            <Link
              href="/construction/base-for-concrete-slab-depth"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#F97316]/50 px-4 py-3 text-sm font-semibold text-[#FDBA74] transition hover:border-[#F97316] hover:text-white"
            >
              Read the base-depth guide →
            </Link>
          </div>

          <div className="mt-6 divide-y divide-[#263041] border-y border-[#263041]">
            <PlanningContextRow
              label="Walkway / patio"
              text="Base requirements depend on the subgrade, drainage, selected materials, finished elevation, and project conditions."
            />
            <PlanningContextRow
              label="Driveway / garage"
              text="Vehicle loading, subgrade strength, aggregate type, drainage, and locally adopted requirements can materially change the support system."
            />
            <PlanningContextRow
              label="Weak or disturbed soil"
              text="Soft, expansive, uncontrolled, or disturbed material may require additional excavation, stabilization, testing, or site-specific evaluation."
            />
            <PlanningContextRow
              label="Drainage / frost conditions"
              text="Verify the actual drainage plan, climate exposure, frost provisions, and locally adopted code rather than relying on a generic depth value."
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-7">
            <h2 className="text-2xl font-semibold">
              Ground preparation checklist
            </h2>

            <ul className="mt-5 space-y-3 text-sm leading-6 text-[#A0AEC0]">
              <ChecklistItem>Confirm slab location, dimensions, and finished elevation.</ChecklistItem>
              <ChecklistItem>Contact 811 / the applicable utility-locate service before digging.</ChecklistItem>
              <ChecklistItem>Remove grass, roots, topsoil, and other organic material.</ChecklistItem>
              <ChecklistItem>Excavate for the planned slab and base while watching for unsuitable soil.</ChecklistItem>
              <ChecklistItem>Correct obvious soft spots or uncontrolled material before covering them.</ChecklistItem>
              <ChecklistItem>Grade the subgrade to the project elevation and drainage plan.</ChecklistItem>
              <ChecklistItem>Place the specified gravel, crushed stone, or other base.</ChecklistItem>
              <ChecklistItem>Compact the support system as required by the project.</ChecklistItem>
              <ChecklistItem>Set forms square, stable, and at the intended elevation.</ChecklistItem>
              <ChecklistItem>Verify vapor, insulation, reinforcement, utilities, and other below-slab items before placement when they apply.</ChecklistItem>
            </ul>
          </div>

          <div className="rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-7">
            <h2 className="text-2xl font-semibold">
              Common preparation mistakes
            </h2>

            <ul className="mt-5 space-y-3 text-sm leading-6 text-[#A0AEC0]">
              <ChecklistItem>Placing the slab system over vegetation, organic topsoil, or obvious unstable material.</ChecklistItem>
              <ChecklistItem>Using a generic base depth without checking actual soil, drainage, load, or project requirements.</ChecklistItem>
              <ChecklistItem>Leaving loose fill or granular base without the required compaction.</ChecklistItem>
              <ChecklistItem>Ignoring drainage or allowing surface water to collect toward the slab or structure.</ChecklistItem>
              <ChecklistItem>Confusing raw geometric volume with the amount that should be ordered.</ChecklistItem>
              <ChecklistItem>Setting forms before final elevation and base thickness have been verified.</ChecklistItem>
              <ChecklistItem>Forgetting vapor, insulation, embedded utilities, or other below-slab requirements for the intended use.</ChecklistItem>
              <ChecklistItem>Treating this guide as a substitute for local code, project specifications, or site-specific engineering.</ChecklistItem>
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">
            Common base material categories
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#A0AEC0]">
            Crushed stone, graded aggregate/road base, and other compactable
            granular materials are used for many slab-support applications.
            Material names and gradations vary by supplier and specification, so
            select the material by required performance and project documents,
            not the label alone.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MaterialCard
              title="Crushed stone"
              text="Angular aggregate can be used in compactable support layers when its gradation and drainage characteristics match the project."
            />
            <MaterialCard
              title="Graded aggregate / road base"
              text="Well-graded aggregate is commonly used where a dense, compacted base is intended. Local specifications and supplier names vary."
            />
            <MaterialCard
              title="Clean gravel / granular base"
              text="Granular materials can support drainage or slab-base objectives depending on gradation, subgrade, and project design."
            />
          </div>
        </section>

        <section className="mt-12 border-t border-[#263041] pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
            Project planning
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Tools & materials for site preparation
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#A0AEC0]">
            The exact tools depend on slab size, access, material, and site
            conditions. This section is a planning checklist, not a product
            endorsement.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolsAndMaterials.map((item) => (
              <ToolCard key={item.title} title={item.title} text={item.text} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
              Sources & verification
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Technical references used for this guide
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#A0AEC0]">
              These sources support specific site-preparation, vapor, frost, and
              utility-location guidance. The ICC links use the 2024 IRC
              consistently as a model-code reference; the project jurisdiction
              may adopt a different edition or local amendments, so verify the
              code actually in force for the site.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {references.map((reference) => (
              <ReferenceCard key={reference.href} {...reference} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#F97316]/30 bg-[#121826] p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
                Continue the project
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Carry the site plan into the slab workflow
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#A0AEC0]">
                The existing Concrete Slab / Equipment Pad project keeps the
                same project dimensions connected across concrete quantity,
                base, reinforcement, formwork, delivery, pumping, labor,
                finishing, and joints.
              </p>
            </div>

            <Link
              href="/construction/project/concrete-slab-equipment-pad"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#F97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#EA580C]"
            >
              Start slab project →
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Related tools and guides</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <RelatedLink
              href="/construction/gravel-calculator"
              title="Gravel Calculator"
              text="Estimate base volume, allowance-adjusted quantity, material weight, and cost without duplicating calculation logic in this guide."
            />

            <RelatedLink
              href="/construction/base-for-concrete-slab-depth"
              title="Base for Concrete Slab Depth"
              text="Review base-depth planning factors and the site conditions that can change the required support system."
            />

            <RelatedLink
              href="/construction/concrete-slab-calculator"
              title="Concrete Slab Guide"
              text="Connect slab dimensions to concrete quantity and the wider slab project scope."
            />

            <RelatedLink
              href="/construction/concrete-calculator"
              title="Concrete Calculator"
              text="Calculate concrete volume, waste-adjusted quantity, and material needs for the slab itself."
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#1F2937] bg-[#121826] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">
            Ground preparation FAQ
          </h2>

          <div className="mt-6 space-y-5">
            {faqItems.map((item) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </section>
        </section>
      </div>
    </GuidePageShell>
  );
}

function VisualCard({
  src,
  width,
  height,
  alt,
  eyebrow,
  title,
  caption,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  eyebrow: string;
  title: string;
  caption: string;
}) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-[#1F2937] bg-[#121826]">
      <div className="p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      </div>
      <div className="overflow-hidden border-y border-[#263041] bg-[#0B0F19]">
        <ResponsiveGuideImage
          src={src}
          width={width}
          height={height}
          alt={alt}
        />
      </div>
      <figcaption className="p-6 text-sm leading-6 text-[#7F8A9B]">
        {caption}
      </figcaption>
    </figure>
  );
}

function ResponsiveGuideImage({
  src,
  width,
  height,
  alt,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
}) {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      unoptimized
      alt={alt}
      className="mx-auto h-auto w-full max-w-[600px]"
    />
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative border-t border-[#263041] pt-5 pl-12">
      <div className="absolute top-5 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#F97316] text-sm font-bold text-white">
        {number}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{text}</p>
    </div>
  );
}

function FormulaBox({
  title,
  formula,
  text,
}: {
  title: string;
  formula: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#263041] bg-[#0B0F19] p-5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 break-words font-mono text-sm leading-6 text-[#FDBA74]">
        {formula}
      </p>
      <p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{text}</p>
    </div>
  );
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7F8A9B]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-white">{value}</dd>
    </div>
  );
}

function AssumptionRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-t border-[#263041] py-3 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F97316]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{text}</p>
    </div>
  );
}

function PlanningContextRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
      <h3 className="text-sm font-semibold text-white">{label}</h3>
      <p className="text-sm leading-6 text-[#A0AEC0]">{text}</p>
    </div>
  );
}

function ExampleCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#263041] bg-[#0B0F19] p-4">
      <p className="text-sm text-[#A0AEC0]">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#F97316]">{value}</p>
    </div>
  );
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 text-[#F97316]" aria-hidden="true">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

function MaterialCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#263041] bg-[#0B0F19] p-5">
      <div className="mb-4 h-2 w-10 rounded-full bg-[#F97316]" />
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{text}</p>
    </div>
  );
}

function ToolCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-[#263041] pt-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{text}</p>
    </div>
  );
}

function ReferenceCard({
  organization,
  title,
  href,
  type,
  supports,
}: {
  organization: string;
  title: string;
  href: string;
  type: string;
  supports: string;
}) {
  return (
    <article className="rounded-2xl border border-[#263041] bg-[#0B0F19] p-5">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-[#F97316]/35 bg-[#2A170D] px-2.5 py-1 font-semibold text-[#FDBA74]">
          {type}
        </span>
        <span className="rounded-full border border-[#263041] px-2.5 py-1 text-[#A0AEC0]">
          {organization}
        </span>
      </div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#A0AEC0]">
        <span className="font-semibold text-white">Supports: </span>
        {supports}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex text-sm font-semibold text-[#F97316] transition hover:text-[#FDBA74]"
      >
        Open source ↗
      </a>
    </article>
  );
}

function RelatedLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[#263041] bg-[#0B0F19] p-5 transition hover:border-[#F97316]"
    >
      <div className="mb-4 h-2 w-10 rounded-full bg-[#F97316]" />
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#A0AEC0]">{text}</p>
    </Link>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-[#1F2937] pb-5 last:border-b-0 last:pb-0">
      <h3 className="font-semibold text-white">{question}</h3>
      <p className="mt-2 text-sm leading-6 text-[#A0AEC0]">{answer}</p>
    </div>
  );
}
