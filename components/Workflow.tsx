const steps = [
  {
    num: '01',
    title: 'Konsultasi',
    desc: 'Diskusikan kebutuhan proyek, target SEO, atau spesifikasi server via WA/Telegram.',
    delay: '',
  },
  {
    num: '02',
    title: 'Penawaran & DP',
    desc: 'Estimasi biaya dan waktu dikirim. Pengerjaan dimulai setelah konfirmasi DP.',
    delay: ' reveal-d1',
  },
  {
    num: '03',
    title: 'Eksekusi',
    desc: 'Development website, setup VPS, atau audit domain sesuai paket yang dipilih.',
    delay: ' reveal-d2',
  },
  {
    num: '04',
    title: 'Serah Terima',
    desc: 'Review hasil kerja, pelunasan, dan penyerahan akses penuh (FTP/Shell/cPanel).',
    delay: ' reveal-d3',
  },
]

export default function Workflow() {
  return (
    <section id="alur">
      <div className="section-wrap">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-label">Alur Kerja</div>
          <h2 className="section-title">Proses Transparan</h2>
          <p className="section-sub">4 langkah sederhana menuju proyek sukses.</p>
        </div>

        <div className="workflow-steps">
          {steps.map((s) => (
            <div className={`step-item reveal${s.delay}`} key={s.num}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
