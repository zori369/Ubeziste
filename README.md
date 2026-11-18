# Убежище Марина — website

Static bilingual website with interactive rescue guide. Original colours, artwork and logo retained. Rescue guidance is general and should be checked by wildlife specialists; contact details are from the existing site.

## Development
Serve from the repository root (e.g. `python -m http.server 8000`). URLs: /, /namerih-divo-zhivotno/, /en/, /en/found-a-wild-animal/. The 25-node decision tree has 14 outcomes, with static guidance and direct contacts on both rescue pages.

## Background optimization
The original PNG remains the active image; it is not yet compressed. Install Pillow and beautifulsoup4 (`python -m pip install Pillow beautifulsoup4`), run `python tools/optimize_background.py`, inspect all generated WebPs and the homepage layout, and commit the generated files together with both updated homepages. The original PNG remains as fallback.

## SEO checks
Submit https://www.ubeziste.com/sitemap.xml in Google Search Console, request indexing for the four pages, and measure mobile LCP with PageSpeed Insights after deployment. No ranking or production performance results are guaranteed.
