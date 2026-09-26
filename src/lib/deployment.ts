// Deployment info injected at build time by Cloudflare Pages / Vite
declare const __CF_PAGES_COMMIT_SHA__: string
declare const __CF_PAGES_BRANCH__: string
declare const __CF_PAGES_URL__: string
declare const __BUILD_TIMESTAMP__: string
declare const __APP_VERSION__: string

export interface DeploymentInfo {
  version: string
  commitSha: string
  branch: string
  url: string
  buildTimestamp: string
  buildDate: string
  buildTime: string
  isProduction: boolean
}

function getDeploymentInfo(): DeploymentInfo {
  const buildDate = new Date(__BUILD_TIMESTAMP__)
  const isProd = __CF_PAGES_BRANCH__ === 'main' || __CF_PAGES_BRANCH__ === 'production'

  return {
    version: __APP_VERSION__,
    commitSha: __CF_PAGES_COMMIT_SHA__,
    branch: __CF_PAGES_BRANCH__,
    url: __CF_PAGES_URL__,
    buildTimestamp: __BUILD_TIMESTAMP__,
    buildDate: buildDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    buildTime: buildDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isProduction: isProd,
  }
}

export const deploymentInfo = getDeploymentInfo()
