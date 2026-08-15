import Image from "next/image";
import AnimatedContent from "@/components/AnimatedContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const schoolFacts = [
  { label: "NPSN", value: "20574648" },
  { label: "Status", value: "SMP swasta" },
  { label: "Akreditasi", value: "B" },
  { label: "Berdiri", value: "16 April 2010" },
] as const;

const learningFocus = [
  {
    number: "01",
    title: "Ilmu yang menjadi bekal",
    body: "Pembelajaran jenjang SMP menjadi pijakan siswa untuk melanjutkan pendidikan dan berkembang di tengah masyarakat.",
  },
  {
    number: "02",
    title: "Nilai Islam dalam keseharian",
    body: "Identitas sekolah tumbuh bersama lingkungan Yayasan Pondok Pesantren Salafiyah Darussalam.",
  },
  {
    number: "03",
    title: "Sekolah yang dekat dengan keluarga",
    body: "Informasi sekolah, pendaftaran, dan komunikasi dibuka melalui kanal resmi yang mudah dijangkau.",
  },
] as const;

const schoolJsonLd = {
  "@context": "https://schema.org",
  "@type": "School",
  name: "SMP Islam Darussalam Dongko",
  identifier: "NPSN 20574648",
  foundingDate: "2010-04-16",
  email: "smpislamdarussalamdongko@gmail.com",
  telephone: "+62 852-3158-6065",
  address: {
    "@type": "PostalAddress",
    streetAddress: "RT 01 RW 01, Desa Dongko",
    addressLocality: "Kecamatan Dongko",
    addressRegion: "Kabupaten Trenggalek, Jawa Timur",
    postalCode: "66363",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -8.1897,
    longitude: 111.5703,
  },
};

