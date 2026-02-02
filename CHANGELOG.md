# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Future Backlog]

### Added

- 13/26-card hands option for two player games (per feedback request)
- More themes - Lunar new year theme!
- 🌏 Localization - language features for diverse player bases (Indonesian, Chinese, etc.)
- Add feature for majority vote to end game and return to lobby
- Add bot players option for multiplayer games
- Improved bot skill
- More to come soon!

## [1.5.0] - 2026-02-02

Happy new years everyone, thanks for playing Big Two in 2025 and providing feedback through our [Feedback Form]! 🥳

Apologies if updates have been slow, work has been busy lately. 😅

### Added

- Rule for 5-card poker hands to be interrupted/stacked upon by other higher value combinations (i.e. Flush > Straight, etc.)
  - Includes additional familiar combo interaction behaviors.
    - Straight Flush > Four-of-a-Kind (AKA bomb) > Full House > Flush > Straight
    - Straight Flush should be able to beat any 5-card combo
    - If bombs are disabled, Four-of-a-Kind bombs will not be usable
    - Four-of-a-Kind falls in between Full House and Straight Flush, requiring one extra card to play as a 5-card combo
  - Thank you players for your detailed feedback requests about this! 🫡
  - Additional sources used for rules:
    - https://en.wikipedia.org/wiki/Big_two#Combinations
    - https://evenbetgaming.com/knowledge-base/glossary/big-2-variations
    - https://www.pagat.com/climbing/bigtwo.html
- Rule to disable Four-of-a-Kind bombs that override all combos
- Rule to allow flushes to be ranked by suit instead of highest rank card
- Rule sets to easily switch to preset rule variations

### Changed

- Lobby form modal to shrink via scroll region inside of modal body

## [1.4.0] - 2025-10-27

### Added

- Ko-fi support link/text!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X31NFVB9)

## [1.3.1] - 2025-10-05

### Changed

- Bugfix: Refactored suit order editing logic to prevent having multiple suit order rules enabled

## [1.3.0] - 2025-10-02

### Added

- Per [Feedback Form] feature request, added new suit order (gamma) for diamonds < clubs < hearts < spades

## [1.2.1] - 2025-06-22

### Added

- Idle lobbies that have not started a game in 48 hours will be deleted automatically

### Changed

- Update `next` to 14.2.30
- Update `@biomejs/biome` to 2.0.4

### Fixed

- For development, fixed HTTP status codes for /api/lobbies via early returns

## [1.2.0] - 2025-05-31

### Added

- Offline singleplayer mode against bots, no network connection needed

## [1.1.1] - 2025-05-31

### Added

- Deleting settings records upon clearing lobbies to prevent database bloat
- Helper warning toast when violating lowest card rule

### Changed

- Changed home page lobby and game info updating from polling to websockets

### Fixed

- Fixed rendering lists with duplicate empty player id keys

## [1.1.0] - 2024-06-13

### Added

- Allow playing with multiple decks - thanks to anonymous feedback request!
- New card theme "Hanhaechi" (Credit to https://github.com/hanhaechi/playing-cards)

### Changed

- Changed card back for the "Classic" theme
- Improved card image quality by turning off Next Image optimization
- Reduced "Play Action" toast duration from 2500 to 1500
- Updated to Next 14

## [1.0.2] - 2024-04-15

### Changed

- Updated lobby list to have fixed height for CLS concerns

## [1.0.1] - 2023-10-22

### Added

- Version link in bottom left corner
- CHANGELOG.md

### Changed

- Upgrade dependencies

### Removed

- Home announcement toast from main page

## [1.0.0] - 2023-10-22

### Added

- All existing functionality as of 10-22-2023

[unreleased]: https://github.com/AdoryVo/big-two/compare/v1.1.0...HEAD
[1.5.0]: https://github.com/AdoryVo/big-two/releases/tag/v1.5.0
[1.4.0]: https://github.com/AdoryVo/big-two/releases/tag/v1.4.0
[1.3.1]: https://github.com/AdoryVo/big-two/releases/tag/v1.3.1
[1.3.0]: https://github.com/AdoryVo/big-two/releases/tag/v1.3.0
[1.2.1]: https://github.com/AdoryVo/big-two/releases/tag/v1.2.1
[1.2.0]: https://github.com/AdoryVo/big-two/releases/tag/v1.2.0
[1.1.1]: https://github.com/AdoryVo/big-two/releases/tag/v1.1.1
[1.1.0]: https://github.com/AdoryVo/big-two/releases/tag/v1.1.0
[1.0.0]: https://github.com/AdoryVo/big-two/releases/tag/v1.0.0
[Feedback Form]: https://forms.gle/jPd276dcsLVPswBZ7