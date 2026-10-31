/* Footer for every /uiux page — one credit line, per the portfolio spec. */
export function UiuxFooter() {
  return (
    <footer className="ux-footer">
      <p>
        Designed &amp; developed by{' '}
        <a href="https://omkardile.is-a.dev/" target="_blank" rel="noopener noreferrer" data-hint="Live site · new tab">
          Omkar Kardile
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </footer>
  );
}
