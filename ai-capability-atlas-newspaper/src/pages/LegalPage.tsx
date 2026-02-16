import PageWrapper from "@/components/layout/PageWrapper";

export default function LegalPage() {
  return (
    <PageWrapper>
      <header className="bg-card px-6 pt-8 pb-6 border-b border-border safe-area-inset-top">
        <h1 className="text-2xl font-bold text-foreground">Legal & Privacy</h1>
        <p className="text-muted-foreground mt-1">
          PermitPath is for guidance only and does not replace official permitting advice.
        </p>
      </header>
      <div className="px-4 py-6 space-y-6">
        <section className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">Disclaimer</h2>
          <p className="text-sm text-muted-foreground">
            PermitPath provides informational guidance based on user inputs and available data.
            It is not legal advice and does not guarantee permitting outcomes. Always confirm
            requirements with the appropriate jurisdiction before starting work.
          </p>
        </section>
        <section className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">Privacy</h2>
          <p className="text-sm text-muted-foreground">
            We store job details, uploaded photos, and chat history in a secure database to
            support your workflow. We do not sell personal data. Access is restricted to the
            authenticated account that created the data.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
