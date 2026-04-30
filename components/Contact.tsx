export default function Contact() {
  return (
    <section id="kontak">
      <div className="section-wrap">
        <div className="contact-inner reveal">
          <div className="section-label" style={{ display: 'block', textAlign: 'center' }}>
            Kontak
          </div>
          <h2 className="contact-title">
            Siap Mulai<br />Proyek Anda?
          </h2>
          <p className="contact-sub">
            Hubungi kami langsung untuk cek stok domain, konsultasi infrastruktur, atau
            pendaftaran kursus webshell.
          </p>

          <div className="contact-btns">
            <a
              href="https://wa.me/6287821381136"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn btn-wa"
            >
              <i className="fa-brands fa-whatsapp" /> WhatsApp
            </a>
            <a
              href="https://t.me/+6287821381136"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn btn-tg"
            >
              <i className="fa-brands fa-telegram" /> Telegram
            </a>
          </div>

          <div className="contact-avail">
            <span className="avail-dot" />
            <span>Tersedia Senin–Sabtu, 09.00–21.00 WIB</span>
          </div>
        </div>
      </div>
    </section>
  )
}
