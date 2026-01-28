const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/eunu' },
  { name: 'Email', href: 'mailto:contact@eunu.log' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-grey-100)] bg-[var(--color-grey-50)]">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-sm text-[var(--color-grey-600)]">
            <p>© 2025 eunu.log. All rights reserved.</p>
          </div>

          {/* Social Links */}
          <ul className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-grey-600)] hover:text-[var(--color-toss-blue)] transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
