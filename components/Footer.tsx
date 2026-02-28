export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div>
            <p>&copy; {currentYear} Cadence. Service-Disabled Veteran Founded.</p>
          </div>
          <div className="flex gap-6">
            <a 
              href="/support" 
              className="hover:text-white transition-colors"
            >
              Support
            </a>
            <a 
              href="/privacy" 
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
