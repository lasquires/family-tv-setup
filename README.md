# Family TV setup

Open https://lasquires.github.io/family-tv-setup/ on your laptop. Download and extract the ZIP, then run `installer/Start-Setup.cmd` on Windows or `bash installer/Start-Setup.command` on Mac/Linux.

The local wizard creates a separate home or opens a home you explicitly select, discovers TVs, identifies LG/Samsung models, guides the supported root setup, installs household controls and direct TV-to-cloud sync, and waits for a confirmed dashboard command before showing the private phone link and QR code. Windows prepares a verified portable Python runtime; Mac/Linux require Python 3. OpenSSH is used for LG installation.

LG uses the pinned no-USB SlopBro route. Samsung uses a hash-verified Apps2Samsung CLI download, personal Samsung signing, TV Developer Mode prompts and Vetro root/pairing checks. Firmware compatibility varies. No universal root guarantee is made.

All enrolled TVs for the selected household appear together at https://family-tv-households.adoredhotel2.chatgpt.site/. A private parent credential is required. The TV agents connect outward over HTTPS, so no router configuration is needed and the laptop can close after setup. TVs must be online for commands; remote wake is not included. IP changes do not change cloud device identity.

This is a test release. Automated isolation, installation safeguards, update rollback, hosted enrollment/acknowledgement and portable-runtime checks pass. Factory-default LG and Samsung hardware acceptance and cold-boot recovery still need verification. Existing legacy Family TV installations are not silently imported or transferred. The dashboard now renders the original Family TV phone app, with first-use household PIN setup and its existing app protection, uninstall, schedule and home-settings controls. The LG installer activates the repository's standard home preset once and preserves later customizations. Tested GitHub releases update the household phone dashboard and LG agents with automatic updates enabled. The TV-resident Samsung installer adapter does not yet consume automatic releases; Samsung updates still use the PC bridge.

The ZIP includes the implementation source, platform adapters, pinned upstream sources and license notices. It contains no household credentials, SSH keys, Samsung certificates or user TV addresses. Keep the `.family-tv` folder created in your user profile as a private recovery backup. `family-tv-setup.sha256` records the package digest.

The original `lasquires/family-tv` repository and original household deployment are separate. Public release files are explicit allowlisted files; never upload local credentials or setup state.
