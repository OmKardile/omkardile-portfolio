/* Route-level loading state. Shows whenever a navigation streams in — the
   hairline progress bar pins to the very top of the viewport while the
   center spinner keeps short pages from collapsing to a blank flash. The
   header/footer from layout.tsx stay mounted around it. */
export default function Loading() {
  return (
    <>
      <div className="route-bar" aria-hidden="true">
        <span />
      </div>
      <div className="route-loader" role="status" aria-live="polite">
        <span className="route-spin" aria-hidden="true" />
        <p className="mono route-text">Loading</p>
      </div>
    </>
  );
}