export default function SchoolHome() {
  return (
    <main className="school-home" id="beranda">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: The payload is a static, locally defined schema object.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }}
      />

      <nav className="school-nav" aria-label="Navigasi utama">
        <a
          className="school-brand"
          href="#beranda"
          aria-label="SMP Islam Darussalam Dongko, kembali ke beranda"
        >
          <Image src="/images/smp-islam-darussalam-dongko.svg" alt="" width={46} height={46} />
          <span>
            <strong>SMP Islam Darussalam</strong>
            <small>Dongko, Trenggalek</small>
          </span>
        </a>
        <div className="school-nav-links">
          <a href="#profil">Profil</a>
          <a href="#pendidikan">Pendidikan</a>
          <a href="#informasi">Informasi</a>
          <a href="#ppdb">PPDB</a>
          <a href="#kontak">Kontak</a>
        </div>
        <Button asChild variant="outline" size="sm" className="school-nav-action">
          <a href="/dashboard" aria-label="Buka demo sistem informasi sekolah">
            Demo
          </a>
        </Button>
      </nav>

      <section className="school-hero" aria-labelledby="hero-title">
        <div className="school-hero-copy">
          <AnimatedContent distance={32} duration={0.72} threshold={0.25}>
            <p className="school-kicker">Sekolah Islam di Dongko, Trenggalek</p>
            <h1 id="hero-title">Tumbuh dalam ilmu, teguh dalam akhlak.</h1>
            <p className="school-hero-summary">
              Pendidikan jenjang SMP di bawah naungan Yayasan Pondok Pesantren Salafiyah Darussalam.
            </p>
            <div className="school-actions">
              <Button asChild size="lg" className="school-button-primary">
                <a href="#ppdb">Informasi pendaftaran</a>
              </Button>
              <Button asChild variant="link" size="lg" className="school-text-link">
                <a href="#profil">Mengenal sekolah</a>
              </Button>
            </div>
          </AnimatedContent>
        </div>

        <Card className="school-identity-panel" aria-label="Identitas resmi sekolah">
          <div className="school-identity-year" aria-hidden="true">
            2010
          </div>
          <AnimatedContent
            className="school-identity-logo-motion"
            distance={38}
            direction="horizontal"
            reverse
            duration={0.82}
            delay={0.12}
            threshold={0.25}
          >
            <Image
              className="school-hero-logo"
              src="/images/smp-islam-darussalam-dongko.svg"
              alt="Logo SMP Islam Darussalam Dongko"
              width={256}
              height={256}
              priority
            />
          </AnimatedContent>
          <div className="school-identity-caption-wrap">
            <Separator className="school-identity-separator" />
            <div className="school-identity-caption">
              <span>SMP Islam Darussalam Dongko</span>
              <strong>NPSN 20574648</strong>
            </div>
          </div>
        </Card>
      </section>

      <AnimatedContent className="school-fact-motion" distance={24} duration={0.68} threshold={0.2}>
        <Card className="school-fact-strip" aria-label="Ringkasan profil sekolah">
          {schoolFacts.map((fact) => (
            <div key={fact.label}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </Card>
      </AnimatedContent>

      <section id="profil" className="school-section school-profile">
        <AnimatedContent
          className="school-motion-column"
          distance={28}
          duration={0.68}
          threshold={0.22}
        >
          <div className="school-section-heading">
            <h2>Berakar di Dongko, bertumbuh bersama masyarakat.</h2>
          </div>
        </AnimatedContent>
        <AnimatedContent
          className="school-profile-motion"
          distance={32}
          direction="horizontal"
          duration={0.72}
          threshold={0.22}
        >
          <Card className="school-profile-body">
            <CardContent className="school-profile-card-content">
              <p className="school-profile-lead">
                SMP Islam Darussalam Dongko adalah sekolah menengah pertama swasta yang berdiri
                sejak 16 April 2010 di Kecamatan Dongko, Kabupaten Trenggalek.
              </p>
              <p>
                Sekolah berada di bawah naungan Yayasan Pondok Pesantren Salafiyah Darussalam.
                Identitas kelembagaan, akreditasi, serta izin operasionalnya tercatat pada data
                referensi resmi Kementerian Pendidikan Dasar dan Menengah.
              </p>
              <Button asChild variant="link" className="school-source-link">
                <a
                  href="https://referensi.data.kemdikbud.go.id/tabs.php?npsn=20574648"
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat data resmi sekolah
                </a>
              </Button>
            </CardContent>
          </Card>
        </AnimatedContent>
      </section>

      <section id="pendidikan" className="school-section school-learning">
        <AnimatedContent distance={26} duration={0.68} threshold={0.22}>
          <div className="school-section-heading school-section-heading-narrow">
            <h2>Ruang belajar untuk pengetahuan, karakter, dan masa depan.</h2>
          </div>
        </AnimatedContent>
        <AnimatedContent distance={34} duration={0.76} delay={0.08} threshold={0.18}>
          <ol className="school-learning-list">
            {learningFocus.map((item) => (
              <li key={item.number}>
                <span>{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </AnimatedContent>
      </section>

      <section id="informasi" className="school-section school-information">
        <AnimatedContent
          className="school-motion-column"
          distance={28}
          duration={0.68}
          threshold={0.22}
        >
          <div className="school-information-intro">
            <h2>Data penting dalam satu tempat.</h2>
            <p>
              Informasi berikut merujuk pada profil resmi sekolah. Data kegiatan dan agenda akan
              ditambahkan setelah materi publik dari sekolah tersedia.
            </p>
          </div>
        </AnimatedContent>
        <AnimatedContent
          className="school-data-motion"
          distance={32}
          direction="horizontal"
          duration={0.74}
          threshold={0.2}
        >
          <Card className="school-data-card">
            <CardContent className="school-data-card-content">
              <dl className="school-data-list">
                <div>
                  <dt>Naungan</dt>
                  <dd>Yayasan Pondok Pesantren Salafiyah Darussalam</dd>
                </div>
                <div>
                  <dt>Luas tanah</dt>
                  <dd>1.035 m²</dd>
                </div>
                <div>
                  <dt>Daya listrik</dt>
                  <dd>PLN</dd>
                </div>
                <div>
                  <dt>Akses internet</dt>
                  <dd>Hingga 30 Mb</dd>
                </div>
                <div>
                  <dt>SK pendirian</dt>
                  <dd>PPD-SK/09/IV/2010</dd>
                </div>
                <div>
                  <dt>SK operasional</dt>
                  <dd>400.3.1/010/406.009/2025</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </AnimatedContent>
      </section>

      <section id="ppdb" className="school-ppdb">
        <div>
          <p className="school-kicker">Penerimaan peserta didik baru</p>
          <h2>Mulai percakapan dengan sekolah.</h2>
          <p>
            Jadwal, persyaratan, dan ketersediaan pendaftaran dikonfirmasi langsung melalui kontak
            resmi sekolah agar informasi yang diterima tetap tepat.
          </p>
        </div>
        <div className="school-ppdb-actions">
          <Button asChild size="lg" variant="secondary" className="school-button-light">
            <a
              href="https://wa.me/6285231586065?text=Assalamu%27alaikum%2C%20saya%20ingin%20menanyakan%20informasi%20pendaftaran%20SMP%20Islam%20Darussalam%20Dongko."
              target="_blank"
              rel="noreferrer"
            >
              Tanya melalui WhatsApp
            </a>
          </Button>
          <Button asChild variant="link" className="school-plain-link">
            <a href="mailto:smpislamdarussalamdongko@gmail.com">Kirim email</a>
          </Button>
        </div>
      </section>

      <section id="kontak" className="school-section school-contact">
        <div className="school-map-wrap">
          <iframe
            title="Peta lokasi SMP Islam Darussalam Dongko"
            src="https://www.google.com/maps?q=-8.1897,111.5703&z=15&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <AnimatedContent
          className="school-contact-copy"
          distance={30}
          duration={0.72}
          threshold={0.2}
        >
          <h2>Temukan kami di Dongko.</h2>
          <address>
            RT 01 RW 01, Desa Dongko
            <br />
            Kecamatan Dongko, Kabupaten Trenggalek
            <br />
            Jawa Timur 66363
          </address>
          <div className="school-contact-lines">
            <a href="tel:+6285231586065">
              <span>Telepon</span>
              <strong>0852 3158 6065</strong>
            </a>
            <a href="mailto:smpislamdarussalamdongko@gmail.com">
              <span>Email</span>
              <strong>smpislamdarussalamdongko@gmail.com</strong>
            </a>
          </div>
          <div className="school-contact-actions">
            <Button asChild size="lg" className="school-button-primary">
              <a
                href="https://www.google.com/maps/search/?api=1&query=-8.1897,111.5703"
                target="_blank"
                rel="noreferrer"
              >
                Buka Google Maps
              </a>
            </Button>
            <Button asChild variant="link" size="lg" className="school-text-link">
              <a href="http://smpidarussalamdongko.blogspot.com" target="_blank" rel="noreferrer">
                Kunjungi situs sekolah
              </a>
            </Button>
          </div>
        </AnimatedContent>
      </section>

      <footer className="school-footer">
        <div className="school-footer-brand">
          <Image src="/images/smp-islam-darussalam-dongko.svg" alt="" width={52} height={52} />
          <div>
            <strong>SMP Islam Darussalam Dongko</strong>
            <span>NPSN 20574648</span>
          </div>
        </div>
        <p>
          Informasi profil mengacu pada data referensi resmi sekolah. Konfirmasi agenda dan
          pendaftaran melalui kontak sekolah.
        </p>
        <Button asChild variant="link" size="sm" className="school-footer-link">
          <a href="#beranda">Kembali ke atas</a>
        </Button>
      </footer>
    </main>
  );
}
