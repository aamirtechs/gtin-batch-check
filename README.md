# GTIN Batch Check
Live page: https://aamirtechs.github.io/gtin-batch-check/

Paste or upload a whole catalog and get every UPC, EAN and GTIN validated, check-digit-fixed and flagged in one CSV. It runs entirely in the browser so catalogues, files and text you paste stay on your device. Built for busy operators who need a correct answer and a downloadable file, not another account.

## Features
- CSV or paste input with GTIN and SKU column picker
- GS1 mod-10 validation for GTIN-8, GTIN-12, GTIN-13, GTIN-14 and ISBN-13
- Detect leading-zero loss, wrong length and wrong check digits
- Auto-compute a missing or wrong check digit
- Download an annotated CSV with valid, fixed or invalid verdict and reason

## How it works
Paste or upload your input, choose the options, and run the tool. Processing happens locally in src/logic.js and the page wiring. You can review the results on screen and download the output file.

## Privacy
Runs 100% in your browser. Your files never leave this device, nothing is uploaded,
and there is no tracking.

## Development
Core logic lives in `src/logic.js` and is shared by the page and the tests.
Run the tests with `npm test`.

## License
MIT, Copyright 2026 Amir Hussain.
