# Green Hydrogen World

Complete interactive Three.js city, with 12 narrated locations, city tour, day/night/sketch views, animated vehicles, and background music. The latest Aviation hub audio and station sign/glass repairs are included.

## Publish and get a shareable link

1. Extract the ZIP. Upload the CONTENTS of this folder into a new GitHub repository named, for example, hydrogen-world. The repository root should contain dist, serve.cjs, README.md and .github/workflows/pages.yml. Do not upload the ZIP itself or an extra enclosing folder.
2. A public repository is the simplest option for GitHub Pages on a free account. GitHub Desktop can publish the extracted folder, including its hidden .github folder. If using the website uploader, verify .github/workflows/pages.yml was included; otherwise create that file in GitHub and paste the supplied workflow.
3. In the repository, open Settings > Pages. Under Build and deployment, choose GitHub Actions as the Source.
4. Open Actions > Publish Hydrogen City > Run workflow (select main). Future pushes to main or master redeploy automatically.
5. Wait for the workflow to succeed. Settings > Pages will show the live address, usually https://YOUR-USERNAME.github.io/hydrogen-world/ . Share that link; visitors can interact with the city without installing anything or keeping your computer running.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Preview or edit locally

Install Node.js, open a terminal in this folder, run `node serve.cjs`, then visit http://localhost:4173 . Do not open index.html directly from File Explorer. No npm install or build is required.

## Files

- dist/index.html and style.css: page and glass interface.
- dist/renewables.js: editable scene, geometry, camera, routes and location data.
- dist/boot.js, reveal.js, responsive.js, wireframe.js: loading, reveal, responsive layout and sketch mode.
- dist/music.js and narration.js: music, muting and section narration.
- dist/assets/voice/01.mp3 through 12.mp3: narration in menu order.
- dist/assets/hydrogen-background.mp3: background soundtrack.
- dist/vendor/: bundled Three.js and OrbitControls; no CDN dependency for the scene.

The files in dist ARE the editable application source. All models are generated in JavaScript; no separate 3D model files or backend are required. All site asset URLs are relative, supporting a repository subpath on Pages. Google Fonts is optional; system-font fallbacks are present.

Browsers may require an initial user gesture before audible playback. The existing music control also mutes narration. Publishing does not bypass browser autoplay rules.

## Updating later

Edit the files in dist, commit and push. For audio, replace the corresponding numbered MP3 in dist/assets/voice/. When changing the size of a module listed in dist/boot-manifest.json, update its byte count. GitHub Actions publishes only dist, keeping development checks off the website.
