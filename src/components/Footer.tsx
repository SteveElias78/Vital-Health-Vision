
export function Footer() {
  return (
    <footer className="art-deco-footer">
      <div className="container px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-light text-gold-400">Vital Health Vision</h3>
            <p className="mt-2 text-sm text-gold-300/70">
              A public health data analysis platform for research and decision making.
            </p>
          </div>
          <div>
            <h4 className="font-light text-gold-400">Features</h4>
            <ul className="mt-2 space-y-2 text-sm text-gold-300/70">
              <li>Data Exploration</li>
              <li>Demographic Analysis</li>
              <li>Geographic Visualization</li>
              <li>Predictive Modeling</li>
            </ul>
          </div>
          <div>
            <h4 className="font-light text-gold-400">Resources</h4>
            <ul className="mt-2 space-y-2 text-sm text-gold-300/70">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Data Sources</li>
              <li>Research Papers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-light text-gold-400">Legal</h4>
            <ul className="mt-2 space-y-2 text-sm text-gold-300/70">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Data Usage</li>
              <li>Accessibility</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 text-center text-sm border-t border-gold-500/30">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
            <span>Vital Health Vision • The Art of Health Analytics</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
