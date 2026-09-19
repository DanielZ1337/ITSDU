# ITSDU

**Unofficial** desktop application for interacting with itslearning.

## Features
- **Streamlined Course Navigation:** Quickly access courses and assignments.
- **Quick Resource Management:** Easily find, download, and open resources.
- **Instant Notifications:** Receive real-time updates and announcements.
- **Personalized Dashboard:** Customize the dashboard to display important information.
- **Offline Access:** Access previously loaded materials without an internet connection.
- **User Settings:** Customize notification preferences and interface settings.
- **Performance Enhancements:** Optimized for faster load times and smoother interactions.

## Installation
1. Clone the repository:
```bash
git clone https://github.com/DanielZ1337/itsdu.git
```
2. Navigate to the project directory:
```bash
cd itsdu
``` 
4. Install dependencies:
```bash
npm install
```

## Usage
Run the application in development mode (Node 22.12+ or 24):

```bash
npm run dev
```

Develop without an itslearning account against the local mock API (see the `itslearning-mock-api` repo, expected as a
sibling folder or set `ITSLEARNING_MOCK_DIR`):

```bash
npm run dev:mock
```

## Scripts
| Script | Purpose |
| --- | --- |
| `npm run dev` / `dev:mock` | Development (real site / mock API) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` / `lint` / `format` | Biome |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | Builds with the mock allowed by the CSP and runs the Electron end-to-end tests (needs the mock repo and a desktop) |
| `npm run build` | Renderer + Electron bundles only |
| `npm run package` / `package:dir` | electron-builder (installers / unpacked folder) |
| `npm run win` / `mac` / `linux` / `release:*` | Build + package (+ publish for `release:*`) |

`ITSDU_PERF=1` prints startup timing marks from the main process. More in `docs/modernization/`.

## Build
How to build and run production application:

1. Build application

Linux:
```bash
npm run linux
```

Windows:
```bash
npm run win
```

macOS:
```bash
npm run mac
```

2. Run the application
- Built application will be in ```/releases/v{version}```
- Run setup executable.
- Executable for running without installing will be in ```{platform}-unpacked```

## Contributing
1. Fork the repository
2. Create a new branch (git checkout -b feature-branch)
3. Commit your changes (git commit -m 'Add new feature')
4. Push to the branch (git push origin feature-branch)
5. Create a new Pull Request

## License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/DanielZ1337/ITSDU/blob/main/LICENSE) file for details.

## More Information
For detailed features and release notes, visit the [official site](https://itsdu.danielz.dev) and [releases page](https://itsdu.danielz.dev/releases)

## Note
ITSDU is in no way affiliated with itslearning.
