const techs = [
  { icon: 'fa-brands fa-php', label: 'PHP' },
  { icon: 'fa-brands fa-python', label: 'Python' },
  { icon: 'fa-brands fa-android', label: 'Kotlin' },
  { icon: 'fa-brands fa-docker', label: 'Docker' },
  { icon: 'fa-brands fa-microsoft', label: 'Azure' },
  { icon: 'fa-solid fa-server', label: 'cPanel' },
  { icon: 'fa-brands fa-css3-alt', label: 'Tailwind CSS' },
  { icon: 'fa-brands fa-aws', label: 'AWS' },
  { icon: 'fa-brands fa-digital-ocean', label: 'DigitalOcean' },
  { icon: 'fa-solid fa-terminal', label: 'Ubuntu / Debian' },
]

// Duplicate for seamless infinite scroll
const items = [...techs, ...techs]

export default function TechMarquee() {
  return (
    <div className="tech-bar">
      <div className="marquee-track">
        {items.map((t, i) => (
          <div className="marquee-item" key={i}>
            <i className={t.icon} />
            {t.label}
          </div>
        ))}
      </div>
    </div>
  )
}
