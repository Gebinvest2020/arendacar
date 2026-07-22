import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/data/site";

// Финальная CTA с крупным фрагментом существующего фото авто (водяной знак сохранён).
const CTA_IMAGE = "/cars/porsche-cayenne/03-side.webp";

export function FinalCta() {
  const t = useTranslations();
  const phoneHref = "tel:" + site.phone.replace(/[^\d+]/g, "");

  return (
    <section id="cta" className="bg-graphite py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[4px] border border-white/10">
          <div className="absolute inset-0" dir="ltr" aria-hidden="true">
            <Image
              src={CTA_IMAGE}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/85 to-graphite/45" />
          </div>

          <div className="relative px-6 py-14 sm:px-12 sm:py-16">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight text-milk sm:text-5xl">
                {t("finalCta.title")}
              </h2>
              <p className="mt-4 text-base leading-7 text-milk/75">{t("finalCta.subtitle")}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <ButtonLink href="/cars" variant="champagne" size="lg" className="px-8">
                  {t("finalCta.button")}
                  <span aria-hidden="true">→</span>
                </ButtonLink>
                <a
                  href={phoneHref}
                  dir="ltr"
                  className="text-sm font-semibold text-milk transition-colors hover:text-champagne"
                >
                  {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
