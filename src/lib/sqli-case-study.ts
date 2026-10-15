// Figures transcribed from the charts and README in the project repository.
// Keep these in step with the repo rather than restating them from memory.

export const sqliCaseStudy = {
  title: "Enhancing SQL Injection Detection in OWASP ZAP",
  subtitle: "BSc dissertation, Keele University",
  repo: "https://github.com/DeGro19/Enhancing-SQL-Injection-Vulnerability-Detection-in-Open-Source-Scanners-using-Payload-Fuzzing",
  summary:
    "OWASP ZAP's default payloads find textbook SQL injection reliably and miss advanced, encoded and time-based vectors. I built a context-aware payload library of 1,429 payloads and adaptive fuzzing logic to close that gap, then measured the difference against a controlled WebGoat testbed.",
  headline: [
    { value: "1,429", label: "Custom payloads" },
    { value: "388", label: "Detections (vs 122 default)" },
    { value: "+218%", label: "More vulnerabilities found" },
    { value: "27.2%", label: "Payload reflection rate (vs 18.7%)" },
  ],
  method: [
    "Target and tooling both run in Docker so every experiment is reproducible and fully isolated from any production network.",
    "OWASP WebGoat v8 as the deliberately vulnerable testbed, giving a legal, repeatable target with known-vulnerable endpoints.",
    "A custom payload library of 1,429 entries spanning Boolean, time-delay, error-based, union, blind, nested and encoded vectors, with obfuscation via Base64, Unicode and hexadecimal.",
    "A fuzzing harness feeding the library into ZAP's active scanner through its scripting interface, handling session and stateful flows.",
    "An evaluation script running repeatable scans and exporting results to CSV and JSON for analysis.",
  ],
  charts: [
    {
      src: "/projects/sqli/total-sql-injection-vulnerabilities-detected.png",
      alt: "Bar chart comparing total reflected SQL injection detections: custom payloads 388, OWASP ZAP defaults 122",
      title: "Total detections",
      caption:
        "388 reflected SQL injection detections against 122 from ZAP's default payload set, on the same target under the same configuration. That is the +218% headline.",
    },
    {
      src: "/projects/sqli/sqli-detection-breakdown-by-attack-vector.png",
      alt: "Stacked bar chart of detections by SQL injection type for custom payloads versus OWASP ZAP",
      title: "Where the gap actually is",
      caption:
        "The aggregate hides the interesting result. Boolean-based injection roughly doubles (55 to 120), but blind injection goes from 10 to 46 and union-based from 18 to 65. The defaults are weakest precisely where detection is hardest.",
    },
    {
      src: "/projects/sqli/payload-reflection-rates.png",
      alt: "Pie charts showing payload reflection rates of 27.2% for custom payloads and 18.7% for OWASP ZAP",
      title: "Payload reflection rate",
      caption:
        "27.2% of custom payloads were reflected in responses against 18.7% of the defaults, an 8.5 percentage point improvement. A higher reflection rate means less of the scan budget is wasted on payloads the application never echoes.",
    },
    {
      src: "/projects/sqli/reflected-sqli-detection-via-http-response-analysis.png",
      alt: "Heatmap of reflected SQL injection detections by HTTP status code for both payload sets",
      title: "Detections by HTTP status",
      caption:
        "381 of the 388 custom-payload detections came back on HTTP 200 rather than 500. The gain is not simply from provoking more server errors, which matters: error-driven detection is noisy and easy to dismiss as false positives.",
    },
  ],
  outcomes: [
    "Awarded Best Poster at Keele Town Hall",
    "Nominated for Student of the Year 2025",
    "Currently being co-published with Dr. Amro Al-Said Ahmad",
  ],
} as const;
