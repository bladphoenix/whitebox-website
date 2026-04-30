const socials = [
  { href: 'mailto:info@whitebox.asia', icon: 'fa-solid fa-envelope', title: 'Email' },
  { href: '#', icon: 'fa-brands fa-facebook-f', title: 'Facebook' },
  { href: '#', icon: 'fa-brands fa-tiktok', title: 'TikTok' },
  { href: '#', icon: 'fa-brands fa-x-twitter', title: 'Twitter / X' },
  { href: '#', icon: 'fa-brands fa-youtube', title: 'YouTube' },
]

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <p>&copy; 2026 Whitebox.asia &mdash; Jakarta, Indonesia.</p>
        <div className="footer-links">
          {socials.map((s) => (
            <a key={s.title} href={s.href} title={s.title}>
              <i className={s.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
