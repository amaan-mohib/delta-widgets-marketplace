"use client";

import { APP_NAME } from "@/lib/constants";
import { tokens } from "@fluentui/react-components";
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconExternalLink,
} from "@tabler/icons-react";

export async function Footer() {
  return (
    <footer
      style={{ background: tokens.colorNeutralBackground2 }}
      className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              {APP_NAME}
            </h3>
            <p className="text-muted-foreground max-w-md">
              The ultimate widget maker for Windows. Create beautiful, dynamic
              desktop widgets without coding. Free, open source, and built with
              love.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Project</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.deltawidgets.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Documentation <IconExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/amaan-mohib/delta-widgets/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Releases <IconExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/amaan-mohib/delta-widgets/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Issues <IconExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/amaan-mohib/delta-widgets/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Discussions <IconExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.gg/wDE8KNx8fB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Discord <IconExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/amaan-mohib/delta-widgets/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Contributing <IconExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.buymeacoffee.com/amaan.mohib"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Support <IconExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/amaan-mohib"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Developer <IconExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://deltawidgets.com/terms-of-services"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Terms of Services
                </a>
              </li>
              <li>
                <a
                  href="https://deltawidgets.com/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {APP_NAME}. Open source under GPL-3.0
            License.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a
              href="https://github.com/amaan-mohib/delta-widgets/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors">
              GPL-3.0 License
            </a>
            <div className="flex space-x-4">
              <a
                href="https://github.com/amaan-mohib/delta-widgets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                <IconBrandGithub className="h-4 w-4" />
              </a>
              <a
                href="https://discord.gg/wDE8KNx8fB"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                <IconBrandDiscord className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
