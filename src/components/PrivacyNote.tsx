import { LockKeyhole } from 'lucide-react'

export function PrivacyNote() {
  return (
    <p className="my-8 text-center text-sm blur-[0.25px] tracking-tight text-ink-ghost">
      <LockKeyhole 
        className="mr-1 inline-block size-3.5 -translate-y-px align-middle" 
        strokeWidth={1.5} 
      />
      Your images never leave your browser.
      <br />
      We don't upload, store or see your files.
    </p>
  )
}