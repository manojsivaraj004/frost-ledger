import type { DeploymentInfo } from '../lib/deployment'
import { deploymentInfo } from '../lib/deployment'
import { GitBranch, GitCommit, Clock, Globe, CheckCircle2, AlertCircle } from 'lucide-react'

export default function DeploymentInfo({ compact = false }: { compact?: boolean }) {
  const info: DeploymentInfo = deploymentInfo
  const shortSha = info.commitSha.length > 8 ? info.commitSha.slice(0, 8) : info.commitSha

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-frost-text3">
        {info.isProduction ? <CheckCircle2 className="w-3.5 h-3.5 text-frost-success" /> : <AlertCircle className="w-3.5 h-3.5 text-frost-warn" />}
        <span className="font-mono">v{info.version}</span>
        <span className="text-frost-border2">·</span>
        <span className="font-mono">{shortSha}</span>
        <span className="text-frost-border2">·</span>
        <span>{info.buildDate}</span>
      </div>
    )
  }

  return (
    <div className="fp-panel p-5">
      <h3 className="text-sm font-semibold text-frost-text mb-4 flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-frost-accent" /> Deployment Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="fp-section-title w-20">Status</span>
            {info.isProduction ? <span className="fp-badge-success"><CheckCircle2 className="w-3 h-3" /> Production</span> : <span className="fp-badge-warn"><AlertCircle className="w-3 h-3" /> Preview</span>}
          </div>
          <div className="flex items-center gap-2"><span className="fp-section-title w-20">Version</span><span className="text-sm text-frost-text font-mono">v{info.version}</span></div>
          <div className="flex items-center gap-2"><span className="fp-section-title w-20">Build ID</span><span className="text-sm text-frost-text font-mono">{shortSha}</span></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2"><GitBranch className="w-3.5 h-3.5 text-frost-text3" /><span className="fp-section-title w-16">Branch</span><span className="text-sm text-frost-text2 font-mono">{info.branch}</span></div>
          <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-frost-text3" /><span className="fp-section-title w-16">Date</span><span className="text-sm text-frost-text2">{info.buildDate}</span></div>
          <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-frost-text3" /><span className="fp-section-title w-16">Time</span><span className="text-sm text-frost-text2 font-mono">{info.buildTime}</span></div>
        </div>
      </div>
      <div className="fp-divider my-4" />
      <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-frost-text3" /><span className="fp-section-title w-16">URL</span><a href={info.url} target="_blank" rel="noopener noreferrer" className="text-sm text-frost-accent hover:text-frost-glow font-mono truncate">{info.url}</a></div>
    </div>
  )
}