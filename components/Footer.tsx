export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
          <div className="flex justify-center">
            <a href="https://www.hitwebcounter.com/" target="_blank" rel="noreferrer">
              <img
                src="https://hitwebcounter.com/counter/counter.php?page=21486814&style=0005&nbdigits=5&type=page&initCount=0"
                title="Free Tools"
                alt="Free Tools"
              />
            </a>
          </div>
          <div className="text-center border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400">Need a site built? <a href="mailto:help@demarickwebb.dev" className="hover:text-white transition-colors font-semibold">Holler at help@demarickwebb.dev</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
