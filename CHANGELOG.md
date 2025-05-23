# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- More to come soon!

### Changed

- Require majority vote to end game and return to lobby

## [1.2.0] - 2025-05-13

### Added

- Deleting settings records upon clearing lobbies to prevent database bloat

### Changed

- Changed from Pusher to Supabase Realtime
- Changed home page lobby and game info updating from polling to websockets

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
[1.1.0]: https://github.com/AdoryVo/big-two/releases/tag/v1.1.0
[1.0.0]: https://github.com/AdoryVo/big-two/releases/tag/v1.0.0
