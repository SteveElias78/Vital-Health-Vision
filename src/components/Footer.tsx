export function Footer() {
  return <footer className="py-8 text-gray-300 bg-rose-950">
      <div className="container px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Vital Health Vision</h3>
            <p className="mt-2 text-sm">
              A public health data analysis platform for research and decision making.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">Features</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>Data Exploration</li>
              <li>Demographic Analysis</li>
              <li>Geographic Visualization</li>
              <li>Predictive Modeling</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white">Resources</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Data Sources</li>
              <li>Research Papers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white">Legal</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Data Usage</li>
              <li>Accessibility</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>© 2025 Vital Health Vision. For educational purposes only.</p>
        </div>
      </div>
    </footer>;
}